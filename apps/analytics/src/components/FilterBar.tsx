"use client";

import { useFilterStore } from "@/lib/store";
import { GRADE_BANDS, TIME_RANGES } from "@/lib/data";

export function FilterBar() {
  const { timeRange, gradeBand, compareBand, setTimeRange, setGradeBand, setCompareBand } = useFilterStore();
  const compareOptions = GRADE_BANDS.filter((band) => band !== gradeBand);

  return (
    <div className="glass flex flex-wrap items-center gap-4 rounded-3xl p-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-neutral-600)]">Range</span>
        <div className="flex gap-1 rounded-full bg-[rgba(255,255,255,0.04)] p-1">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              type="button"
              onClick={() => setTimeRange(range.value)}
              className={
                range.value === timeRange
                  ? "rounded-full bg-[var(--color-accent)] px-3 py-1.5 font-mono text-xs font-medium text-[#12091f] shadow-[0_0_18px_-5px_rgba(139,124,246,0.9)] transition-all"
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
        <div className="flex flex-wrap gap-1 rounded-full bg-[rgba(255,255,255,0.04)] p-1">
          {GRADE_BANDS.map((band) => (
            <button
              key={band}
              type="button"
              onClick={() => {
                setGradeBand(band);
                if (compareBand === band) setCompareBand(null);
              }}
              className={
                band === gradeBand
                  ? "rounded-full bg-[var(--color-accent)] px-3 py-1.5 font-mono text-xs font-medium text-[#12091f] shadow-[0_0_18px_-5px_rgba(139,124,246,0.9)] transition-all"
                  : "rounded-full px-3 py-1.5 font-mono text-xs text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-neutral-800)]"
              }
            >
              {band}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-neutral-600)]">Compare with</span>
        <div className="flex flex-wrap gap-1 rounded-full bg-[rgba(255,255,255,0.04)] p-1">
          <button
            type="button"
            onClick={() => setCompareBand(null)}
            className={
              compareBand === null
                ? "rounded-full bg-[var(--color-cyan)] px-3 py-1.5 font-mono text-xs font-medium text-[#04212a] shadow-[0_0_18px_-5px_rgba(34,211,238,0.9)] transition-all"
                : "rounded-full px-3 py-1.5 font-mono text-xs text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-neutral-800)]"
            }
          >
            None
          </button>
          {compareOptions.map((band) => (
            <button
              key={band}
              type="button"
              onClick={() => setCompareBand(band)}
              className={
                band === compareBand
                  ? "rounded-full bg-[var(--color-cyan)] px-3 py-1.5 font-mono text-xs font-medium text-[#04212a] shadow-[0_0_18px_-5px_rgba(34,211,238,0.9)] transition-all"
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
