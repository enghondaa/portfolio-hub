"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useFilterStore } from "@/lib/store";
import { getAttendanceSeries } from "@/lib/data";
import { ExportButton } from "@/components/ExportButton";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

function buildOptions(showLegend: boolean): ChartOptions<"line"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    scales: {
      x: {
        grid: { color: "rgba(226, 229, 240, 0.06)" },
        ticks: { color: "#6b7180", font: { family: "var(--font-mono)", size: 11 } },
      },
      y: {
        min: 75,
        max: 100,
        grid: { color: "rgba(226, 229, 240, 0.06)" },
        ticks: { color: "#6b7180", font: { family: "var(--font-mono)", size: 11 }, callback: (v) => `${v}%` },
      },
    },
    plugins: {
      legend: {
        display: showLegend,
        labels: { color: "#9096a8", font: { family: "var(--font-mono)", size: 11 }, boxWidth: 12 },
      },
      tooltip: {
        backgroundColor: "#1a1e28",
        titleColor: "#e8eaf2",
        bodyColor: "#b4b9c7",
        borderColor: "rgba(226, 229, 240, 0.1)",
        borderWidth: 1,
        padding: 10,
        callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%` },
      },
    },
  };
}

export function AttendanceChart() {
  const { timeRange, gradeBand, compareBand } = useFilterStore();
  const series = useMemo(() => getAttendanceSeries(timeRange, gradeBand), [timeRange, gradeBand]);
  const compareSeries = useMemo(
    () => (compareBand ? getAttendanceSeries(timeRange, compareBand) : null),
    [timeRange, compareBand]
  );

  const data = {
    labels: series.map((p) => p.label),
    datasets: [
      {
        label: gradeBand,
        data: series.map((p) => p.rate),
        borderColor: "#8b7cf6",
        backgroundColor: "rgba(139, 124, 246, 0.12)",
        fill: !compareSeries,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#8b7cf6",
        borderWidth: 2,
      },
      ...(compareSeries
        ? [
            {
              label: compareBand as string,
              data: compareSeries.map((p) => p.rate),
              borderColor: "#22d3ee",
              backgroundColor: "rgba(34, 211, 238, 0.1)",
              fill: false,
              tension: 0.35,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointHoverBackgroundColor: "#22d3ee",
              borderWidth: 2,
              borderDash: [4, 3],
            },
          ]
        : []),
    ],
  };

  const csvHeaders = ["Week", gradeBand, ...(compareSeries ? [compareBand as string] : [])];
  const csvRows = series.map((p, i) => [p.label, p.rate, ...(compareSeries ? [compareSeries[i]?.rate ?? ""] : [])]);

  return (
    <div>
      <div className="flex justify-end">
        <ExportButton filename={`attendance-${gradeBand}-${timeRange}.csv`} headers={csvHeaders} rows={csvRows} />
      </div>
      <div className="mt-3 h-64">
        <Line data={data} options={buildOptions(Boolean(compareSeries))} />
      </div>
    </div>
  );
}
