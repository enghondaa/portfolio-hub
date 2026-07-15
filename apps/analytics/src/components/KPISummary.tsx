"use client";

import { useMemo, type ReactNode } from "react";
import { useFilterStore } from "@/lib/store";
import { getKPISummary } from "@/lib/data";

const ROSE = "#fb7185";

function DeltaPill({ delta, goodDirection, suffix = "" }: { delta: number; goodDirection: "up" | "down"; suffix?: string }) {
  if (delta === 0) {
    return (
      <span className="font-mono text-xs text-[var(--color-neutral-400)]">
        No change vs. prior period
      </span>
    );
  }
  const isUp = delta > 0;
  const isGood = goodDirection === "up" ? isUp : !isUp;
  const color = isGood ? "var(--color-success)" : ROSE;
  const arrow = isUp ? "↑" : "↓";
  return (
    <span className="font-mono text-xs font-medium" style={{ color }}>
      {arrow} {Math.abs(delta)}
      {suffix} vs. prior period
    </span>
  );
}

function KPICard({
  eyebrow,
  value,
  children,
}: {
  eyebrow: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-5">
      <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-neutral-600)]">{eyebrow}</p>
      <p className="mt-1.5 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-[var(--color-neutral-800)]">
        {value}
      </p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

/** Four headline stats, each with a trend delta computed from the same seeded series/roster used by the charts below — not separately invented numbers. */
export function KPISummary() {
  const { timeRange, gradeBand } = useFilterStore();
  const kpi = useMemo(() => getKPISummary(timeRange, gradeBand), [timeRange, gradeBand]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard eyebrow="Attendance rate" value={`${kpi.attendanceRate}%`}>
        <DeltaPill delta={kpi.attendanceDelta} goodDirection="up" suffix="pts" />
      </KPICard>
      <KPICard eyebrow="Avg. grade score" value={kpi.avgGradeScore.toFixed(1)}>
        <DeltaPill delta={kpi.avgGradeDelta} goodDirection="up" suffix=" pts" />
      </KPICard>
      <KPICard eyebrow="Avg. wellbeing" value={kpi.avgWellbeing.toFixed(0)}>
        <DeltaPill delta={kpi.wellbeingDelta} goodDirection="up" suffix=" pts" />
      </KPICard>
      <KPICard eyebrow="Students at risk" value={`${kpi.atRiskCount} / ${kpi.totalStudents}`}>
        <DeltaPill delta={kpi.atRiskDelta} goodDirection="down" />
      </KPICard>
    </div>
  );
}
