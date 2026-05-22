const steps = [
  {
    n: 1,
    title: 'Upload',
    body: 'Drop any image — JPG, PNG, WebP, even HEIC from iPhone. Any size. No signup, no upload to a server.',
    accent: 'from-sky-400 to-brand-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    n: 2,
    title: 'AI removes the background',
    body: 'A neural network runs in your browser via WebAssembly. Your image never leaves your device.',
    accent: 'from-fuchsia-400 to-purple-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3zM19 14l.9 2.6L22 17l-2.1 1L19 21l-.9-3-2.1-1 2.1-1 .9-2zM5 14l.9 2.6L8 17l-2.1 1L5 21l-.9-3L2 17l2.1-1L5 14z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    n: 3,
    title: 'Download',
    body: 'Save a transparent PNG, pick any background color, or share directly from your phone.',
    accent: 'from-emerald-400 to-green-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto mt-24 max-w-5xl px-4">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-600 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/40 dark:text-zinc-400">
          How it works
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Three steps. No accounts.
          <br className="hidden sm:block" />
          <span className="text-gradient"> Nothing leaves your device.</span>
        </h2>
      </div>

      <ol className="mt-12 grid gap-6 sm:grid-cols-3">
        {steps.map((s) => (
          <li
            key={s.n}
            className="glass-card relative overflow-hidden rounded-2xl p-6 shadow-lg shadow-brand-900/5"
          >
            <div className="flex items-start justify-between">
              <div
                className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${s.accent} text-white shadow-lg shadow-brand-500/20`}
              >
                {s.icon}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Step {s.n}
              </span>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {s.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
