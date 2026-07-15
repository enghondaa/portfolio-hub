import { ArrowUpRight } from "lucide-react";

const socialLinks = [
  { href: "https://github.com/enghondaa/portfolio-hub", label: "GitHub" },
  { href: "https://linkedin.com/in/mohand-elshahawy-b07523235", label: "LinkedIn" },
  { href: "mailto:eng.mohand2389@gmail.com", label: "Email" },
];

/** Understated footer matching the warm-modern design: a thin divider, a small social row, and a copyright/location line. No oversized branding — the contact page already carries that weight. */
export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-neutral-200)]">
      <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-14">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-1 font-mono text-xs text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
            >
              {link.label}
              <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" className="transition-transform duration-150 group-hover:scale-110" />
            </a>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-between gap-4 font-mono text-xs text-[var(--color-neutral-600)]">
          <span>© {new Date().getFullYear()} Mohand Elshahawy</span>
          <span>Giza, Egypt · GMT+2</span>
        </div>
      </div>
    </footer>
  );
}
