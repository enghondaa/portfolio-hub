import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@portfolio/ui";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Live demo apps proving a real MERN stack: a task board, an analytics dashboard, a component library, and a CMS site.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-sm uppercase tracking-wide text-[var(--color-accent)]">
        Projects
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--color-neutral-800)] sm:text-4xl">
        Four demos, one stack
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-neutral-600)]">
        Each one is built to prove a specific claim from my resume. Some are
        further along than others — status is labeled honestly on every
        card, and every one links to real source code.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            <Card className="h-full transition-colors hover:border-[var(--color-neutral-400)]">
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <CardTitle>{project.title}</CardTitle>
                <Badge tone={project.status === "live" ? "success" : "neutral"}>
                  {project.status === "live" ? "Live" : "In progress"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription>{project.tagline}</CardDescription>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 4).map((tech) => (
                    <Badge key={tech} tone="neutral" className="font-mono text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
