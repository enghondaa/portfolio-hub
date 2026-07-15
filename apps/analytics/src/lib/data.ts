import { hashString, mulberry32 } from "@/lib/seed";

export type TimeRange = "4w" | "12w" | "26w";
export type GradeBand = "All" | "K-2" | "3-5" | "6-8" | "9-12";

export const TIME_RANGES: { value: TimeRange; label: string; weeks: number }[] = [
  { value: "4w", label: "4 weeks", weeks: 4 },
  { value: "12w", label: "12 weeks", weeks: 12 },
  { value: "26w", label: "26 weeks", weeks: 26 },
];

export const GRADE_BANDS: GradeBand[] = ["All", "K-2", "3-5", "6-8", "9-12"];

export interface AttendancePoint {
  label: string;
  rate: number;
}

export interface GradeDistributionPoint {
  grade: string;
  count: number;
}

export interface HeatmapCell {
  week: number;
  day: string;
  score: number;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

function weeksFor(range: TimeRange): number {
  return TIME_RANGES.find((r) => r.value === range)?.weeks ?? 12;
}

/** Weekly attendance rate, seeded per (range, gradeBand) so it's stable across server/client renders and re-renders the same way for the same filter combination. */
export function getAttendanceSeries(range: TimeRange, gradeBand: GradeBand): AttendancePoint[] {
  const weeks = weeksFor(range);
  const random = mulberry32(hashString(`attendance:${range}:${gradeBand}`));
  const base = 90 + random() * 6;

  const points: AttendancePoint[] = [];
  for (let i = 0; i < weeks; i++) {
    const drift = Math.sin(i / 3.2) * 2.2;
    const noise = (random() - 0.5) * 3;
    const rate = Math.max(80, Math.min(99.5, base + drift + noise));
    points.push({ label: `Wk ${i + 1}`, rate: Math.round(rate * 10) / 10 });
  }
  return points;
}

/** Grade distribution across letter-grade bands, seeded per (range, gradeBand). */
export function getGradeDistribution(range: TimeRange, gradeBand: GradeBand): GradeDistributionPoint[] {
  const random = mulberry32(hashString(`grades:${range}:${gradeBand}`));
  const grades = ["A", "B", "C", "D", "F"];
  const weights = [0.28, 0.34, 0.22, 0.11, 0.05].map((w) => w + (random() - 0.5) * 0.06);
  const total = 420 + Math.round(random() * 180);

  return grades.map((grade, i) => ({
    grade,
    count: Math.max(4, Math.round((weights[i] ?? 0.1) * total)),
  }));
}

/** Weekly wellbeing score per weekday, seeded per (range, gradeBand) — capped at 8 weeks of grid so the heatmap stays readable even on the 26-week range. */
export function getWellbeingHeatmap(range: TimeRange, gradeBand: GradeBand): HeatmapCell[] {
  const weeks = Math.min(8, weeksFor(range));
  const random = mulberry32(hashString(`wellbeing:${range}:${gradeBand}`));
  const base = 62 + random() * 15;

  const cells: HeatmapCell[] = [];
  for (let week = 0; week < weeks; week++) {
    for (const day of WEEKDAYS) {
      const dayOffset = day === "Mon" ? -4 : day === "Fri" ? -6 : 3;
      const noise = (random() - 0.5) * 14;
      const score = Math.max(30, Math.min(96, base + dayOffset + noise));
      cells.push({ week, day, score: Math.round(score) });
    }
  }
  return cells;
}
