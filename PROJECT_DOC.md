# CutBG — Project Documentation (Bangla)

Ei file e poro project ta sompurno explain kora ache — ki use korechi, kon file kon kaj kore, kibhabe sob mile kaj kore.

---

## 1. Project ki?

**CutBG** ekta **free, private, browser-based background remover** web app.

- User ekta image upload kore
- Browser er moddhe AI model chole → background remove kore dey
- User transparent PNG download kore, ba kono color background select kore download kore
- **Image kokhonoi server e jay na** — sob processing browser er moddhe hoy

### Main feature gulo:
- Drag & drop ba click kore image upload
- 100% browser-side AI processing (WASM)
- Result preview with before/after slider
- 10+ background color options + custom color picker
- Transparent PNG ba colored PNG download
- Dark/Light mode (theme remember kore)
- Fully responsive (mobile + desktop)
- Cloudflare Worker (optional) — rate limit + usage analytics er jonno

---

## 2. Technology Stack (ki ki use korechi)

| Technology | Kaj |
|---|---|
| **Next.js 14** | React framework, App Router (TypeScript) |
| **TypeScript** | Type safety |
| **TailwindCSS** | Styling — utility-first CSS |
| **TanStack Query** | Mutation state, progress tracking, per-image cache |
| **@imgly/background-removal** | WASM-based AI model jeta browser e chole |
| **Cloudflare Worker** | Rate-limit + analytics API (optional) |
| **Cloudflare KV** | Worker er rate-limit data store |
| **Cloudflare Pages** | Frontend hosting (recommended) |

### Key library ta — `@imgly/background-removal`:
- Open-source npm package
- **ISNet** neural network use kore (WebAssembly compile kora)
- First time use korle ~30 MB model download hoy (CDN theke)
- Model browser cache e save thake → second time instant
- GPU thakle WebGPU use kore, na thakle CPU
- **Image kokhonoi upload hoy na** — sob local

---

## 3. File Structure (folder ki ki ache)

```
BGRemover/
├── app/                      ← Next.js App Router pages
│   ├── layout.tsx           ← Root layout, meta tags, theme bootstrap
│   ├── providers.tsx        ← React Query provider
│   ├── page.tsx             ← Homepage (hero + upload + result)
│   ├── globals.css          ← Global styles, ambient bg, checkerboard
│   └── icon.tsx             ← Auto-generated favicon
│
├── components/              ← Reusable React components
│   ├── Logo.tsx            ← Brand logo (SVG + wordmark)
│   ├── UploadZone.tsx      ← Drag-drop upload area
│   ├── ResultView.tsx      ← Result page (slider + color palette + download)
│   ├── BeforeAfterSlider.tsx ← Comparison slider
│   ├── ProgressBar.tsx     ← Upload/processing progress
│   ├── ThemeToggle.tsx     ← Dark/Light mode toggle button
│   ├── HowItWorks.tsx      ← "How it works" 3-step section
│   ├── UseCases.tsx        ← "Made for" 3-card section
│   └── Footer.tsx          ← Page footer
│
├── hooks/
│   └── useRemoveBg.ts      ← Main hook — AI run kore + cache kore
│
├── lib/
│   ├── queryClient.ts      ← TanStack Query setup
│   └── analytics.ts        ← Worker API client (optional)
│
├── worker/
│   └── index.ts            ← Cloudflare Worker (rate-limit + stats)
│
├── public/
│   └── examples/           ← Sample images folder
│
├── package.json            ← Dependencies list
├── tsconfig.json           ← TypeScript config
├── next.config.js          ← Next.js config (COOP/COEP headers)
├── tailwind.config.ts      ← Tailwind theme + colors
├── postcss.config.js       ← PostCSS plugins
├── wrangler.toml           ← Cloudflare Worker config
├── .env.example            ← Environment variable template
├── .gitignore
├── .eslintrc.json
└── README.md
```

---

## 4. Kon file ki kaj kore (detailed)

### `app/layout.tsx`
- Root HTML structure
- Inter font load kore
- SEO metadata (title, description, OG tags)
- **Inline theme script** — page render er age dark class set kore (flash avoid)
- Providers e wrap kore

