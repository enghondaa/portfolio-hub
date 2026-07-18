export function DemoDataBanner() {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-warning)]/30 bg-[rgba(251,191,36,0.09)] px-4 py-3 font-mono text-[11px] tracking-wide text-[var(--color-warning)]">
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-warning)]" />
      Seeded demo data throughout this dashboard. No real students, schools, or grades.
    </div>
  );
}
