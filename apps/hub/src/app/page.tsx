import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@portfolio/ui";
import { projects } from "@/lib/projects";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <section className="max-w-2xl">
        <p className="font-mono text-sm uppercase tracking-wide text-[var(--color-accent)]">
          Full-stack MERN developer
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--color-neutral-800)] sm:text-5xl">
          Mohand Elshahawy
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[var(--color-neutral-600)]">
          I build production React and Node applications: MongoDB-backed APIs,
          data visualizations, and content systems. Every project below is
          live and built with the same stack listed on my resume — nothing
          here is a mockup.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-accent)] px-4 text-base font-medium text-[var(--color-neutral-0)] transition-colors duration-150 ease-out hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-neutral-0)]"
          >
            View projects
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-neutral-100)] px-4 text-base font-medium text-[var(--color-neutral-800)] transition-colors duration-150 ease-out hover:bg-[var(--color-neutral-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-neutral-0)]"
          >
            Get in touch
          </Link>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--color-neutral-800)]">
            Featured work
          </h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
          >
            See all
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-lg">
              <Card className="h-full transition-colors hover:border-[var(--color-neutral-400)]">
                <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                  <CardTitle>{project.title}</CardTitle>
                  <Badge tone={project.status === "live" ? "success" : "neutral"}>
                    {project.status === "live" ? "Live" : "In progress"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription>{project.tagline}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
