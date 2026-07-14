"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { cn } from "../../lib/cn";

export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterSocialLink extends FooterLink {
  /** "github" | "linkedin" | "email" — falls back to a generic external-link icon. */
  icon?: "github" | "linkedin" | "email";
}

export interface FooterProps {
  /** Large brand/name shown top-left, e.g. "Mohand Elshahawy". */
  brand?: string;
  /** Short line under the brand, e.g. "Full-Stack Developer". */
  tagline?: string;
  /** e.g. "© 2026 Mohand Elshahawy" */
  copyright: string;
  links?: FooterLink[];
  social?: FooterSocialLink[];
  /** Repeated near the top of the footer, e.g. "Available for freelance projects." */
  availabilityLine?: string;
  /** Extra content, e.g. a link back to the hub from a demo app. */
  children?: ReactNode;
  className?: string;
}

// lucide-react does not ship brand/logo marks (GitHub, LinkedIn, etc. were
// removed to avoid trademark issues) — those two keep a hand-drawn glyph,
// normalized to the same 15px / 1.75 stroke-width as every Lucide icon here
// so the whole set still reads as one consistent icon language.
const iconClassName = "transition-transform duration-150 group-hover:scale-110";

function SocialIcon({ icon }: { icon?: FooterSocialLink["icon"] }) {
  if (icon === "github") {
    return (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={iconClassName}>
        <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.6 2.8 5.5 3.1 5.5 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.1 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
      </svg>
    );
  }
  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={iconClassName}>
        <rect x="3" y="3" width="18" height="18" rx="2.5" />
        <path d="M7.5 10.5v6M7.5 7.5v.01M12 16.5v-3.75c0-1.24 1-2.25 2.25-2.25S16.5 11.5 16.5 12.75v3.75M12 12v4.5" />
      </svg>
    );
  }
  if (icon === "email") {
    return <Mail size={15} strokeWidth={1.75} aria-hidden="true" className={iconClassName} />;
  }
  return <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" className={iconClassName} />;
}

export function Footer({
  brand,
  tagline,
  copyright,
  links = [],
  social = [],
  availabilityLine,
  children,
  className,
}: FooterProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const update = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  return (
    <footer className={cn("border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)]", className)}>
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        {availabilityLine && (
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--color-neutral-400)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            {availabilityLine}
          </p>
        )}

        {brand && (
          <p
            className={cn(
              "font-[var(--font-heading)] font-semibold leading-none tracking-tight text-[var(--color-neutral-800)]",
              availabilityLine ? "mt-6" : ""
            )}
            style={{ fontSize: "clamp(2.5rem, 9vw, 6.5rem)" }}
          >
            {brand}
          </p>
        )}
        {tagline && <p className="mt-3 text-sm text-[var(--color-neutral-600)]">{tagline}</p>}

        <div className="mt-10 flex flex-col gap-x-16 gap-y-8 sm:flex-row sm:flex-wrap sm:justify-between">
          {links.length > 0 && (
            <nav aria-label="Footer">
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="font-mono text-xs uppercase tracking-wider text-[var(--color-neutral-600)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {social.length > 0 && (
            <ul className="space-y-2">
              {social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
                  >
                    {item.label}
                    <SocialIcon icon={item.icon} />
                  </a>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex h-fit items-center gap-1.5 self-start font-mono text-xs uppercase tracking-wider text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
          >
            Back to top
            <ArrowUp size={15} strokeWidth={1.75} aria-hidden="true" className="transition-transform duration-150 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--color-neutral-200)] pt-6 text-sm text-[var(--color-neutral-600)] sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright}</p>
          {children}
        </div>
      </div>
    </footer>
  );
}
