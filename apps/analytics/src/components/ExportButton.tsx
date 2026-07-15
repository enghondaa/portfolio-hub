"use client";

import { downloadCSV } from "@/lib/csv";

/** A small "Export CSV" button reused across panels — takes the headers/rows the panel already computed, so it never re-derives data on its own. */
export function ExportButton({
  filename,
  headers,
  rows,
}: {
  filename: string;
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <button
      type="button"
      onClick={() => downloadCSV(filename, headers, rows)}
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-neutral-200)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-neutral-600)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
    >
      Export CSV
    </button>
  );
}
