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
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-neutral-200)] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-neutral-600)] transition-all duration-200 hover:border-[var(--color-accent)] hover:bg-[rgba(139,124,246,0.1)] hover:text-[var(--color-accent)]"
    >
      Export CSV
    </button>
  );
}
