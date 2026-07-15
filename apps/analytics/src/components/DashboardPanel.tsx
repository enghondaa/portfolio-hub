import type { ReactNode } from "react";

export function DashboardPanel({
  title,
  description,
  eyebrow,
  children,
}: {
  title: string;
  description: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">{eyebrow}</p>
      <h2 className="mt-2 font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight text-[var(--color-neutral-800)]">
        {title}
      </h2>
      <p className="mt-1 text-sm text-[var(--color-neutral-600)]">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
