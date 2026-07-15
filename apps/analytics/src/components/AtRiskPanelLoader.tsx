"use client";

import dynamic from "next/dynamic";

const AtRiskTable = dynamic(() => import("@/components/AtRiskTable").then((m) => m.AtRiskTable), {
  ssr: false,
  loading: () => <div className="h-40 animate-pulse rounded-xl bg-[var(--color-neutral-100)]" />,
});

export function AtRiskPanelLoader() {
  return <AtRiskTable />;
}
