'use client';

import { useCallback, useRef, useState, type DragEvent } from 'react';

// No hard size cap — the hook downscales to 2048 px during normalization so
// memory cost is bounded regardless of file size on disk. If the browser
// itself can't allocate enough memory the decode step will fail with a clear
// message; that's preferable to rejecting valid uploads up front.
//
// Accept any image MIME (browsers report HEIC as `image/heic`, AVIF as
// `image/avif`, sometimes empty on Android share-intent). The hook re-encodes
// through <img>+canvas anyway, so if the browser can render it at all we can
// process it.
const ACCEPTED_PREFIX = 'image/';

type Props = {
  onFile: (file: File) => void;
  disabled?: boolean;
};

export function UploadZone({ onFile, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((file: File): string | null => {
    // Empty MIME is common on Android share-intent uploads — accept and let
    // the decoder figure it out rather than rejecting potentially-valid files.
    if (file.type && !file.type.startsWith(ACCEPTED_PREFIX)) {
      return 'Please choose an image file.';
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      const err = validate(file);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      onFile(file);
    },
    [onFile, validate],
  );

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  };

  return (
    <div className="animate-fade-in w-full">
      <label
        htmlFor="cutbg-file-input"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setDragging(false)}
        className={[
          'group relative flex w-full cursor-pointer flex-col items-center justify-center gap-5 rounded-3xl px-6 py-16 text-center shadow-xl shadow-brand-900/5 transition-all sm:py-24',
          dragging ? 'gradient-ring' : '',
          dragging
            ? 'bg-white/90 dark:bg-zinc-900/90'
            : 'border-2 border-dashed border-zinc-300/80 bg-white/70 backdrop-blur hover:border-brand-400/70 hover:bg-white dark:border-zinc-700/80 dark:bg-zinc-900/60 dark:hover:border-brand-500/60 dark:hover:bg-zinc-900',
          disabled && 'pointer-events-none opacity-60',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={[
            'grid h-20 w-20 place-items-center rounded-2xl transition-all',
            'bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-lg shadow-brand-500/30',
            dragging ? 'scale-110 rotate-3' : 'group-hover:scale-105',
          ].join(' ')}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="space-y-1.5">
          <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            {dragging ? 'Drop your image here' : 'Drag & drop an image'}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            or click to browse — your image never leaves this device.
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            inputRef.current?.click();
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-all hover:scale-[1.02] hover:shadow-brand-600/40 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4M12 4v12m0-12l-4 4m4-4l4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Upload image
        </button>

        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            Any image format
          </span>
          <span className="text-zinc-400 dark:text-zinc-500">· any size</span>
        </div>

        <input
          id="cutbg-file-input"
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={disabled}
          onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
        />
      </label>

      {error && (
        <p
          role="alert"
          className="animate-slide-up mt-3 text-center text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
