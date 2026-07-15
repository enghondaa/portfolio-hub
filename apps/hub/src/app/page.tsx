import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@portfolio/ui";
import { projects } from "@/lib/projects";
import { Reveal } from "@/components/Reveal";
import { MagneticLink } from "@/components/MagneticLink";
import { HeroIntro } from "@/components/HeroIntro";
import { ProjectRow } from "@/components/ProjectRow";
import { LiveChartWidget } from "@/components/LiveChartWidget";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohand Elshahawy",
  jobTitle: "Senior Front-End Engineer",
  url: "https://mohand-hub.vercel.app",
  sameAs: [
    "https://github.com/enghondaa",
    "https://linkedin.com/in/mohand-elshahawy-b07523235",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <HeroIntro>
        <MagneticLink>
          <Button href="/projects" arrow>
            View projects
          </Button>
        </MagneticLink>
        <Button href="/contact" variant="secondary" arrow>
          Get in touch
        </Button>
      </HeroIntro>

      <LiveChartWidget />

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
  </>
  );
}
