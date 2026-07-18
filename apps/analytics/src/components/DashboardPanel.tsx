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
    <div className="glass panel-hover h-full rounded-3xl p-6">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-1 w-6 rounded-full bg-[var(--color-accent)]" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">{eyebrow}</p>
      </div>
      <h2 className="mt-3 font-[family-name:var(--font-heading)] text-[22px] font-bold tracking-[-0.02em] text-[var(--color-neutral-800)]">
        {title}
      </h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-neutral-600)]">{description}</p>
      <div className="mt-7">{children}</div>
    </div>
  );
}
