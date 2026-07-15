import type { Metadata } from "next";
import Link from "next/link";
import { realProjects } from "@/lib/projects";
import { Reveal } from "@/components/Reveal";
import { HeroIntro } from "@/components/HeroIntro";
import { HeroStats } from "@/components/HeroStats";
import { ProjectCard } from "@/components/ProjectCard";
import { AboutTeaser } from "@/components/AboutTeaser";
import { LiveDemos } from "@/components/LiveDemos";
import { CapabilitiesChips } from "@/components/CapabilitiesChips";
import { ContactCTA } from "@/components/ContactCTA";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohand Elshahawy",
  jobTitle: "Full-Stack Developer",
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

      <section className="mx-auto max-w-[1180px] px-5 pb-6 pt-[clamp(120px,17vh,190px)] sm:px-14">
        <HeroIntro />
      </section>

      <section className="mx-auto max-w-[1180px] px-5 pb-16 pt-2 sm:px-14 sm:pb-24">
        <HeroStats />
      </section>

      <AboutTeaser />

      <section id="work" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 pb-16 sm:px-14 sm:pb-24">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-2.5">
            <h2 className="font-[family-name:var(--font-heading)] text-[clamp(30px,4.4vw,56px)] font-bold tracking-[-0.025em] text-[var(--color-neutral-800)]">
              Selected work
            </h2>
            <Link href="/projects" className="font-mono text-xs text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded">
              See all →
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2">
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
      </section>

      <LiveDemos />
      <CapabilitiesChips />

      <section className="mx-auto max-w-[1180px] px-5 py-16 sm:px-14 sm:py-24">
        <ContactCTA />
      </section>
    </>
  );
}
