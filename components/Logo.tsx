type Props = {
  className?: string;
  /** When true, also renders the "CutBG" wordmark beside the icon. */
  withWordmark?: boolean;
};

/**
 * CutBG brand mark.
 *
 * The icon is a rounded square split diagonally: the upper-left half is a
 * brand-gradient (the subject), the lower-right is a checkerboard pattern
 * (transparency / removed background). A small spark hints at "AI".
 */
export function Logo({ className = 'h-8 w-8', withWordmark = false }: Props) {
  if (!withWordmark) return <Mark className={className} />;
  return (
    <span className="inline-flex items-center gap-2">
      <Mark className={className} />
      <span className="text-lg font-semibold tracking-tight">
        Cut<span className="text-brand-600 dark:text-brand-400">BG</span>
      </span>
    </span>
  );
}

function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="CutBG"
    >
      <defs>
        <linearGradient id="cutbg-grad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#58bbff" />
          <stop offset="55%" stopColor="#319dff" />
          <stop offset="100%" stopColor="#1665e0" />
        </linearGradient>

        <pattern id="cutbg-check" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#ffffff" />
          <rect width="3" height="3" fill="#d4d4d8" />
          <rect x="3" y="3" width="3" height="3" fill="#d4d4d8" />
        </pattern>

        <clipPath id="cutbg-clip">
          <rect width="40" height="40" rx="10" ry="10" />
        </clipPath>
      </defs>

      <g clipPath="url(#cutbg-clip)">
        {/* Lower-right: transparency checkerboard */}
        <rect width="40" height="40" fill="url(#cutbg-check)" />

        {/* Upper-left: brand gradient (the "subject" still in the image) */}
        <path d="M0 0 H40 L0 40 Z" fill="url(#cutbg-grad)" />

        {/* Crisp diagonal seam */}
        <path
          d="M40 0 L0 40"
          stroke="#ffffff"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* AI spark — 4-point star, top-left quadrant */}
        <g transform="translate(12 12)">
          <path
            d="M0 -4.5 L1 -1 L4.5 0 L1 1 L0 4.5 L-1 1 L-4.5 0 L-1 -1 Z"
            fill="#ffffff"
          />
          <circle cx="0" cy="0" r="0.9" fill="#ffffff" />
        </g>

        {/* Subtle gloss highlight */}
        <path
          d="M0 0 H40 V6 C28 14 14 14 0 6 Z"
          fill="#ffffff"
          opacity="0.10"
        />
      </g>

      {/* Outer hairline for crispness on light backgrounds */}
      <rect
        x="0.5"
        y="0.5"
        width="39"
        height="39"
        rx="9.5"
        ry="9.5"
        fill="none"
        stroke="#000000"
        strokeOpacity="0.06"
      />
    </svg>
  );
}
