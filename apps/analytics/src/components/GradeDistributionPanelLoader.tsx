"use client";

import dynamic from "next/dynamic";

const GradeDistributionChart = dynamic(
  () => import("@/components/GradeDistributionChart").then((m) => m.GradeDistributionChart),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-2xl bg-[rgba(255,255,255,0.04)]" /> }
);

export function GradeDistributionPanelLoader() {
  return <GradeDistributionChart />;
}
