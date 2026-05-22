'use client';

import { useCallback } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { ResultView } from '@/components/ResultView';
import { ProgressBar } from '@/components/ProgressBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HowItWorks } from '@/components/HowItWorks';
import { UseCases } from '@/components/UseCases';
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
        <nav className="flex items-center gap-1 sm:gap-3">
          <a
            href="#how-it-works"
            className="hidden rounded-lg px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100 sm:inline-block"
          >
            How it works
          </a>
          <ThemeToggle />
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto mt-12 max-w-3xl px-4 text-center sm:mt-20">
        <a
          href="#how-it-works"
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
          Drop an image. Get a transparent PNG, or pick any background color. No signup, no
          server, no usage cap.
        </p>

        {!data && (
          <div className="animate-fade-in mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
            <FeatureChip icon={<ShieldIcon />} label="Private by design" />
            <FeatureChip icon={<BoltIcon />} label="~2s per image" />
            <FeatureChip icon={<HeartIcon />} label="Free forever" />
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
                  The first run downloads the AI model (~40 MB on phones, ~80 MB on desktop). After that it&apos;s instant and
                  works offline.
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

      {!data && (
        <>
          <UseCases />
          <div id="how-it-works">
            <HowItWorks />
          </div>
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
