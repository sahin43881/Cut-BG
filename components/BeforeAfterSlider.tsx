'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  beforeSrc: string;
  afterSrc: string;
  alt?: string;
  /** Background behind the transparent "after" image. `null` = checkerboard. */
  afterBg?: string | null;
};

// Pixels of horizontal movement required before a touch turns into a drag.
// Below this, the gesture is treated as a tap or the start of a page scroll.
const DRAG_THRESHOLD_PX = 6;

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  alt = 'comparison',
  afterBg = null,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const pointerStart = useRef<{ x: number; y: number; type: string } | null>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, ratio)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const start = pointerStart.current;
      if (!start) return;

      // For touch input, wait until the user has moved horizontally past
      // the threshold before claiming the drag. This lets a vertical swipe
      // scroll the page even if it starts on the slider, and prevents a
      // stray tap from snapping the divider.
      if (!dragging.current) {
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (start.type === 'touch') {
          // If the user is clearly scrolling vertically, abandon the drag.
          if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > DRAG_THRESHOLD_PX) {
            pointerStart.current = null;
            return;
          }
          if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
        }
        dragging.current = true;
      }

      updateFromClientX(e.clientX);
    };

    const onUp = () => {
      dragging.current = false;
      pointerStart.current = null;
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [updateFromClientX]);

  return (
    <div className="flex w-full justify-center">
      <div
        ref={containerRef}
        // `touch-pan-y` keeps native vertical scroll working when the touch
        // starts on the slider. Horizontal pans still come to us so the
        // drag-to-compare gesture works.
        className="relative max-w-full touch-pan-y select-none overflow-hidden rounded-2xl border border-zinc-200 shadow-xl shadow-brand-900/5 dark:border-zinc-800"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          pointerStart.current = { x: e.clientX, y: e.clientY, type: e.pointerType };
          // Mouse clicks should snap the divider immediately (familiar
          // desktop behaviour). Touches wait for the drag threshold so an
          // accidental tap doesn't yank the slider to the edge.
          if (e.pointerType === 'mouse') {
            dragging.current = true;
            updateFromClientX(e.clientX);
          }
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
          <div className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-zinc-800 shadow-lg ring-1 ring-black/10">
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
      </div>
    </div>
  );
}
