"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useFilterStore } from "@/lib/store";
import { getAttendanceSeries } from "@/lib/data";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const options: ChartOptions<"line"> = {
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
    tooltip: {
      backgroundColor: "#1a1e28",
      titleColor: "#e8eaf2",
      bodyColor: "#b4b9c7",
      borderColor: "rgba(226, 229, 240, 0.1)",
      borderWidth: 1,
      padding: 10,
      callbacks: { label: (ctx) => `Attendance: ${ctx.parsed.y}%` },
    },
  },
};

export function AttendanceChart() {
  const { timeRange, gradeBand } = useFilterStore();
  const series = useMemo(() => getAttendanceSeries(timeRange, gradeBand), [timeRange, gradeBand]);

  const data = {
    labels: series.map((p) => p.label),
    datasets: [
      {
        data: series.map((p) => p.rate),
        borderColor: "#8b7cf6",
        backgroundColor: "rgba(139, 124, 246, 0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: "#8b7cf6",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}
