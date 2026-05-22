const faqs = [
  {
    q: 'Is my photo really not uploaded anywhere?',
    a: "Correct. The neural network runs inside your browser via WebAssembly. Open your browser's DevTools → Network tab and you'll see the model file load once (from a public CDN), and zero outbound requests with your image. We never see it. If you take the wifi offline after the model has loaded, it still works.",
  },
  {
    q: 'Why is the first run a bit slow?',
    a: 'Because your browser is downloading the AI model on first use — about 40 MB on phones, 80 MB on desktop. It then caches it. From the second image onward, processing is nearly instant. The trade-off: heavier first load in exchange for total privacy and no server bill.',
  },
  {
    q: 'What image formats are supported?',
    a: "JPG, PNG, WebP, GIF, BMP, AVIF — and HEIC photos from iPhones, even when opened on Android Chrome (we decode HEIC in the browser with a WASM library). If your browser can render the image, we can process it.",
  },
  {
    q: 'Is there a file size limit?',
    a: "No hard limit. Internally we downscale to 2048 px on the longest edge to keep memory bounded, so a 50 MB photo and a 5 MB photo take roughly the same amount of memory. Truly massive files (gigabytes) may exhaust your phone's memory — that's a browser limit, not ours.",
  },
  {
    q: 'Can I use it commercially?',
    a: "Yes. The processed image is yours. CutBG is built on the open-source @imgly/background-removal library; check its license for any specifics if you're embedding the underlying tech in your own product, but using this site to remove backgrounds for your own work is free.",
  },
  {
    q: 'Why does the result have noisy edges sometimes?',
    a: 'Segmentation models can struggle when the foreground and background have similar colors (e.g. light hair on a sky background) or when the photo is very compressed. Try a higher-resolution version of the same photo, or a photo with more color contrast.',
  },
  {
    q: 'Does it work on mobile?',
    a: "Yes. We auto-detect mobile and pick a smaller, mobile-optimised model so the first download is faster and uses less RAM. The result quality is very close to desktop. iPhone HEIC photos shared via WhatsApp etc. are decoded automatically — no manual conversion needed.",
  },
  {
    q: "What if it doesn't work for me?",
    a: 'Try a hard refresh (Ctrl+Shift+R on desktop, Chrome menu → "Refresh" on phone). The most common cause is a stale cached version after we deploy an update. If a specific photo fails to decode, save it as a JPG from your gallery and try again.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto mt-28 max-w-3xl px-4">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-600 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/40 dark:text-zinc-400">
          FAQ
        </span>
        <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Questions, answered honestly.
        </h2>
      </div>

      <div className="mt-10 space-y-3">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="group glass-card overflow-hidden rounded-2xl shadow-sm shadow-brand-900/5 transition-all open:shadow-lg"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-zinc-900 marker:hidden dark:text-zinc-50 sm:text-base">
              <span>{item.q}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="mt-0.5 shrink-0 text-zinc-400 transition-transform group-open:rotate-180"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <div className="px-5 pb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