### `app/page.tsx` (Homepage)
- Hero section: title, pill badge, feature chips
- `useRemoveBg` hook ba mutation state nay
- Show kore:
  - Idle/Empty state → UploadZone + UseCases + HowItWorks
  - Working state → Spinner + ProgressBar
  - Error state → red box with retry
  - Done state → ResultView (slider + palette + download)

### `app/providers.tsx`
- QueryClientProvider e wrap kore — React Query er global state
- Browser only client component

### `app/globals.css`
- Tailwind directives
- CSS variables for light/dark theme
- **Ambient gradient** background (fixed, brand blue + purple glow)
- **Grid overlay** (fixed, dotted grid faded)
- **`.text-gradient`** utility — gradient text effect
- **`.glass-card`** — backdrop-blur card style
- **`.gradient-ring`** — animated rainbow border (drag-over state)
- **`.checkerboard`** — transparency indicator pattern

### `components/Logo.tsx`
- Pure SVG logo — gradient + checkerboard + AI sparkle
- `<Logo />` or `<Logo withWordmark />` (with "CutBG" text)

### `components/UploadZone.tsx`
- Drag-drop label wrapper around hidden `<input type="file">`
- File validation: only JPG/PNG/WebP, max 10 MB
- Drag state visual feedback (gradient border)
- Format chips display (JPG, PNG, WebP)

### `components/ResultView.tsx`
- Result page er main component
- **Color palette** — 10 preset color + custom picker
- **Download button** — transparent hole direct download, color hole canvas e composite kore download
- **Share button** — Web Share API (mobile) ba clipboard fallback
- **Before/after slider** + side-by-side comparison

### `components/BeforeAfterSlider.tsx`
- Pointer-drag slider
- Right side = original image
- Left side = result (transparent ba color background)
- Divider er sathe drag handle

### `components/HowItWorks.tsx`
- 3-step section: Upload → AI processes → Download
- Each step e colored gradient icon tile

### `components/UseCases.tsx`
- 3 cards: Profile photo, Product photo, ID card
- SVG icons in colored tiles

### `components/ThemeToggle.tsx`
- Sun/Moon icon button
- Click korle localStorage e save kore + html class toggle

### `hooks/useRemoveBg.ts`
**Eta most important file — sob AI logic ekhane.**

```typescript
1. File er SHA-256 hash calculate kore
2. Cache check kore — same image age dekhechi?
3. Na hole @imgly/background-removal dynamically import kore (~30MB)
4. AI model chalu kore:
   - device: 'gpu'  (WebGPU available thakle)
   - model: 'isnet_fp16'  (medium quality, fast)
   - output: PNG, foreground only
5. Progress callback theke loading-model → processing → done phase update kore
6. Result blob → object URL banay
7. Cache e save kore (next time instant)
8. Worker e analytics event pathay (optional)
```

### `lib/queryClient.ts`
- TanStack Query er QueryClient banay
- Cache time: 1 hour
- Browser e singleton, server e fresh per request

### `lib/analytics.ts`
- Thin client for Cloudflare Worker
- `checkLimit()` → kore rate limit dekhe
- `trackRemoval()` → usage event log kore
- `NEXT_PUBLIC_WORKER_URL` empty thakle no-op

### `worker/index.ts` (Cloudflare Worker)
- 3 endpoints:
  - `GET /api/limit` → rate limit info
  - `POST /api/track` → usage log + increment
  - `GET /api/health` → health check
- **Per-IP rate limiting** (KV te store) — default 20/hour
- **Daily stats** (KV te store) — count, bytes, duration
- Strict CORS — only allowed origin theke request nay

### `wrangler.toml`
- Worker deployment config
- KV namespace bindings
- Production env override

### `next.config.js`
- COOP/COEP headers — multi-threaded WASM enable korar jonno
- Webpack fallback for fs/path

---

## 5. Data Flow (kibhabe kaj kore)

