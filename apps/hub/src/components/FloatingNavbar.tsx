"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Nav link / CTA pill that leans gently toward the cursor. Plain CSS transform, no dependency. */
function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMouseMove(event: MouseEvent<HTMLSpanElement>) {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    setOffset({
      x: (event.clientX - (rect.left + rect.width / 2)) * 0.3,
      y: (event.clientY - (rect.top + rect.height / 2)) * 0.4,
    });
  }

  return (
    <span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      className={`inline-block transition-transform duration-150 ease-out ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

/** Floating, centered, glass-pill navbar — brand, page links, and a Hire-me CTA. */
export function FloatingNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="fixed inset-x-0 top-3 z-50 flex justify-center px-4">
      <nav
        aria-label="Primary"
        className="flex w-full max-w-fit flex-col items-stretch gap-0 rounded-[28px] border border-[var(--color-neutral-200)] bg-[color-mix(in_srgb,var(--color-neutral-50)_78%,transparent)] shadow-[0_10px_30px_-18px_rgba(90,55,20,0.4)] backdrop-blur-md sm:rounded-full"
      >
        <div className="flex items-center gap-3 py-[9px] pl-[22px] pr-[9px] sm:gap-[clamp(12px,2vw,26px)]">
          <Link
            href="/"
            className="font-[family-name:var(--font-heading)] text-base font-bold tracking-tight text-[var(--color-neutral-800)]"
          >
            Mohand<span className="text-[var(--color-accent)]">.</span>
          </Link>

          <span className="hidden items-center gap-[clamp(12px,1.6vw,22px)] font-mono text-[12.5px] text-[var(--color-neutral-600)] sm:flex">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`transition-colors duration-200 hover:text-[var(--color-neutral-800)] ${
                    isActive ? "text-[var(--color-neutral-800)]" : ""
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </span>

          <Magnetic className="hidden sm:inline-block">
            <a
              href="mailto:eng.mohand2389@gmail.com"
              className="whitespace-nowrap rounded-full bg-[var(--color-neutral-800)] px-[18px] py-[10px] font-mono text-[12.5px] text-[var(--color-neutral-0)]"
            >
              Hire me
            </a>
          </Magnetic>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-panel"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-neutral-800)] sm:hidden"
          >
            {isOpen ? <X size={19} strokeWidth={1.75} aria-hidden="true" /> : <Menu size={19} strokeWidth={1.75} aria-hidden="true" />}
          </button>
        </div>

        <div
          id="mobile-nav-panel"
          hidden={!isOpen}
          className="flex flex-col gap-1 border-t border-[var(--color-neutral-200)] px-4 py-3 sm:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2 py-2 font-mono text-sm text-[var(--color-neutral-700)]"
            >
              {link.label}
            </Link>
          ))}
          <a href="mailto:eng.mohand2389@gmail.com" className="rounded-lg px-2 py-2 font-mono text-sm text-[var(--color-accent)]">
            Hire me →
          </a>
        </div>
      </nav>
    </div>
  );
}
