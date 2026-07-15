import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@portfolio/ui";
import { projects, realProjects } from "@/lib/projects";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Real production work plus live demo apps proving a real front-end stack: a task board, an analytics dashboard, a component library, and a CMS site.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)]">
          Projects
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--color-neutral-800)] sm:text-5xl">
          Real work, and demos built the same way
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-neutral-600)]">
          The first three are shipped, in production, for real employers. The
          four below are demos built to prove specific claims — status is
          labeled honestly on every one, and each links to real source code.
        </p>
      </Reveal>

      <div className="mt-14">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--color-neutral-800)]">
          Production work
        </h2>
        <div className="mt-2 border-b border-[var(--color-neutral-200)]" />
        {realProjects.map((project, i) => (
          <Reveal key={project.url} delay={i * 0.05}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-6 border-b border-[var(--color-neutral-200)] py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              <div className="flex items-baseline gap-5 sm:gap-8">
                <span className="font-mono text-sm text-[var(--color-neutral-400)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--color-neutral-800)] transition-colors group-hover:text-[var(--color-accent)] sm:text-2xl">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-[var(--color-neutral-600)]">{project.description}</p>
                  <p className="mt-1 font-mono text-xs text-[var(--color-neutral-400)]">
                    {project.stack.join(" · ")} — built at {project.employer}
                  </p>
                </div>
              </div>
              <span
                aria-hidden="true"
                className="shrink-0 text-[var(--color-neutral-400)] transition-transform duration-150 group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
              >
                ↗
              </span>
            </a>
          </Reveal>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--color-neutral-800)]">
          Demos
        </h2>
        <div className="mt-2 border-b border-[var(--color-neutral-200)]" />
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
                  <p className="mt-1 font-mono text-xs text-[var(--color-neutral-400)]">
                    {project.stack.join(" · ")}
                  </p>
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
