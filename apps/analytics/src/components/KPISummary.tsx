"use client";

import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useFilterStore } from "@/lib/store";
import { getKPISummary } from "@/lib/data";
import { CountUp } from "@/components/CountUp";

const ROSE = "#fb7185";

function DeltaPill({ delta, goodDirection, suffix = "" }: { delta: number; goodDirection: "up" | "down"; suffix?: string }) {
  if (delta === 0) {
    return <span className="font-mono text-[11px] text-[var(--color-neutral-400)]">No change vs. prior period</span>;
  }

  const isUp = delta > 0;
  const isGood = goodDirection === "up" ? isUp : !isUp;
  const color = isGood ? "var(--color-success)" : ROSE;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] font-medium"
      style={{ color, background: isGood ? "rgba(52,211,153,0.11)" : "rgba(251,113,133,0.11)" }}
    >
      {isUp ? "↑" : "↓"} {Math.abs(delta)}
      {suffix}
    </span>
  );
}

function KPICard({
  eyebrow,
  children,
  delta,
  index,
}: {
  eyebrow: string;
  children: ReactNode;
  delta: ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="glass panel-hover rounded-3xl p-6"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-neutral-400)]">{eyebrow}</p>
      <p className="mt-3 font-[family-name:var(--font-heading)] text-[clamp(34px,4.4vw,46px)] font-bold leading-none tracking-[-0.035em] text-[var(--color-neutral-800)]">
        {children}
      </p>
      <div className="mt-3.5">{delta}</div>
    </motion.div>
  );
}

/** Four headline stats, each with a trend delta computed from the same seeded series/roster used by the charts below — not separately invented numbers. */
export function KPISummary() {
  const { timeRange, gradeBand } = useFilterStore();
  const kpi = useMemo(() => getKPISummary(timeRange, gradeBand), [timeRange, gradeBand]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        eyebrow="Attendance rate"
        index={0}
        delta={<DeltaPill delta={kpi.attendanceDelta} goodDirection="up" suffix="pts" />}
      >
        <CountUp value={kpi.attendanceRate} decimals={1} suffix="%" />
      </KPICard>

      <KPICard
        eyebrow="Avg. grade score"
        index={1}
        delta={<DeltaPill delta={kpi.avgGradeDelta} goodDirection="up" suffix=" pts" />}
      >
        <CountUp value={kpi.avgGradeScore} decimals={1} />
      </KPICard>

      <KPICard
        eyebrow="Avg. wellbeing"
        index={2}
        delta={<DeltaPill delta={kpi.wellbeingDelta} goodDirection="up" suffix=" pts" />}
      >
        <CountUp value={kpi.avgWellbeing} />
      </KPICard>

      <KPICard
        eyebrow="Students at risk"
        index={3}
        delta={<DeltaPill delta={kpi.atRiskDelta} goodDirection="down" />}
      >
        <CountUp value={kpi.atRiskCount} />
        <span className="text-[var(--color-neutral-400)]">/{kpi.totalStudents}</span>
      </KPICard>
    </div>
  );
}
