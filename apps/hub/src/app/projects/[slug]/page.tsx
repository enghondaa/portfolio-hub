import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PillButton } from "@/components/PillButton";
import { projects, getProject, REPO_URL } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} case study`,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.tagline,
    applicationCategory: "WebApplication",
    url: `https://mohand-hub.vercel.app/projects/${project.slug}`,
    ...(project.liveUrl ? { sameAs: [project.liveUrl] } : {}),
    author: {
      "@type": "Person",
      name: "Mohand Elshahawy",
      url: "https://mohand-hub.vercel.app",
    },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/projects"
        className="font-mono text-xs text-[var(--color-neutral-600)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
      >
        ← All projects
      </Link>

      <div className="mt-6 flex flex-wrap items-baseline gap-3">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-[-0.02em] text-[var(--color-neutral-800)] sm:text-4xl">
          {project.title}
        </h1>
        <span
          className={
            project.status === "live"
              ? "font-mono text-xs uppercase tracking-wider text-[var(--color-accent)]"
              : "font-mono text-xs uppercase tracking-wider text-[var(--color-neutral-400)]"
          }
        >
          {project.status === "live" ? "Live" : "In progress"}
        </span>
      </div>
      <p className="mt-3 text-lg text-[var(--color-neutral-600)]">{project.tagline}</p>

      <div className="mt-10 aspect-video w-full rounded-3xl border border-dashed border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] flex items-center justify-center">
        <p className="font-mono text-sm text-[var(--color-neutral-400)]">Screenshot coming soon</p>
      </div>

      <section className="mt-10">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-[-0.02em] text-[var(--color-neutral-800)]">
          What it does
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--color-neutral-600)]">{project.problem}</p>
      </section>

      {project.realWorldNote && (
        <section className="mt-8 rounded-3xl border border-[var(--color-neutral-200)] bg-[var(--color-accent-soft)] p-5">
          <p className="text-sm leading-relaxed text-[var(--color-neutral-800)]">{project.realWorldNote}</p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-[-0.02em] text-[var(--color-neutral-800)]">
          Stack
        </h2>
        <p className="mt-3 font-mono text-xs text-[var(--color-neutral-600)]">
          {project.stack.join(" · ")}
        </p>
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        {project.liveUrl && (
          <PillButton href={project.liveUrl} variant="accent" external>
            View live demo →
          </PillButton>
        )}
        <PillButton href={`${REPO_URL}/tree/main/${project.repoPath}`} variant="outline" external>
          View source ↗
        </PillButton>
      </div>
    </div>
  );
}
