/**
 * CutBG analytics + rate-limit Worker.
 *
 * Image processing happens entirely in the user's browser via WASM. This Worker
 * only sees small JSON events for two purposes:
 *   1. Per-IP rate limiting (a soft cap on free use)
 *   2. Coarse usage stats (count, total bytes, avg duration) per UTC day
 *
 * Endpoints:
 *   GET  /api/limit   → { limit, remaining, resetAt }
 *   POST /api/track   → { limit, remaining, resetAt }   (also increments stats)
 *   GET  /api/health  → { ok: true }
 *
 * All other routes return 404. CORS is restricted to ALLOWED_ORIGIN.
 */

export interface Env {
  RATE_LIMITS: KVNamespace;
  STATS: KVNamespace;
  ALLOWED_ORIGIN: string; // e.g. "https://cutbg.app"
  RATE_LIMIT_PER_HOUR: string; // numeric string, e.g. "20"
}

type TrackBody = {
  bytes?: number;
  durationMs?: number;
  mime?: string;
};

type LimitResponse = {
  limit: number;
  remaining: number;
  resetAt: number; // unix ms
};

const HOUR_MS = 60 * 60 * 1000;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') ?? '';

    if (request.method === 'OPTIONS') {
      return preflight(origin, env);
    }

    if (url.pathname === '/api/health') {
      return json({ ok: true }, origin, env);
    }

    if (url.pathname === '/api/limit' && request.method === 'GET') {
      const info = await readLimit(request, env);
      return json(info, origin, env);
    }

    if (url.pathname === '/api/track' && request.method === 'POST') {
      const info = await incrementLimit(request, env);
      if (info.remaining < 0) {
        return json(
          { ...info, error: 'rate_limited' },
          origin,
          env,
          429,
        );
      }
      let body: TrackBody = {};
      try {
        body = (await request.json()) as TrackBody;
      } catch {
        /* tolerate empty/invalid bodies */
      }
      ctx.waitUntil(recordStats(env, body));
      return json(info, origin, env);
    }

    return json({ error: 'not_found' }, origin, env, 404);
  },
} satisfies ExportedHandler<Env>;

function clientIp(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

function currentWindow(): { key: string; resetAt: number } {
  const now = Date.now();
  const windowStart = Math.floor(now / HOUR_MS) * HOUR_MS;
  return { key: String(windowStart), resetAt: windowStart + HOUR_MS };
}

async function readLimit(request: Request, env: Env): Promise<LimitResponse> {
  const limit = Math.max(1, Number(env.RATE_LIMIT_PER_HOUR ?? '20'));
  const ip = clientIp(request);
  const { key, resetAt } = currentWindow();
  const k = `rl:${ip}:${key}`;
  const current = Number((await env.RATE_LIMITS.get(k)) ?? '0');
  return { limit, remaining: Math.max(0, limit - current), resetAt };
}

async function incrementLimit(request: Request, env: Env): Promise<LimitResponse> {
  const limit = Math.max(1, Number(env.RATE_LIMIT_PER_HOUR ?? '20'));
  const ip = clientIp(request);
  const { key, resetAt } = currentWindow();
  const k = `rl:${ip}:${key}`;
  const current = Number((await env.RATE_LIMITS.get(k)) ?? '0');
  const next = current + 1;
  // TTL slightly longer than the window so the key naturally expires.
  await env.RATE_LIMITS.put(k, String(next), {
    expirationTtl: Math.ceil((resetAt - Date.now()) / 1000) + 60,
  });
  return { limit, remaining: limit - next, resetAt };
}

async function recordStats(env: Env, body: TrackBody): Promise<void> {
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD UTC
  const key = `stats:${day}`;
  type Stats = { count: number; bytes: number; durationMs: number };
  const prev: Stats = JSON.parse(
    (await env.STATS.get(key)) ?? '{"count":0,"bytes":0,"durationMs":0}',
  );
  const next: Stats = {
    count: prev.count + 1,
    bytes: prev.bytes + (Number(body.bytes) || 0),
    durationMs: prev.durationMs + (Number(body.durationMs) || 0),
  };
  // Keep daily stats around for ~90 days.
  await env.STATS.put(key, JSON.stringify(next), { expirationTtl: 60 * 60 * 24 * 90 });
}

function corsHeaders(origin: string, env: Env): HeadersInit {
  const allowed = env.ALLOWED_ORIGIN || '*';
  const allow = allowed === '*' ? '*' : origin === allowed ? origin : allowed;
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function preflight(origin: string, env: Env): Response {
  return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
}

function json(data: unknown, origin: string, env: Env, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...corsHeaders(origin, env),
    },
  });
}
