"use client";

import { useMemo, useState } from "react";
import { useFilterStore } from "@/lib/store";
import { getAtRiskStudents } from "@/lib/data";
import { ExportButton } from "@/components/ExportButton";

const VISIBLE_ROWS = 8;

/** Drill-down table for students flagged on all three signals at once (low attendance + low grades + low wellbeing). Anonymized IDs only — no invented names, matching the rest of the demo's honesty constraint. */
export function AtRiskTable() {
  const { timeRange, gradeBand } = useFilterStore();
  const students = useMemo(() => getAtRiskStudents(timeRange, gradeBand), [timeRange, gradeBand]);
  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo(
    () => [...students].sort((a, b) => a.attendance + a.gradeScore + a.wellbeing - (b.attendance + b.gradeScore + b.wellbeing)),
    [students]
  );
  const visible = expanded ? sorted : sorted.slice(0, VISIBLE_ROWS);

  const csvRows = sorted.map((s) => [s.id, s.attendance, s.gradeScore, s.wellbeing]);

  if (students.length === 0) {
    return (
      <p className="text-sm text-[var(--color-neutral-600)]">
        No students in this range fall below all three risk thresholds at once.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-[var(--color-neutral-600)]">
          {students.length} students flagged — attendance under 85%, grade score under 70, and wellbeing under 55, all at once.
        </p>
        <ExportButton
          filename={`at-risk-${gradeBand}-${timeRange}.csv`}
          headers={["Student ID", "Attendance %", "Grade score", "Wellbeing score"]}
          rows={csvRows}
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--color-neutral-200)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-neutral-200)] bg-[rgba(255,255,255,0.04)]">
              <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-neutral-400)]">Student</th>
              <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-neutral-400)]">Attendance</th>
              <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-neutral-400)]">Grade score</th>
              <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-neutral-400)]">Wellbeing</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr key={s.id} className="border-b border-[var(--color-neutral-200)] transition-colors last:border-0 hover:bg-[rgba(255,255,255,0.025)]">
                <td className="px-4 py-2.5 font-mono text-xs text-[var(--color-neutral-800)]">{s.id}</td>
                <td className="px-4 py-2.5 text-[#fb7185]">{s.attendance}%</td>
                <td className="px-4 py-2.5 text-[#fb7185]">{s.gradeScore}</td>
                <td className="px-4 py-2.5 text-[#fb7185]">{s.wellbeing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length > VISIBLE_ROWS && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 font-mono text-xs text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-light)]"
        >
          {expanded ? "Show fewer" : `Show all ${sorted.length}`}
        </button>
      )}
    </div>
  );
}
