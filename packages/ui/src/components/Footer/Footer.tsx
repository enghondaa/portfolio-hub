import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface FooterLink {
  href: string;
  label: string;
}

export interface FooterProps {
  /** e.g. "© 2026 Mohand Elshahawy" */
  copyright: string;
  links?: FooterLink[];
  /** Extra content, e.g. a link back to the hub from a demo app. */
  children?: ReactNode;
  className?: string;
}

export function Footer({ copyright, links = [], children, className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)]",
        className
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-[var(--color-neutral-600)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>{copyright}</p>
        {links.length > 0 && (
          <nav aria-label="Footer" className="flex flex-wrap gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[var(--color-neutral-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
        {children}
      </div>
    </footer>
  );
}
