import { Reveal } from "@/components/Reveal";
import { RotatingWord } from "@/components/RotatingWord";
import { PillButton } from "@/components/PillButton";

/** Hero: availability badge, immediate (non-staggered) headline with a rotating word, subcopy, and a CTA row. */
export function HeroIntro() {
  return (
    <div>
      <Reveal>
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-4 py-2 font-mono text-xs text-[var(--color-neutral-600)] shadow-[0_8px_24px_-18px_rgba(90,55,20,0.5)]">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-[var(--color-success)]"
            style={{ boxShadow: "0 0 0 4px color-mix(in srgb, var(--color-success) 18%, transparent)" }}
          />
          Available — Full-Stack Developer
        </div>
      </Reveal>

      <h1 className="mt-7 font-[family-name:var(--font-heading)] text-[clamp(48px,9.2vw,128px)] font-bold leading-[0.95] tracking-[-0.03em] text-[var(--color-neutral-800)]">
        I build fast,
        <br />
        human interfaces
        <br />
        for <RotatingWord />
      </h1>

      <div className="mt-9 grid gap-8 sm:gap-14 lg:grid-cols-[1.5fr_1fr] lg:items-end">
        <Reveal delay={0.05}>
          <p className="max-w-[50ch] text-lg leading-relaxed text-[var(--color-neutral-700)] sm:text-xl">
            Senior front-end developer who pivoted into tech from a non-CS background. I ship
            scalable React apps for international teams across crypto, blockchain, and education —
            used by <strong className="font-semibold text-[var(--color-neutral-800)]">10K+ people daily</strong> and{" "}
            <strong className="font-semibold text-[var(--color-neutral-800)]">150+ schools</strong>.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap gap-3">
            <PillButton href="/projects" variant="accent">
              View work →
            </PillButton>
            <PillButton href="https://www.linkedin.com/in/mohand-elshahawy-b07523235/" variant="outline" external>
              LinkedIn ↗
            </PillButton>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
