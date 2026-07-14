"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "../../lib/cn";

export interface NavLink {
  href: string;
  label: string;
}

export interface NavbarProps {
  brand: ReactNode;
  links: NavLink[];
  /** Current path, e.g. from next/navigation's usePathname(). Highlights the matching link. */
  activeHref?: string;
  /** Rendered at the end of the nav, e.g. a ThemeToggle. */
  actions?: ReactNode;
  className?: string;
}

/** Nav link that leans gently toward the cursor on hover (max ~6px), via plain CSS transform. No-op if the user prefers reduced motion. */
function MagneticNavLink({
  href,
  isActive,
  reduced,
  onNavigate,
  children,
}: {
  href: string;
  isActive: boolean;
  reduced: boolean;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    setOffset({ x: relX * 0.2, y: relY * 0.3 });
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 });
  }

  return (
    <a
      ref={ref}
      href={href}
      aria-current={isActive ? "page" : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onNavigate}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      className={cn(
        "group relative font-mono text-xs uppercase tracking-wider transition-[color,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded",
        isActive ? "text-[var(--color-accent)]" : "text-[var(--color-neutral-600)] hover:text-[var(--color-accent)]"
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-1 left-0 h-px w-full origin-left bg-current transition-transform duration-200 ease-out",
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </a>
  );
}

/**
 * Responsive top nav. Starts transparent over the hero and gains a blurred
 * background + hairline border once the page scrolls past it. Collapses to
 * an accessible disclosure menu below the md breakpoint: a single button
 * with aria-expanded toggles a visible panel, and every link remains
 * reachable by keyboard.
 */
export function Navbar({ brand, links, activeHref, actions, className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const update = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 32);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled
          ? "border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)]/80 backdrop-blur-md"
          : "border-transparent bg-transparent",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="font-[var(--font-heading)] text-lg font-semibold tracking-tight text-[var(--color-neutral-800)]">
          {brand}
        </div>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <MagneticNavLink
              key={link.href}
              href={link.href}
              isActive={activeHref === link.href}
              reduced={prefersReducedMotion}
            >
              {link.label}
            </MagneticNavLink>
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
          {isOpen ? <X size={22} strokeWidth={1.75} aria-hidden="true" /> : <Menu size={22} strokeWidth={1.75} aria-hidden="true" />}
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary"
        hidden={!isOpen}
        className="border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-4 py-3 md:hidden"
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
