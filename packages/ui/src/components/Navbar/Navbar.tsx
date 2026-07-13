"use client";

import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface NavLink {
  href: string;
  label: string;
}

export interface NavbarProps {
  brand: ReactNode;
  links: NavLink[];
  /** Rendered at the end of the nav, e.g. a ThemeToggle. */
  actions?: ReactNode;
  className?: string;
}

/**
 * Responsive top nav. Collapses to an accessible disclosure menu below the
 * md breakpoint: a single button with aria-expanded toggles a visible panel,
 * and every link remains reachable by keyboard.
 */
export function Navbar({ brand, links, actions, className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className={cn(
        "border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)]",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="font-[var(--font-heading)] text-lg font-semibold tracking-tight text-[var(--color-neutral-800)]">
          {brand}
        </div>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
            >
              {link.label}
            </a>
          ))}
          {actions}
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--color-neutral-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            {isOpen ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary"
        hidden={!isOpen}
        className="border-t border-[var(--color-neutral-200)] px-4 py-3 md:hidden"
      >
        <ul className="flex flex-col gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block min-h-11 rounded-md px-2 py-2.5 text-base font-medium text-[var(--color-neutral-800)] hover:bg-[var(--color-neutral-100)]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        {actions && <div className="mt-2 border-t border-[var(--color-neutral-200)] pt-2">{actions}</div>}
      </nav>
    </header>
  );
}
