"use client";

import dynamic from "next/dynamic";

// Chart.js is a real dependency — load it only after first paint, client-side
// only, so it can never be this page's LCP element or block initial render.
const AttendanceChart = dynamic(() => import("@/components/AttendanceChart").then((m) => m.AttendanceChart), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-[var(--color-neutral-100)]" />,
});

export function AttendancePanelLoader() {
  return <AttendanceChart />;
}
