import Link from "next/link";
import { Badge } from "@portfolio/ui";
import { projects } from "@/lib/projects";
import { Reveal } from "@/components/Reveal";
import { MagneticLink } from "@/components/MagneticLink";
import { HeroIntro } from "@/components/HeroIntro";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <HeroIntro>
        <MagneticLink
          href="/projects"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-5 text-base font-medium text-[var(--color-neutral-0)] transition-colors duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-neutral-0)]"
        >
          View projects <span aria-hidden="true">→</span>
        </MagneticLink>
        <Link
          href="/contact"
          className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-neutral-100)] px-5 text-base font-medium text-[var(--color-neutral-800)] transition-colors duration-150 ease-out hover:bg-[var(--color-neutral-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-neutral-0)]"
        >
          Get in touch
        </Link>
      </HeroIntro>

      <div className="mt-24 flex items-baseline justify-between border-b border-[var(--color-neutral-200)] pb-4">
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--color-neutral-800)]">
          Featured work
        </h2>
        <Link
          href="/projects"
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
        >
          See all
        </Link>
      </div>

      <div>
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.05}>
            <Link
              href={`/projects/${project.slug}`}
              className="group flex items-center justify-between gap-6 border-b border-[var(--color-neutral-200)] py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <div className="flex items-baseline gap-5 sm:gap-8">
                <span className="font-mono text-sm text-[var(--color-neutral-400)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--color-neutral-800)] transition-colors group-hover:text-[var(--color-accent)] sm:text-2xl">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-[var(--color-neutral-600)]">{project.tagline}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Badge tone={project.status === "live" ? "success" : "neutral"} className="hidden sm:inline-flex">
                  {project.status === "live" ? "Live" : "In progress"}
                </Badge>
                <span
                  aria-hidden="true"
                  className="text-[var(--color-neutral-400)] transition-transform duration-150 group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                >
                  →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
