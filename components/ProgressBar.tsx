'use client';

type Props = {
  value: number; // 0–100
  label?: string;
};

export function ProgressBar({ value, label }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>{label}</span>
          <span className="tabular-nums">{clamped}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700 transition-[width] duration-200 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
