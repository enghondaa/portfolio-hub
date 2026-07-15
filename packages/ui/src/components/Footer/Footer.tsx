import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterSocialLink extends FooterLink {
  /** "github" | "linkedin" | "email" — falls back to a generic link glyph. */
  icon?: "github" | "linkedin" | "email";
}

export interface FooterProps {
  /** Large brand/name shown top-left, e.g. "Mohand Elshahawy". */
  brand?: string;
  /** Short line under the brand, e.g. "Senior Front-End Engineer". */
  tagline?: string;
  /** e.g. "© 2026 Mohand Elshahawy" */
  copyright: string;
  links?: FooterLink[];
  social?: FooterSocialLink[];
  /** Extra content, e.g. a link back to the hub from a demo app. */
  children?: ReactNode;
  className?: string;
}

function SocialIcon({ icon }: { icon?: FooterSocialLink["icon"] }) {
  if (icon === "github") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.6 2.8 5.5 3.1 5.5 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.1 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
      </svg>
    );
  }
  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2.5" />
        <path strokeLinecap="round" d="M7.5 10.5v6M7.5 7.5v.01M12 16.5v-3.75c0-1.24 1-2.25 2.25-2.25S16.5 11.5 16.5 12.75v3.75M12 12v4.5" />
      </svg>
    );
  }
  if (icon === "email") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 15 9m-4-3 .9-.9a3.6 3.6 0 0 1 5.1 5.1L20 11M15 20l-.9.9a3.6 3.6 0 0 1-5.1-5.1L10 15" />
    </svg>
  );
}

export function Footer({ brand, tagline, copyright, links = [], social = [], children, className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)]",
        className
      )}
    >
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          {brand && (
            <div>
              <p className="font-[var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--color-neutral-800)]">
                {brand}
              </p>
              {tagline && <p className="mt-1 text-sm text-[var(--color-neutral-600)]">{tagline}</p>}
            </div>
          )}

          <div className="flex flex-wrap gap-x-12 gap-y-6">
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
              <ul className="flex h-fit gap-3">
                {social.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-neutral-200)] text-[var(--color-neutral-600)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                    >
                      <SocialIcon icon={item.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[var(--color-neutral-200)] pt-6 text-sm text-[var(--color-neutral-600)] sm:flex-row sm:items-center sm:justify-between">
          <p>{copyright}</p>
          {children}
        </div>
      </div>
    </footer>
  );
}
