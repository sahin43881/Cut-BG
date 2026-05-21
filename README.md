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
