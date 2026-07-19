import type { Metadata } from "next";
import { projects, realProjects } from "@/lib/projects";
import { Reveal } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";
import { ScrollStage } from "@/components/ScrollStage";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Real production work plus live demo apps proving a real front-end stack: a task board, an analytics dashboard, a component library, and a CMS site.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-14 sm:py-24">
      <Reveal>
        <p className="font-mono text-xs text-[var(--color-accent)]">/ work</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-[clamp(34px,5vw,64px)] font-bold tracking-[-0.025em] text-[var(--color-neutral-800)]">
          Real work, and demos built the same way
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-neutral-700)]">
          The first six are shipped, in production, for real employers. The
          four below are demos built to prove specific claims. Status is
          labeled honestly on every one, and each links to real source code.
        </p>
      </Reveal>

      <div className="mt-14">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-[-0.02em] text-[var(--color-neutral-800)]">
          Production work
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {realProjects.map((project, i) => (
            <Reveal key={project.url} delay={i * 0.06}>
              <ProjectCard
                index={i}
                href={project.url}
                title={project.name.replace(/^https?:\/\//, "")}
                description={project.description}
                stack={project.stack}
                tag={project.tag}
                featured={project.featured}
                wide={project.wide}
                external
              />
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-[-0.02em] text-[var(--color-neutral-800)]">
          Demos
        </h2>
        <div className="mt-6">
          <ScrollStage label="Demo projects">
            {projects.map((project, i) => (
              <div key={project.slug} data-stage-item className="w-[min(78vw,420px)] shrink-0 snap-center">
                <ProjectCard
                  index={i}
                  href={`/projects/${project.slug}`}
                  title={project.title}
                  description={project.tagline}
                  stack={project.stack}
                  tag={project.tag}
                  featured={project.flagship}
                />
              </div>
            ))}
          </ScrollStage>
        </div>
      </div>
    </div>
  );
}
