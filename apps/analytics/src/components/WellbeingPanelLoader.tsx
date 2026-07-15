"use client";

import dynamic from "next/dynamic";
import { HeatmapLegend } from "@/components/HeatmapLegend";

const WellbeingHeatmap = dynamic(() => import("@/components/WellbeingHeatmap").then((m) => m.WellbeingHeatmap), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-[var(--color-neutral-100)]" />,
});

export function WellbeingPanelLoader() {
  return (
    <div>
      <WellbeingHeatmap />
      <HeatmapLegend />
    </div>
  );
}
