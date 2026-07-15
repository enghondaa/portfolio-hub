import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Reveal } from "@/components/Reveal";

const stats: { value: string; label: string; dark?: boolean }[] = [
  { value: "5+", label: "Years experience" },
  { value: "10K+", label: "Daily active users", dark: true },
  { value: "150+", label: "Schools as clients" },
  { value: "99.8%", label: "Uptime maintained" },
  { value: "12+", label: "Feature releases" },
];

export function HeroStats() {
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5">
      {stats.map((stat, i) => (
        <Reveal key={stat.label} delay={i * 0.05}>
          <div
            className={
              stat.dark
                ? "rounded-[20px] bg-[var(--color-neutral-800)] p-6 shadow-[0_18px_44px_-28px_rgba(90,55,20,0.7)]"
                : "rounded-[20px] border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-6 shadow-[0_18px_44px_-30px_rgba(90,55,20,0.5)]"
            }
          >
            <div
              className={
                stat.dark
                  ? "font-[family-name:var(--font-heading)] text-[clamp(34px,4.4vw,54px)] font-bold leading-none tracking-[-0.02em] text-[var(--color-accent-light)] tabular-nums"
                  : "font-[family-name:var(--font-heading)] text-[clamp(34px,4.4vw,54px)] font-bold leading-none tracking-[-0.02em] text-[var(--color-neutral-800)] tabular-nums"
              }
            >
              <AnimatedNumber value={stat.value} />
            </div>
            <div className={stat.dark ? "mt-2.5 font-mono text-[11.5px] text-[#b3a594]" : "mt-2.5 font-mono text-[11.5px] text-[var(--color-neutral-600)]"}>
              {stat.label}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
