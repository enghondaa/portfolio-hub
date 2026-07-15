"use client";

import dynamic from "next/dynamic";
import { Reveal } from "@/components/Reveal";

// Chart.js is a real dependency, not a small one — load it only after first
// paint, client-side only, so it can never be the page's LCP element or
// block the initial render.
const AnalyticsPreviewChart = dynamic(
  () => import("@/components/AnalyticsPreviewChart").then((m) => m.AnalyticsPreviewChart),
  {
    ssr: false,
    loading: () => <div className="mt-6 h-48 animate-pulse rounded-md bg-[var(--color-neutral-100)]" />,
  }
);

export function LiveChartWidget() {
  return (
    <Reveal delay={0.1}>
      <section className="mt-16 rounded-lg border border-[var(--color-neutral-200)] p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
          Live demo, try it
        </p>
        <p className="mt-2 text-sm text-[var(--color-neutral-600)]">
          A preview of the Analytics Dashboard demo — seeded data, one working filter.
        </p>
        <AnalyticsPreviewChart />
      </section>
    </Reveal>
  );
}
