"use client";

import { useFilterStore } from "@/lib/store";
import { GRADE_BANDS, TIME_RANGES } from "@/lib/data";

export function FilterBar() {
  const { timeRange, gradeBand, setTimeRange, setGradeBand } = useFilterStore();

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-neutral-600)]">Range</span>
        <div className="flex gap-1 rounded-full bg-[var(--color-neutral-100)] p-1">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              type="button"
              onClick={() => setTimeRange(range.value)}
              className={
                range.value === timeRange
                  ? "rounded-full bg-[var(--color-accent)] px-3 py-1.5 font-mono text-xs font-medium text-[var(--color-neutral-950)]"
                  : "rounded-full px-3 py-1.5 font-mono text-xs text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-neutral-800)]"
              }
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-neutral-600)]">Grade band</span>
        <div className="flex flex-wrap gap-1 rounded-full bg-[var(--color-neutral-100)] p-1">
          {GRADE_BANDS.map((band) => (
            <button
              key={band}
              type="button"
              onClick={() => setGradeBand(band)}
              className={
                band === gradeBand
                  ? "rounded-full bg-[var(--color-accent)] px-3 py-1.5 font-mono text-xs font-medium text-[var(--color-neutral-950)]"
                  : "rounded-full px-3 py-1.5 font-mono text-xs text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-neutral-800)]"
              }
            >
              {band}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
