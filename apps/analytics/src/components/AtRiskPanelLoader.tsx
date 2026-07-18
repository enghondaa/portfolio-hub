"use client";

import dynamic from "next/dynamic";

const AtRiskTable = dynamic(() => import("@/components/AtRiskTable").then((m) => m.AtRiskTable), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded-2xl bg-[rgba(255,255,255,0.04)]" />,
});

export function AtRiskPanelLoader() {
  return <AtRiskTable />;
}
