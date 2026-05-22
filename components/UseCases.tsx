const cases = [
  {
    title: 'Profile photos',
    body: 'Clean headshots for LinkedIn, Slack, your CV, or team pages.',
    accent: 'from-sky-400 to-brand-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'E-commerce',
    body: 'Crisp white-background product shots ready for Shopify, Amazon, Etsy.',
    accent: 'from-fuchsia-400 to-purple-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 7h12l-1 13H7L6 7zM9 7V5a3 3 0 016 0v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Social media',
    body: 'Make stickers, memes, and Story-ready cutouts in seconds.',
    accent: 'from-rose-400 to-pink-600',
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
    title: 'Marketing & ads',
    body: 'Drop subjects onto banners, landing pages, and social ad creatives.',
    accent: 'from-amber-400 to-orange-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 12l3-3v6l-3-3zM21 6L9 12v3l12-6V6zM9 15l4 4 1-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Graphic design',
    body: 'Quickly isolate elements for collages, posters, or mockups.',
    accent: 'from-emerald-400 to-teal-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 19l9-7-3-3-9 9 3 1zM5 13l-2 7 7-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'ID & documents',
    body: 'Clean up scans, ID photos, signatures — pure white backdrop, instantly.',
    accent: 'from-indigo-400 to-blue-600',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
        <path
          d="M14 10h4M14 13h4M5 17h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="mx-auto mt-28 max-w-6xl px-4">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-600 backdrop-blur dark:border-zinc-800/70 dark:bg-zinc-900/40 dark:text-zinc-400">
          Use cases
        </span>
        <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Made for whatever you&apos;re building.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
          From a quick LinkedIn photo to a shop catalog — one drop, one PNG, no
          subscription emails.
        </p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <li
            key={c.title}
            className="group glass-card relative overflow-hidden rounded-2xl p-6 shadow-md shadow-brand-900/5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`inline-grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${c.accent} text-white shadow shadow-brand-500/20`}
            >
              {c.icon}
            </div>
            <h3 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {c.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {c.body}
            </p>
            <div
              className={`pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r ${c.accent} opacity-0 transition group-hover:opacity-100`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