```
┌──────────────────────────────────────────────────────────┐
│  User browser e image drop kore                          │
└──────────────────────┬───────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────┐
│  UploadZone validate kore (type, size)                   │
│  → onFile(file) callback fire                            │
└──────────────────────┬───────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────┐
│  useRemoveBg hook mutation chalu kore                    │
│  1. SHA-256 hash niye cache check                        │
│  2. Cache miss → @imgly/background-removal load          │
│  3. AI model chalay (browser er moddhe!)                 │
│  4. Progress UI update hoy                                │
└──────────────────────┬───────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────┐
│  AI model returns transparent PNG (Blob)                 │
│  → Object URL banay                                       │
│  → React Query cache e save                              │
│  → (optional) Worker e analytics pathay                  │
└──────────────────────┬───────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────┐
│  ResultView render hoy                                    │
│  - Before/after slider                                   │
│  - Color palette (transparent + 10 colors + custom)      │
│  - Download/Share button                                 │
└──────────────────────┬───────────────────────────────────┘
                       ↓
┌──────────────────────────────────────────────────────────┐
│  User download click korle:                              │
│  - Transparent hole → direct PNG download                │
│  - Color picked hole → canvas e composite → PNG          │
└──────────────────────────────────────────────────────────┘
```

**Important:** Original image AR result image kokhonoi server e jay na. **Sob kichu browser er moddhe e thake.**

---

## 6. Local e kibhabe Run korbe

```bash
# 1. Dependencies install koro
npm install

# 2. Dev server chalu koro
npm run dev

# 3. Browser e khulo
# http://localhost:3000
```

**Optional — Worker o local e chalu korte hole:**
```bash
npm run worker:dev
# → http://localhost:8787
```

---

## 7. Production e Deploy

### Frontend → Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy .next --project-name cutbg
```

### Worker → Cloudflare Workers
```bash
# 1. KV namespace banao
wrangler kv namespace create rate_limits
wrangler kv namespace create stats

# 2. Returned IDs gulo wrangler.toml e paste koro
# (REPLACE_WITH_*_KV_ID slot e)

# 3. Deploy
npm run worker:deploy
```

### Environment Variable
Pages dashboard e set koro:
```
NEXT_PUBLIC_WORKER_URL=https://cutbg-api.your-subdomain.workers.dev
```

---

## 8. Kichu Important Concept

### Browser-side AI keno?
1. **Privacy** — image kokhonoi tomar phone/computer chere jay na
2. **Cost** — kono API fee nei, sob free
3. **Speed** — server round-trip nai, ~2 sec e ready
4. **Offline** — model cache hole internet chara o kaj kore

### Theme flash keno hoy chilo?
- React useEffect run hoy hydration er **pore**
- Tai page first paint hoy light mode e, tarpor JS run kore dark mode e jump kore (flash!)
- **Solution:** layout.tsx e ekta tiny inline `<script>` add korechi jeta synchronously browser parse korar somoy chole — paint er **age** dark class set kore dey

### Color download kibhabe kaj kore?
1. Transparent PNG ekta Blob hisebe ache (from AI model)
2. `<canvas>` create kori original image size er
3. Canvas e first selected color paint kori (background)
4. Tarpor transparent PNG ta upar e draw kori (foreground)
5. Canvas → PNG blob → download
6. Result: colored background er sathe baked-in PNG

### Why TanStack Query?
- Mutation state management (pending, success, error, data)
- Built-in caching — same image second time submit korle instant return
- Devtools (development e — ami remove kore diyechi)

---

## 9. Project er Stats

- **Total files**: ~20 (excluding config)
- **Total dependencies**: 7 prod + 11 dev
- **Bundle size** (frontend): ~150 KB gzipped (first load, exclude WASM model)
- **WASM model size**: ~30 MB (cached after first download)
- **Processing time**: ~1-3 seconds per image (depends on size + device)
- **Cost to run**: $0/month (Cloudflare free tier covers everything)

---

## 10. Future Ideas (kobhe extend korte chao hole)

- Batch processing — multiple image ekshathe
- Background image (gradient/photo) replace option
- Manual edit/touch-up brush
- Output format choice (JPG, WebP)
- Different quality levels
- Save history (IndexedDB e local)
- PWA — install as app
- Share to social media (X, Instagram) direct

---

## 11. Documentation Links

- **Next.js**: https://nextjs.org/docs
- **TailwindCSS**: https://tailwindcss.com/docs
- **TanStack Query**: https://tanstack.com/query/latest
- **@imgly/background-removal**: https://github.com/imgly/background-removal-js
- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Cloudflare Pages**: https://developers.cloudflare.com/pages/

---

## 12. License

MIT — free for any use (personal or commercial).

---

**Bujhte na parle kono section, bolo — explain kore dibo!**
