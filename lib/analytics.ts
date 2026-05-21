// Thin client for the Cloudflare Worker (rate-limit + usage analytics).
// All image processing happens locally in the browser via WASM — the Worker
// only sees small JSON events.

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL ?? '';

export type LimitInfo = {
  remaining: number;
  resetAt: number; // unix ms
  limit: number;
};

export type TrackPayload = {
  bytes: number;
  durationMs: number;
  mime: string;
};

async function call<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!WORKER_URL) return null;
  try {
    const res = await fetch(`${WORKER_URL}${path}`, {
      ...init,
      headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function checkLimit() {
  return call<LimitInfo>('/api/limit');
}

export function trackRemoval(payload: TrackPayload) {
  return call<LimitInfo>('/api/track', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
