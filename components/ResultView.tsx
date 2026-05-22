'use client';

import { useState } from 'react';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import type { RemoveBgResult } from '@/hooks/useRemoveBg';

type Props = {
  result: RemoveBgResult;
  onReset: () => void;
};

type Swatch = { id: string; label: string; color: string | null };

const PRESETS: Swatch[] = [
  { id: 'transparent', label: 'Transparent', color: null },
  { id: 'white', label: 'White', color: '#ffffff' },
  { id: 'black', label: 'Black', color: '#0b1220' },
  { id: 'blue', label: 'Blue', color: '#1665e0' },
  { id: 'sky', label: 'Sky', color: '#38bdf8' },
  { id: 'red', label: 'Red', color: '#ef4444' },
  { id: 'green', label: 'Green', color: '#10b981' },
  { id: 'yellow', label: 'Yellow', color: '#facc15' },
  { id: 'purple', label: 'Purple', color: '#a855f7' },
  { id: 'pink', label: 'Pink', color: '#ec4899' },
];

export function ResultView({ result, onReset }: Props) {
  const [bgColor, setBgColor] = useState<string | null>(null); // null = transparent
  const [customColor, setCustomColor] = useState('#1665e0');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseName = result.file.name.replace(/\.[^.]+$/, '') || 'image';
  const presetSlug = bgColor
    ? (PRESETS.find((p) => p.color?.toLowerCase() === bgColor.toLowerCase())?.id ?? 'custom')
    : 'transparent';
  const downloadName = `${baseName}-cutbg-${presetSlug}.png`;

  const handleDownload = async () => {
    setBusy(true);
    try {
      const blobUrl = bgColor
        ? await compositeOnColor(result.resultUrl, bgColor)
        : result.resultUrl;
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      if (bgColor) {
        // composite created a fresh object URL — clean it up after the click
        window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    try {
      const blob = bgColor
        ? await compositeOnColorBlob(result.resultUrl, bgColor)
        : await (await fetch(result.resultUrl)).blob();
      const file = new File([blob], downloadName, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'CutBG result' });
        return;
      }
      await navigator.clipboard.writeText(result.resultUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* user cancelled or denied — ignore */
    }
  };

  return (
    <section className="animate-slide-up mt-10 w-full">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Done — drag the slider to compare
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {result.file.name} · {(result.file.size / 1024).toFixed(0)} KB · processed in{' '}
            {(result.durationMs / 1000).toFixed(1)}s
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {busy ? 'Preparing…' : 'Download PNG'}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            {copied ? 'Link copied' : 'Share'}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Try another
          </button>
        </div>
      </div>

      <ColorPalette
        value={bgColor}
        onChange={setBgColor}
        customColor={customColor}
        onCustomChange={setCustomColor}
      />

      <div className="mt-5">
        <BeforeAfterSlider
          beforeSrc={result.originalUrl}
          afterSrc={result.resultUrl}
          alt={result.file.name}
          afterBg={bgColor}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <figure>
          <figcaption className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Original
          </figcaption>
          <div className="flex h-72 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 sm:h-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.originalUrl}
              alt="original"
              className="block max-h-full max-w-full object-contain"
            />
          </div>
        </figure>
        <figure>
          <figcaption className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            {bgColor ? 'With chosen background' : 'Background removed'}
          </figcaption>
          <div
            className={[
              'flex h-72 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 sm:h-80',
              bgColor ? '' : 'checkerboard',
            ].join(' ')}
            style={bgColor ? { backgroundColor: bgColor } : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.resultUrl}
              alt="background removed"
              className="block max-h-full max-w-full object-contain"
            />
          </div>
        </figure>
      </div>
    </section>
  );
}

type PaletteProps = {
  value: string | null;
  onChange: (color: string | null) => void;
  customColor: string;
  onCustomChange: (color: string) => void;
};

function ColorPalette({ value, onChange, customColor, onCustomChange }: PaletteProps) {
  const isCustomActive =
    value !== null && !PRESETS.some((p) => p.color?.toLowerCase() === value.toLowerCase());

  const activeLabel =
    value === null
      ? 'Transparent PNG'
      : (PRESETS.find((p) => p.color?.toLowerCase() === value.toLowerCase())?.label ??
        'Custom color');

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Background
        </span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{activeLabel}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => {
          const active = (p.color ?? null) === value;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.color)}
              title={p.label}
              aria-label={`Background: ${p.label}`}
              aria-pressed={active}
              className={[
                'relative grid h-9 w-9 place-items-center rounded-full transition',
                'ring-offset-2 ring-offset-white dark:ring-offset-zinc-900',
                active ? 'ring-2 ring-brand-500' : 'ring-1 ring-zinc-200 dark:ring-zinc-700',
              ].join(' ')}
              style={
                p.color
                  ? { backgroundColor: p.color }
                  : undefined
              }
            >
              {!p.color && (
                <span
                  aria-hidden
                  className="checkerboard absolute inset-0 rounded-full"
                  style={{ backgroundSize: '8px 8px' }}
                />
              )}
              {active && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className="relative z-10"
                  style={{
                    color: isLight(p.color) ? '#111' : '#fff',
                  }}
                >
                  <path
                    d="M5 12l5 5L20 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}

        {/* Custom color picker — native <input type="color"> styled as a swatch */}
        <label
          title="Custom color"
          className={[
            'relative grid h-9 w-9 cursor-pointer place-items-center overflow-hidden rounded-full transition',
            'ring-offset-2 ring-offset-white dark:ring-offset-zinc-900',
            isCustomActive
              ? 'ring-2 ring-brand-500'
              : 'ring-1 ring-zinc-200 dark:ring-zinc-700',
          ].join(' ')}
          style={{
            background:
              'conic-gradient(from 0deg, #ef4444, #facc15, #10b981, #38bdf8, #a855f7, #ec4899, #ef4444)',
          }}
        >
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              const next = e.target.value;
              onCustomChange(next);
              onChange(next);
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Pick a custom background color"
          />
          {isCustomActive ? (
            <span
              className="relative h-5 w-5 rounded-full ring-2 ring-white"
              style={{ backgroundColor: value ?? customColor }}
            />
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              className="text-white drop-shadow"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </label>
      </div>
    </div>
  );
}

// --- canvas helpers ---------------------------------------------------------

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load result image'));
    img.src = src;
  });
}

async function compositeOnColorBlob(srcUrl: string, color: string): Promise<Blob> {
  const img = await loadImage(srcUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D not supported');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to encode PNG'));
    }, 'image/png');
  });
}

async function compositeOnColor(srcUrl: string, color: string): Promise<string> {
  const blob = await compositeOnColorBlob(srcUrl, color);
  return URL.createObjectURL(blob);
}

function isLight(hex: string | null): boolean {
  if (!hex) return true;
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return true;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  // Perceived luminance
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}
