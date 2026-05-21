const cases = [
  {
    title: 'Profile photo',
    body: 'Clean headshots for LinkedIn, Slack, or your team page.',
    accent: 'from-sky-400 to-brand-600',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    title: 'Product photo',
    body: 'Drop products onto marketing pages with a transparent backdrop.',
    accent: 'from-fuchsia-400 to-purple-600',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    title: 'ID card / scan',
    body: 'Strip the background out of a scanned document or ID quickly.',
    accent: 'from-emerald-400 to-green-600',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
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
    <section className="mx-auto mt-20 max-w-5xl px-4">
      <p className="text-center text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        Made for
      </p>
      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {cases.map((c) => (
          <li
            key={c.title}
            className="group glass-card relative overflow-hidden rounded-2xl p-5 shadow-md shadow-brand-900/5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`inline-grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${c.accent} text-white shadow shadow-brand-500/20`}
            >
              {c.icon}
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">{c.title}</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{c.body}</p>
            <div
              className={`pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r ${c.accent} opacity-0 transition group-hover:opacity-100`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
