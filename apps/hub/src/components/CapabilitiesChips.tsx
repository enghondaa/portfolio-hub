import { Reveal } from "@/components/Reveal";

const chips: { label: string; accent?: boolean }[] = [
  { label: "React.js" },
  { label: "Next.js" },
  { label: "TypeScript" },
  { label: "Web3React", accent: true },
  { label: "Redux Toolkit" },
  { label: "D3.js" },
  { label: "Chart.js" },
  { label: "NFT Minting", accent: true },
  { label: "Tailwind CSS" },
  { label: "Material-UI" },
  { label: "Accessibility" },
  { label: "Jest · RTL" },
  { label: "GitHub Actions" },
  { label: "Node · Express" },
  { label: "Strapi" },
];

export function CapabilitiesChips() {
  return (
    <section className="border-y border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
      <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-14 sm:py-24">
        <Reveal>
          <p className="mb-7 font-mono text-xs text-[var(--color-accent)]">/ toolkit</p>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="flex flex-wrap gap-2.5">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className={
                  chip.accent
                    ? "rounded-2xl bg-[var(--color-accent)] px-[18px] py-2 font-[family-name:var(--font-heading)] text-[clamp(16px,1.7vw,22px)] font-semibold text-[var(--color-neutral-800)]"
                    : "rounded-2xl bg-[var(--color-neutral-100)] px-[18px] py-2 font-[family-name:var(--font-heading)] text-[clamp(16px,1.7vw,22px)] font-semibold text-[var(--color-neutral-800)]"
                }
              >
                {chip.label}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
