const stats = [
  { value: "5+", label: "Years experience" },
  { value: "10,000+", label: "Daily users supported" },
  { value: "150+", label: "Schools served" },
];

export function HeroStats() {
  return (
    <dl className="flex flex-col gap-6 border-l border-[var(--color-neutral-200)] pl-6">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="font-mono text-xs uppercase tracking-wider text-[var(--color-neutral-400)]">
            {stat.label}
          </dt>
          <dd className="mt-1 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--color-neutral-800)]">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
