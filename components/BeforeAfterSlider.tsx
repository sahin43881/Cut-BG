'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  beforeSrc: string;
  afterSrc: string;
  alt?: string;
  /** Background behind the transparent "after" image. `null` = checkerboard. */
  afterBg?: string | null;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  alt = 'comparison',
  afterBg = null,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, ratio)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      updateFromClientX(e.clientX);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [updateFromClientX]);

  return (
    <div className="flex w-full justify-center">
      <div
        ref={containerRef}
        className="relative max-w-full select-none overflow-hidden rounded-2xl border border-zinc-200 shadow-xl shadow-brand-900/5 dark:border-zinc-800"
        onPointerDown={(e) => {
          dragging.current = true;
          updateFromClientX(e.clientX);
        }}
      >
        {/* Backdrop for the "after" image: checkerboard for transparency,
            or a flat color when the user picked one. The image is height-
            capped so tall portraits don't dominate the page. */}
        <div
          className={afterBg ? '' : 'checkerboard'}
          style={afterBg ? { backgroundColor: afterBg } : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterSrc}
            alt={`${alt} — background removed`}
            className="block h-auto max-h-[min(70vh,600px)] w-auto max-w-full"
            draggable={false}
          />
        </div>

        {/* "Before" image clipped to the left of the divider. */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={beforeSrc}
            alt={`${alt} — original`}
            className="block h-full w-auto max-w-none object-cover"
            style={{ width: `${(100 / pos) * 100}%` }}
            draggable={false}
          />
        </div>

        {/* Divider handle. */}
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `calc(${pos}% - 1px)` }}
        >
          <div className="h-full w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
          <div className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-zinc-800 shadow-lg ring-1 ring-black/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M8 6L3 12l5 6M16 6l5 6-5 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          Original
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          Removed
        </span>
      </div>
    </div>
  );
}
