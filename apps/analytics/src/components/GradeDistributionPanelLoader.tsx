"use client";

import dynamic from "next/dynamic";

const GradeDistributionChart = dynamic(
  () => import("@/components/GradeDistributionChart").then((m) => m.GradeDistributionChart),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-xl bg-[var(--color-neutral-100)]" /> }
);

export function GradeDistributionPanelLoader() {
  return <GradeDistributionChart />;
}
