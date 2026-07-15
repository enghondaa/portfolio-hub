import { Reveal } from "@/components/Reveal";
import { PillButton } from "@/components/PillButton";

const CONTACT_EMAIL = "eng.mohand2389@gmail.com";

export function ContactCTA({ heading = "Let's build something measurable." }: { heading?: string }) {
  return (
    <Reveal>
      <div className="rounded-[32px] bg-[var(--color-neutral-800)] px-6 py-14 text-center text-[var(--color-neutral-0)] shadow-[0_40px_90px_-50px_rgba(90,55,20,0.8)] sm:px-14 sm:py-20">
        <p className="mb-6 font-mono text-xs text-[var(--color-accent-light)]">/ let&apos;s talk</p>
        <h2 className="mx-auto max-w-[16ch] font-[family-name:var(--font-heading)] text-[clamp(38px,7vw,88px)] font-bold leading-[0.98] tracking-[-0.03em]">
          {heading}
        </h2>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <PillButton href={`mailto:${CONTACT_EMAIL}`} variant="accent">
            {CONTACT_EMAIL} →
          </PillButton>
          <PillButton href="https://www.linkedin.com/in/mohand-elshahawy-b07523235/" variant="outline-light" external>
            LinkedIn ↗
          </PillButton>
          <PillButton href="tel:+201033002529" variant="outline-light">
            +20 103 300 2529
          </PillButton>
        </div>
      </div>
    </Reveal>
  );
}
