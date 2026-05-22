'use client';

import { useCallback } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { ResultView } from '@/components/ResultView';
import { ProgressBar } from '@/components/ProgressBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HowItWorks } from '@/components/HowItWorks';
import { UseCases } from '@/components/UseCases';
import { Features } from '@/components/Features';
import { FAQ } from '@/components/FAQ';
import { PostResult } from '@/components/PostResult';
import { Footer } from '@/components/Footer';
import { Logo } from '@/components/Logo';
import { useRemoveBg, type Phase } from '@/hooks/useRemoveBg';

const phaseLabel: Record<Phase, string> = {
  idle: '',
  'loading-model': 'Downloading model…',
  processing: 'AI is removing the background…',
  done: 'Done',
  error: 'Something went wrong',
};

const navLinks = [
  { href: '#use-cases', label: 'Use cases' },
  { href: '#features', label: 'Why CutBG' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
];

export default function HomePage() {
  const { mutate, data, error, phase, progress, isPending, reset } = useRemoveBg();

  const onFile = useCallback(
    (file: File) => {
      mutate(file);
    },
    [mutate],
  );

  const isWorking = isPending || phase === 'loading-model' || phase === 'processing';

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Ambient background layers — both are position:fixed so they don't scroll. */}
      <div className="ambient" aria-hidden />
      <div className="grid-overlay" aria-hidden />

      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-6">
        <a href="/" className="flex items-center" aria-label="CutBG home">
          <Logo className="h-9 w-9" withWordmark />
        </a>
        <nav className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 sm:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto mt-12 max-w-3xl px-4 text-center sm:mt-20">
        <a
          href="#features"
          className="glass-card animate-fade-in inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition hover:shadow-md dark:text-zinc-200"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Runs 100% in your browser — nothing uploaded
        </a>

        <h1 className="animate-slide-up mt-6 text-balance text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          Remove image backgrounds
          <br className="hidden sm:block" />
          <span className="text-gradient"> in seconds.</span>
        </h1>
        <p className="animate-slide-up mx-auto mt-5 max-w-xl text-pretty text-zinc-600 dark:text-zinc-300 sm:text-lg">
          Drop an image. Get a transparent PNG, or pick any background color. No
          signup, no server, no usage cap — your photo never leaves your device.
        </p>

        {!data && (
          <div className="animate-fade-in mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
            <FeatureChip icon={<ShieldIcon />} label="Private by design" />
            <FeatureChip icon={<BoltIcon />} label="~2s per image" />
            <FeatureChip icon={<HeartIcon />} label="Free forever" />
            <FeatureChip icon={<OfflineIcon />} label="Works offline" />
          </div>
        )}
      </section>

      {/* Upload + Result */}
      <section className="mx-auto mt-10 max-w-3xl px-4">
        {!data && (
          <>
            <UploadZone onFile={onFile} disabled={isWorking} />

            {isWorking && (
              <div className="glass-card animate-slide-up mt-6 rounded-2xl p-5 shadow-lg shadow-brand-900/5">
                <div className="mb-3 flex items-center gap-3">
                  <Spinner />
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    {phaseLabel[phase] || 'Working…'}
                  </span>
                </div>
                <ProgressBar value={progress} />
                <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                  The first run downloads the AI model (~40 MB on phones, ~80 MB
                  on desktop). After that it&apos;s instant and works offline.
                </p>
              </div>
            )}

            {error && !isWorking && (
              <div className="animate-slide-up mt-6 rounded-2xl border border-red-200 bg-red-50/80 p-5 text-sm text-red-800 backdrop-blur dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                <p className="font-medium">We couldn&apos;t process that image.</p>
                <p className="mt-1 opacity-80">
                  {error instanceof Error ? error.message : 'Unknown error'}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Try again
                </button>
              </div>
            )}
          </>
        )}

        {data && <ResultView result={data} onReset={reset} />}
      </section>

      {/* Post-result section: a privacy reassurance card, tips for better
          results, and a "try another" CTA — shown only after a successful run
          so it bridges the gap between the result view and the footer. */}
      {data && <PostResult onReset={reset} />}

      {!data && (
        <>
          {/* Scroll cue — only when the upload zone is the active state */}
          <div className="mt-16 flex justify-center">
            <a
              href="#use-cases"
              aria-label="See use cases"
              className="group inline-flex flex-col items-center gap-1 text-xs uppercase tracking-wider text-zinc-400 transition hover:text-brand-500 dark:text-zinc-500 dark:hover:text-brand-300"
            >
              Scroll for more
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="animate-bounce-slow"
              >
                <path
                  d="M12 5v14m0 0l-6-6m6 6l6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <UseCases />
          <Features />
          <div id="how-it-works">
            <HowItWorks />
          </div>
          <FAQ />

          {/* CTA strip just above footer */}
          <section className="mx-auto mt-28 max-w-4xl px-4">
            <div className="glass-card relative overflow-hidden rounded-3xl px-6 py-10 text-center shadow-xl shadow-brand-900/5 sm:px-10 sm:py-14">
              <div className="pointer-events-none absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(49,157,255,0.18),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.16),transparent_50%)]" />
              </div>
              <h2 className="text-balance text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Ready to remove a background?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
                Scroll back up. Drop an image. Walk away with a transparent
                PNG.
              </p>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:scale-[1.02] hover:shadow-brand-600/40 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 19V5m0 0l-6 6m6-6l6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back to top
              </a>
            </div>
          </section>
        </>
      )}

      <Footer />
    </main>
  );
}

function FeatureChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-brand-500 dark:text-brand-400">{icon}</span>
      {label}
    </span>
  );
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-brand-600"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 7a5.5 5.5 0 019.5 5c-2.5 4.5-9.5 9-9.5 9z"
        fill="currentColor"
      />
    </svg>
  );
}

function OfflineIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.55a11 11 0 0114 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
