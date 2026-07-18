"use client";

import dynamic from "next/dynamic";
import { HeatmapLegend } from "@/components/HeatmapLegend";

const WellbeingHeatmap = dynamic(() => import("@/components/WellbeingHeatmap").then((m) => m.WellbeingHeatmap), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-2xl bg-[rgba(255,255,255,0.04)]" />,
});

export function WellbeingPanelLoader() {
  return (
    <div>
      <WellbeingHeatmap />
      <HeatmapLegend />
    </div>
  );
}
