import type { Metadata } from "next";
import { projects, realProjects } from "@/lib/projects";
import { Reveal } from "@/components/Reveal";
import { ProjectRow } from "@/components/ProjectRow";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Real production work plus live demo apps proving a real front-end stack: a task board, an analytics dashboard, a component library, and a CMS site.",
  alternates: { canonical: "/projects" },
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
          four below are demos built to prove specific claims. Status is
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
            <ProjectRow
              index={i}
              href={project.url}
              title={project.name}
              tagline={project.description}
              stack={project.stack}
              status="live"
              outcome={`built at ${project.employer}`}
              external
            />
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
            <ProjectRow
              index={i}
              href={`/projects/${project.slug}`}
              title={project.title}
              tagline={project.tagline}
              stack={project.stack}
              status={project.status}
              outcome={project.outcome}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
