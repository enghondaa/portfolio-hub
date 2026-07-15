"use client";

import { useMemo } from "react";
import { useFilterStore } from "@/lib/store";
import { getKPISummary } from "@/lib/data";

interface Signal {
  label: string;
  delta: number;
  goodDirection: "up" | "down";
  unit: string;
}

/** One to two sentences generated with plain if/else rules over the same computed KPI deltas shown above — not a model call, just the numbers narrated. */
export function InsightCallout() {
  const { timeRange, gradeBand } = useFilterStore();
  const kpi = useMemo(() => getKPISummary(timeRange, gradeBand), [timeRange, gradeBand]);

  const sentence = useMemo(() => {
    const signals: Signal[] = [
      { label: "attendance", delta: kpi.attendanceDelta, goodDirection: "up", unit: "pt" },
      { label: "grade scores", delta: kpi.avgGradeDelta, goodDirection: "up", unit: "pt" },
      { label: "wellbeing", delta: kpi.wellbeingDelta, goodDirection: "up", unit: "pt" },
    ];
    const headline = [...signals].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))[0];

    const describe = (s: Signal): string => {
      const isUp = s.delta > 0;
      const isGood = s.goodDirection === "up" ? isUp : !isUp;
      const verb = isUp ? "up" : "down";
      return `${s.label} is ${verb} ${Math.abs(s.delta).toFixed(1)} ${s.unit}${isGood ? "" : " — worth a look"}`;
    };

    const parts: string[] = [];
    if (headline && Math.abs(headline.delta) > 0.05) {
      parts.push(`Over this period, ${describe(headline)} vs. the prior half of the range.`);
    } else {
      parts.push("Metrics are broadly flat over this period.");
    }

    if (kpi.atRiskCount > 0) {
      const trend =
        kpi.atRiskDelta > 0
          ? `up from ${kpi.atRiskCount - kpi.atRiskDelta}`
          : kpi.atRiskDelta < 0
            ? `down from ${kpi.atRiskCount - kpi.atRiskDelta}`
            : "unchanged from last period";
      parts.push(`${kpi.atRiskCount} of ${kpi.totalStudents} students are flagged at-risk on all three signals (${trend}).`);
    } else {
      parts.push("No students currently fall below all three risk thresholds at once.");
    }

    return parts.join(" ");
  }, [kpi]);

  return (
    <div className="rounded-2xl border border-[var(--color-accent)]/25 bg-[var(--color-accent-soft)] px-5 py-4">
      <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">Auto-generated insight</p>
      <p className="mt-1.5 text-sm text-[var(--color-neutral-700)]">{sentence}</p>
    </div>
  );
}
