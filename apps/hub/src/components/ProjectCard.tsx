"use client";

import { useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export interface ProjectCardProps {
  index: number;
  href: string;
  title: string;
  description: string;
  stack: string[];
  tag: string;
  external?: boolean;
  featured?: boolean;
  wide?: boolean;
}

/** Numbered project card with a subtle cursor-tracked 3D tilt (skipped under prefers-reduced-motion). Featured cards get the dark treatment; wide cards span the full grid row. */
export function ProjectCard({ index, href, title, description, stack, tag, external, featured, wide }: ProjectCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const Arrow = external ? ArrowUpRight : ArrowRight;
  const number = String(index + 1).padStart(2, "0");

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 7, ry: px * 7 });
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0 });
  }

  const cardTone = featured
    ? "bg-[var(--color-neutral-800)] text-[var(--color-neutral-0)] shadow-[0_24px_54px_-32px_rgba(90,55,20,0.7)]"
    : "border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] shadow-[0_24px_54px_-34px_rgba(90,55,20,0.5)]";
  const tagTone = featured ? "bg-[rgba(247,241,232,0.12)] text-[#d8cab6]" : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)]";
  const numberTone = featured ? "text-[var(--color-accent-light)]" : "text-[var(--color-accent)]";
  const descTone = featured ? "text-[#cfc2b0]" : "text-[var(--color-neutral-700)]";
  const stackTone = featured ? "text-[#9a8d7a]" : "text-[var(--color-neutral-400)]";

  const style = { transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`, transformStyle: "preserve-3d" as const };
  const linkProps = { target: external ? "_blank" : undefined, rel: external ? "noopener noreferrer" : undefined };

  if (wide) {
    return (
      <a
        ref={ref}
        href={href}
        {...linkProps}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        className={`group flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6 no-underline transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] sm:col-span-2 sm:p-8 ${cardTone}`}
      >
        <div className="max-w-[560px]">
          <div className="mb-2.5 flex items-center gap-3">
            <span className={`font-mono text-xs ${numberTone}`}>{number}</span>
            <span className={`rounded-full px-2.5 py-1 font-mono text-[11.5px] ${tagTone}`}>{tag}</span>
          </div>
          <div className="font-[family-name:var(--font-heading)] text-[clamp(24px,2.8vw,34px)] font-bold tracking-[-0.02em]">
            {title}{" "}
            <Arrow aria-hidden="true" size={20} strokeWidth={2} className="inline transition-transform duration-150 group-hover:translate-x-1" />
          </div>
          <p className={`mt-2 text-[15px] leading-relaxed ${descTone}`}>{description}</p>
        </div>
        <div className={`font-mono text-[11px] ${stackTone}`}>{stack.join(" · ")}</div>
      </a>
    );
  }

  return (
    <a
      ref={ref}
      href={href}
      {...linkProps}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`group flex min-h-[230px] flex-col gap-3.5 rounded-3xl p-6 no-underline transition-transform duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] sm:p-8 ${cardTone}`}
    >
      <div className="flex items-center justify-between">
        <span className={`font-mono text-xs ${numberTone}`}>{number}</span>
        <span className={`rounded-full px-2.5 py-1 font-mono text-[11.5px] ${tagTone}`}>{tag}</span>
      </div>
      <div className="mt-auto font-[family-name:var(--font-heading)] text-[clamp(24px,2.8vw,32px)] font-bold tracking-[-0.02em]">
        {title} <Arrow aria-hidden="true" size={20} strokeWidth={2} className="inline transition-transform duration-150 group-hover:translate-x-1" />
      </div>
      <p className={`text-[15px] leading-relaxed ${descTone}`}>{description}</p>
      <div className={`font-mono text-[11px] ${stackTone}`}>{stack.join(" · ")}</div>
    </a>
  );
}
