import { Logo } from './Logo';

const productLinks = [
  { href: '#use-cases', label: 'Use cases' },
  { href: '#features', label: 'Why CutBG' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
];

export function Footer() {
  return (
    <footer className="relative mt-32">
      {/* Soft top border with a brand-tinted glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-12">
          {/* Brand + pitch */}
          <div className="sm:col-span-7">
            <Logo className="h-9 w-9" withWordmark />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              A private, browser-native background remover. No accounts, no
              servers, no surveillance.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live · runs entirely in your browser
            </p>
          </div>

          {/* Product */}
          <div className="sm:col-span-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-zinc-700 transition hover:text-brand-600 dark:text-zinc-300 dark:hover:text-brand-300"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-zinc-200/70 pt-6 text-xs text-zinc-500 dark:border-zinc-800/70 dark:text-zinc-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} CutBG. All processing happens on your device.</p>
          <p className="inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 7a5.5 5.5 0 019.5 5c-2.5 4.5-9.5 9-9.5 9z"
                fill="currentColor"
              />
            </svg>
            Made with care for the open web
          </p>
        </div>
      </div>
    </footer>
  );
}
