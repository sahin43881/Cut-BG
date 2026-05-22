const features = [
  {
    title: '100% private',
    body: 'Your photo is processed in the browser. Nothing is uploaded, nothing is logged, nothing is stored.',
    accent: 'text-emerald-500 dark:text-emerald-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Truly free',
    body: 'No credits, no daily caps, no signup, no email. Use it as many times as you want.',
    accent: 'text-rose-500 dark:text-rose-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 7a5.5 5.5 0 019.5 5c-2.5 4.5-9.5 9-9.5 9z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: 'Instant',
    body: 'After the first model download, each image takes about a second. No server queue, no waiting room.',
    accent: 'text-amber-500 dark:text-amber-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Works offline',
    body: 'Once the model is cached, you can pull the wifi plug and it still runs. Perfect for planes, trains, and trips.',
    accent: 'text-sky-500 dark:text-sky-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 12.55a11 11 0 0114 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Any device',
    body: 'Phone, tablet, laptop, Chromebook. iPhone HEIC photos work automatically, even on Android.',
    accent: 'text-purple-500 dark:text-purple-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="4" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="15" y="8" width="6" height="12" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <path d="M1 20h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Open & honest',
    body: 'Built on open-source @imgly/background-removal. No tracking pixels, no dark patterns, no upsell.',
    accent: 'text-teal-500 dark:text-teal-400',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 9l-5 3 5 3M16 9l5 3-5 3M14 4l-4 16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto mt-28 max-w-6xl px-4">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-600 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/40 dark:text-zinc-400">
          Why CutBG
        </span>
        <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Background removal,
          <br className="hidden sm:block" />
          <span className="text-gradient">the way it should work.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
          Everything happens on your device. No accounts. No fine print. No pixel
          left behind.
        </p>
      </div>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <li
            key={f.title}
            className="glass-card relative overflow-hidden rounded-2xl p-6 shadow-md shadow-brand-900/5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className={`inline-flex h-11 w-11 items-center justify-center ${f.accent}`}>
              {f.icon}
            </div>
            <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {f.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {f.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
