'use client';

type Props = {
  onReset: () => void;
};

const tips = [
  {
    title: 'Use a sharp original',
    body: 'Higher resolution and good lighting give the model crisper edges around hair and fingers.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    accent: 'from-amber-400 to-orange-600',
  },
  {
    title: 'Subject stands out',
    body: 'Photos where the foreground colour clearly differs from the background give the cleanest cutouts.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M4 21a8 8 0 0116 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    accent: 'from-sky-400 to-brand-600',
  },
  {
    title: 'Avoid heavy compression',
    body: 'Re-uploaded screenshots and forwarded chat photos lose detail. Try the original from your gallery.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M8 12h8M12 8v8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    accent: 'from-fuchsia-400 to-purple-600',
  },
  {
    title: 'Pick the right backdrop',
    body: 'Use the colour palette above to try white for IDs, transparent for design, or brand colours for social.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3a9 9 0 100 18 1.5 1.5 0 001.5-1.5c0-1-.5-1.5-.5-2.5s.5-1.5 1.5-1.5h2A4.5 4.5 0 0021 11c0-4.42-4.03-8-9-8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="10.5" r="1.2" fill="currentColor" />
        <circle cx="11" cy="7.5" r="1.2" fill="currentColor" />
        <circle cx="15" cy="7.5" r="1.2" fill="currentColor" />
        <circle cx="17.5" cy="11" r="1.2" fill="currentColor" />
      </svg>
    ),
    accent: 'from-emerald-400 to-teal-600',
  },
];

export function PostResult({ onReset }: Props) {
  return (
    <section className="mx-auto mt-20 max-w-5xl px-4">
      {/* Privacy reassurance band — front and centre after a successful result. */}
      <div className="glass-card relative overflow-hidden rounded-3xl px-6 py-8 shadow-xl shadow-brand-900/5 sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(49,157,255,0.18),transparent_55%)]" />
        </div>
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
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
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 sm:text-xl">
              Your photo stayed on your device.
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-base">
              The AI model ran entirely in your browser. Nothing was uploaded,
              logged, or stored. You can close this tab and we&apos;ll have no
              trace of the image you just processed.
            </p>
          </div>
        </div>
      </div>

      {/* Tips grid for better results */}
      <div className="mt-14 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-600 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/40 dark:text-zinc-400">
          Pro tips
        </span>
        <h2 className="mt-4 text-balance text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Want even cleaner edges next time?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-300">
          Four small choices that move the AI from &ldquo;good&rdquo; to &ldquo;publication ready.&rdquo;
        </p>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {tips.map((t) => (
          <li
            key={t.title}
            className="glass-card relative overflow-hidden rounded-2xl p-5 shadow-md shadow-brand-900/5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${t.accent} text-white shadow shadow-brand-500/20`}
              >
                {t.icon}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {t.body}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Try-another CTA */}
      <div className="mt-12 flex flex-col items-center gap-3 text-center">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Got another photo?
        </h3>
        <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-300">
          Process as many as you like — the model is already cached, so the next
          one starts instantly.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:scale-[1.02] hover:shadow-brand-600/40 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Remove another background
        </button>
      </div>
    </section>
  );
}
