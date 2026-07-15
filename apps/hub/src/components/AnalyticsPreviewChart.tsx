"use client";

import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

type Range = "week" | "month" | "year";

// Seeded demo data only — this mirrors the kind of chart in the Analytics
// Dashboard demo, not any real school's numbers.
const datasets: Record<Range, { labels: string[]; values: number[] }> = {
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [412, 460, 398, 501, 486, 220, 190],
  },
  month: {
    labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
    values: [2380, 2510, 2290, 2640],
  },
  year: {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    values: [9800, 11200, 10450, 12300],
  },
};

const ranges: { key: Range; label: string }[] = [
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "year", label: "This year" },
];

export function AnalyticsPreviewChart() {
  const [range, setRange] = useState<Range>("week");
  const active = datasets[range];

  const data = useMemo(
    () => ({
      labels: active.labels,
      datasets: [
        {
          label: "Active students",
          data: active.values,
          borderColor: "#d97a2b",
          backgroundColor: "rgba(217, 122, 43, 0.12)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.35,
          fill: true,
        },
      ],
    }),
    [active]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#98968f", font: { family: "var(--font-mono)", size: 11 } } },
        y: { display: false },
      },
    }),
    []
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Chart time range">
        {ranges.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRange(r.key)}
            aria-pressed={range === r.key}
            className={
              range === r.key
                ? "rounded-full bg-[var(--color-accent)] px-3 py-1 font-mono text-xs uppercase tracking-wider text-[var(--color-neutral-0)]"
                : "rounded-full border border-[var(--color-neutral-200)] px-3 py-1 font-mono text-xs uppercase tracking-wider text-[var(--color-neutral-600)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            }
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="mt-6 h-48">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
