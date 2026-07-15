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

export interface RosterStudent {
  id: string;
  attendance: number;
  gradeScore: number;
  wellbeing: number;
}

export interface KPISummary {
  attendanceRate: number;
  attendanceDelta: number;
  avgGradeScore: number;
  avgGradeDelta: number;
  avgWellbeing: number;
  wellbeingDelta: number;
  atRiskCount: number;
  atRiskDelta: number;
  totalStudents: number;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const GRADE_POINTS: Record<string, number> = { A: 95, B: 85, C: 75, D: 65, F: 50 };
// Fixed anchor so week labels are real calendar dates but stay deterministic
// across every rebuild, rather than drifting with whenever this happened to
// be built.
const TERM_START = new Date(Date.UTC(2026, 0, 5)); // a Monday

const ROSTER_SIZE: Record<GradeBand, number> = { All: 420, "K-2": 140, "3-5": 150, "6-8": 130, "9-12": 160 };

function weeksFor(range: TimeRange): number {
  return TIME_RANGES.find((r) => r.value === range)?.weeks ?? 12;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function formatWeekLabel(weekIndex: number): string {
  const date = new Date(TERM_START);
  date.setUTCDate(date.getUTCDate() + weekIndex * 7);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

/** Weekly attendance rate, seeded per (range, gradeBand) so it's stable across server/client renders and re-renders the same way for the same filter combination. Labels are real (fixed-anchor) calendar dates. */
export function getAttendanceSeries(range: TimeRange, gradeBand: GradeBand): AttendancePoint[] {
  const weeks = weeksFor(range);
  const random = mulberry32(hashString(`attendance:${range}:${gradeBand}`));
  const base = 90 + random() * 6;

  const points: AttendancePoint[] = [];
  for (let i = 0; i < weeks; i++) {
    const drift = Math.sin(i / 3.2) * 2.2;
    const noise = (random() - 0.5) * 3;
    const rate = clamp(base + drift + noise, 80, 99.5);
    points.push({ label: formatWeekLabel(i), rate: Math.round(rate * 10) / 10 });
  }
  return points;
}

/** Grade distribution across letter-grade bands, seeded per (range, gradeBand). Pass period:"previous" to get the prior-period comparison snapshot used for the KPI delta. */
export function getGradeDistribution(
  range: TimeRange,
  gradeBand: GradeBand,
  period: "current" | "previous" = "current"
): GradeDistributionPoint[] {
  const random = mulberry32(hashString(`grades:${range}:${gradeBand}:${period}`));
  const grades = ["A", "B", "C", "D", "F"];
  const drift = period === "previous" ? -0.015 : 0;
  const weights = [0.28, 0.34, 0.22, 0.11, 0.05].map((w, i) => w + (random() - 0.5) * 0.06 + (i <= 1 ? drift : -drift / 3));
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
      const score = clamp(base + dayOffset + noise, 30, 96);
      cells.push({ week, day, score: Math.round(score) });
    }
  }
  return cells;
}

/**
 * A synthetic per-student roster — anonymized IDs only, never fake names —
 * seeded per (range, gradeBand). This is what the at-risk signal and its
 * drill-down table are built from: it's the one place these three
 * dimensions exist on the same row, which the aggregate charts above don't
 * give you.
 */
export function getRoster(
  range: TimeRange,
  gradeBand: GradeBand,
  period: "current" | "previous" = "current"
): RosterStudent[] {
  const random = mulberry32(hashString(`roster:${range}:${gradeBand}:${period}`));
  const size = ROSTER_SIZE[gradeBand] ?? 200;
  // The "previous" snapshot is a slightly worse-off version of the same
  // seeded population, giving the at-risk count a legitimate (still
  // synthetic) trend to compare against instead of a bare, trendless total.
  const shift = period === "previous" ? 3.5 : 0;

  const students: RosterStudent[] = [];
  for (let i = 0; i < size; i++) {
    // Skewed so most students cluster in a healthy range with a longer tail
    // toward the bottom — realistic-looking without a real distribution model.
    const attendance = clamp(78 + random() * 20 - Math.pow(random(), 3) * 25 - shift, 55, 100);
    const gradeScore = clamp(55 + random() * 40 - Math.pow(random(), 3) * 20 - shift, 35, 100);
    const wellbeing = clamp(45 + random() * 48 - Math.pow(random(), 3) * 25 - shift, 20, 100);
    students.push({
      id: `${gradeBand === "All" ? "STU" : gradeBand}-${String(i + 1).padStart(4, "0")}`,
      attendance: Math.round(attendance * 10) / 10,
      gradeScore: Math.round(gradeScore * 10) / 10,
      wellbeing: Math.round(wellbeing * 10) / 10,
    });
  }
  return students;
}

const AT_RISK_THRESHOLDS = { attendance: 85, gradeScore: 70, wellbeing: 55 };

function isAtRisk(s: RosterStudent): boolean {
  return (
    s.attendance < AT_RISK_THRESHOLDS.attendance &&
    s.gradeScore < AT_RISK_THRESHOLDS.gradeScore &&
    s.wellbeing < AT_RISK_THRESHOLDS.wellbeing
  );
}

/** Students below threshold on all three dimensions at once — the intersection the aggregate charts can't show on their own. */
export function getAtRiskStudents(range: TimeRange, gradeBand: GradeBand): RosterStudent[] {
  return getRoster(range, gradeBand).filter(isAtRisk);
}

/** Headline KPIs, each with a trend delta computed from the same seeded series/distribution/heatmap data used above — not separately invented numbers. */
export function getKPISummary(range: TimeRange, gradeBand: GradeBand): KPISummary {
  const attendance = getAttendanceSeries(range, gradeBand);
  const half = Math.max(1, Math.floor(attendance.length / 2));
  const prevAttendanceRates = attendance.slice(0, half).map((p) => p.rate);
  const currAttendanceRates = attendance.slice(half).map((p) => p.rate);
  const attendanceRate = mean(currAttendanceRates);
  const attendanceDelta = attendanceRate - mean(prevAttendanceRates);

  const currentGrades = getGradeDistribution(range, gradeBand, "current");
  const previousGrades = getGradeDistribution(range, gradeBand, "previous");
  const avgGradeScore = weightedGradeScore(currentGrades);
  const avgGradeDelta = avgGradeScore - weightedGradeScore(previousGrades);

  const heatmap = getWellbeingHeatmap(range, gradeBand);
  const weeks = Array.from(new Set(heatmap.map((c) => c.week))).sort((a, b) => a - b);
  const heatmapHalf = Math.max(1, Math.floor(weeks.length / 2));
  const prevWeeks = new Set(weeks.slice(0, heatmapHalf));
  const prevWellbeing = mean(heatmap.filter((c) => prevWeeks.has(c.week)).map((c) => c.score));
  const currWellbeing = mean(heatmap.filter((c) => !prevWeeks.has(c.week)).map((c) => c.score));

  const roster = getRoster(range, gradeBand, "current");
  const previousRoster = getRoster(range, gradeBand, "previous");
  const atRiskCount = roster.filter(isAtRisk).length;
  const previousAtRiskCount = previousRoster.filter(isAtRisk).length;

  return {
    attendanceRate: Math.round(attendanceRate * 10) / 10,
    attendanceDelta: Math.round(attendanceDelta * 10) / 10,
    avgGradeScore: Math.round(avgGradeScore * 10) / 10,
    avgGradeDelta: Math.round(avgGradeDelta * 10) / 10,
    avgWellbeing: Math.round(currWellbeing * 10) / 10,
    wellbeingDelta: Math.round((currWellbeing - prevWellbeing) * 10) / 10,
    atRiskCount,
    atRiskDelta: atRiskCount - previousAtRiskCount,
    totalStudents: roster.length,
  };
}

function weightedGradeScore(dist: GradeDistributionPoint[]): number {
  const total = dist.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) return 0;
  const weighted = dist.reduce((sum, d) => sum + d.count * (GRADE_POINTS[d.grade] ?? 70), 0);
  return weighted / total;
}
