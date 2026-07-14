import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@portfolio/ui";
import { projects, getProject, REPO_URL } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link
        href="/projects"
        className="text-sm font-medium text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
      >
        ← All projects
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--color-neutral-800)] sm:text-4xl">
          {project.title}
        </h1>
        <Badge tone={project.status === "live" ? "success" : "neutral"}>
          {project.status === "live" ? "Live" : "In progress"}
        </Badge>
      </div>
      <p className="mt-3 text-lg text-[var(--color-neutral-600)]">{project.tagline}</p>

      <div className="mt-10 aspect-video w-full rounded-lg border border-dashed border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] flex items-center justify-center">
        <p className="font-mono text-sm text-[var(--color-neutral-400)]">Screenshot coming soon</p>
      </div>

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--color-neutral-800)]">
          What it does
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--color-neutral-600)]">{project.problem}</p>
      </section>

      {project.realWorldNote && (
        <section className="mt-8 rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-accent-soft)] p-5">
          <p className="text-sm leading-relaxed text-[var(--color-neutral-800)]">{project.realWorldNote}</p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--color-neutral-800)]">
          Stack
        </h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <Badge key={tech} tone="accent" className="font-mono text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-accent)] px-4 text-base font-medium text-[var(--color-neutral-0)] transition-colors duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-neutral-0)]"
          >
            View live demo
          </a>
        )}
        <a
          href={`${REPO_URL}/tree/main/${project.repoPath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-neutral-100)] px-4 text-base font-medium text-[var(--color-neutral-800)] transition-colors duration-150 ease-out hover:bg-[var(--color-neutral-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-neutral-0)]"
        >
          View source
        </a>
      </div>
    </div>
  );
}
