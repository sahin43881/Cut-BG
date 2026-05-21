# CutBG

A free, fast, **private** background remover. Drop an image — get a transparent PNG. No signup, no upload, no server-side AI calls.

All image processing happens locally in the browser via WebAssembly (`@imgly/background-removal`). A thin Cloudflare Worker handles per-IP rate-limiting and coarse usage analytics; it never sees your images.

## Stack

- **Next.js 14** (App Router, TypeScript) — deployed to Cloudflare Pages
- **TailwindCSS** — styling, dark mode, checkerboard utility for transparent previews
- **TanStack Query** — mutation state, progress, per-image cache
- **`@imgly/background-removal`** — WASM-based ISNet model running in the browser
- **Cloudflare Worker + KV** — rate limit + usage stats only (no image data)

## Local development

```bash
# 1. Install deps (Node 20+)
npm install

# 2. Configure env
cp .env.example .env.local
# Leave NEXT_PUBLIC_WORKER_URL empty for local-only use — the UI works without it.

# 3. Run the Next.js dev server
npm run dev          # → http://localhost:3000

# 4. (Optional) Run the Worker locally in another shell
npm run worker:dev   # → http://localhost:8787
```

First-run note: the WASM model (~30 MB) downloads from the imgly CDN on first use. After that it's cached by the browser and works offline.

## Project layout

```
.
├── app/                     # Next.js App Router
│   ├── layout.tsx           # root layout, fonts, metadata
│   ├── providers.tsx        # React Query + theme bootstrap (client)
│   ├── page.tsx             # homepage (hero, upload, result, how-it-works)
│   └── globals.css          # Tailwind + checkerboard pattern
├── components/
│   ├── UploadZone.tsx       # drag-drop + file picker + validation
│   ├── ResultView.tsx       # download + share + slider + side-by-side
│   ├── BeforeAfterSlider.tsx
│   ├── ProgressBar.tsx
│   ├── HowItWorks.tsx
│   ├── UseCases.tsx
│   ├── Footer.tsx
│   └── ThemeToggle.tsx
├── hooks/
│   └── useRemoveBg.ts       # TanStack Query mutation + content-hash cache
├── lib/
│   ├── queryClient.ts
│   └── analytics.ts         # client for the Worker
├── worker/
│   └── index.ts             # Cloudflare Worker (rate-limit + stats)
├── public/examples/         # sample images for use-case cards
├── wrangler.toml
├── next.config.js           # COOP/COEP for SharedArrayBuffer
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

## Why browser-side?

- **Privacy.** Your image never leaves your device.
- **Cost.** Zero per-image API fees. Hosting is a static Pages site + a near-free Worker.
- **Speed.** No round-trip. After the first model download, processing is ~1–3s on a modern laptop.
- **Offline.** The model is cached by the browser; subsequent runs work without a network.

## Deploying

### 1. Frontend → Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy .next --project-name cutbg
```

Or connect the repo via the Cloudflare dashboard:
- Build command: `npm run build`
- Build output: `.next`
- Environment variable: `NEXT_PUBLIC_WORKER_URL=https://cutbg-api.<your-subdomain>.workers.dev`

> If you use the official `@cloudflare/next-on-pages` adapter, run it before deploy. For pure-static export (no dynamic routes) you can also `next build && next export` and deploy the `out/` folder.

### 2. Worker → Cloudflare Workers

```bash
# Create KV namespaces (dev + production)
wrangler kv namespace create rate_limits
wrangler kv namespace create stats
wrangler kv namespace create rate_limits --env production
wrangler kv namespace create stats --env production

# Paste the returned IDs into wrangler.toml (REPLACE_WITH_*_KV_ID slots)

# Deploy
npm run worker:deploy                       # default env
wrangler deploy --env production --config wrangler.toml
```

Set `ALLOWED_ORIGIN` in `wrangler.toml` (or via `wrangler secret put` for a per-env override) to your Pages domain. Update `NEXT_PUBLIC_WORKER_URL` on Pages to point at the deployed Worker.

## Configuration

| Var | Where | Default | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_WORKER_URL` | Pages env | `""` (no Worker) | Browser → Worker base URL |
| `ALLOWED_ORIGIN` | `wrangler.toml` | `http://localhost:3000` | CORS allow-list |
| `RATE_LIMIT_PER_HOUR` | `wrangler.toml` | `20` | Per-IP requests per hour |

## Browser support

- Chrome / Edge / Brave / Arc: full speed (WebGPU when available)
- Firefox: CPU-only, ~2× slower
- Safari 17+: works; WebGPU varies by version
- Mobile Safari / Chrome Android: works on modern devices but the first run downloads ~30 MB

## Launch checklist

- [ ] `wrangler login` and Cloudflare account connected
- [ ] KV namespaces created and IDs pasted into `wrangler.toml`
- [ ] Worker deployed: `npm run worker:deploy`
- [ ] Pages project created with `NEXT_PUBLIC_WORKER_URL` set
- [ ] Custom domain pointed at Pages (and optional `api.` route to Worker)
- [ ] Verified on mobile, in dark mode, and on a throttled connection

## License

MIT.
