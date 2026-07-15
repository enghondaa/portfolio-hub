"use client";

import { useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const facts = [
  { label: "Education", lines: ["BSc, Computer Science", "Future Academy, Cairo"] },
  { label: "Certifications", lines: ["Advanced React — ITI", "Full-Stack Diploma — Route"] },
  { label: "Based in", lines: ["Giza, Egypt — remote-friendly"] },
];

/** Homepage teaser: bio + a gently tilting quick-facts card, linking through to the full /about page. */
export function AboutTeaser() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (!cardRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 7, ry: px * 7 });
  }

  return (
    <section id="about" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 py-16 sm:px-14 sm:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <p className="font-mono text-xs text-[var(--color-accent)]">/ about</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-[family-name:var(--font-heading)] text-[clamp(30px,4.2vw,54px)] font-bold leading-[1.04] tracking-[-0.025em] text-[var(--color-neutral-800)]">
              Curiosity, turned into a craft.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-[clamp(16px,1.4vw,18px)] leading-relaxed text-[var(--color-neutral-700)]">
              I specialize in the React ecosystem and Web3. Today I&apos;m at Youhue building
              emotion-interactive educational platforms, after years shipping high-performance
              crypto and blockchain apps for international teams.
            </p>
            <p className="mt-4 text-[clamp(16px,1.4vw,18px)] leading-relaxed text-[var(--color-neutral-700)]">
              I care about architecture that scales, interfaces people enjoy, and outcomes you can
              measure.{" "}
              <Link href="/about" className="text-[var(--color-accent)] underline underline-offset-2">
                Full experience →
              </Link>
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
            style={{
              transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transformStyle: "preserve-3d",
            }}
            className="rounded-3xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-7 shadow-[0_30px_60px_-34px_rgba(90,55,20,0.55)] transition-transform duration-200 ease-out sm:p-9"
          >
            <div className="flex flex-col gap-5">
              {facts.map((fact, i) => (
                <div key={fact.label}>
                  {i > 0 && <div className="mb-5 h-px bg-[var(--color-neutral-200)]" />}
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[var(--color-neutral-400)]">
                    {fact.label}
                  </p>
                  {fact.lines.map((line, li) => (
                    <p
                      key={line}
                      className={
                        li === 0
                          ? "mt-1.5 font-[family-name:var(--font-heading)] text-[19px] font-semibold text-[var(--color-neutral-800)]"
                          : "text-[14.5px] text-[var(--color-neutral-600)]"
                      }
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
