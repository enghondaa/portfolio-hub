import type { Metadata } from "next";
import { Badge } from "@portfolio/ui";

export const metadata: Metadata = {
  title: "About",
  description: "Mohand Elshahawy — full-stack MERN developer, background and stack.",
};

const skillGroups: { label: string; skills: string[] }[] = [
  { label: "Frontend", skills: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3"] },
  { label: "UI & accessibility", skills: ["Tailwind CSS", "Material-UI", "WCAG"] },
  { label: "State management", skills: ["Redux Toolkit", "Zustand", "Context API"] },
  { label: "Backend", skills: ["Node.js", "Express.js", "MongoDB", "Mongoose", "REST API design", "Strapi CMS"] },
  { label: "Data visualization", skills: ["D3.js", "Chart.js"] },
  { label: "Testing & tooling", skills: ["Jest", "React Testing Library", "Git", "GitHub Actions CI/CD"] },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="font-mono text-sm uppercase tracking-wide text-[var(--color-accent)]">About</p>
      <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-tight text-[var(--color-neutral-800)] sm:text-4xl">
        Mohand Elshahawy
      </h1>

      <div className="mt-6 space-y-5 text-lg leading-relaxed text-[var(--color-neutral-600)]">
        <p>
          I&apos;m a full-stack developer working mainly in the MERN stack:
          MongoDB, Express, React, and Node. I like projects where the
          frontend and backend are both mine to get right, since most of the
          interesting bugs live at that boundary.
        </p>
        <p>
          At Youhue, I built analytics dashboards with D3.js and Chart.js for
          a platform used by 150+ schools, cutting data processing time by
          60%. Leading a redesign at Bezoge.com, the switch to a leaner
          Next.js and Strapi CMS workflow improved page load speed by 45%.
        </p>
        <p>
          This site is the same pattern applied to myself: instead of
          describing what I can build, the projects section links to working
          apps built with the stack below, deployed and running.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--color-neutral-800)]">
          Stack
        </h2>
        <div className="mt-6 space-y-5">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <h3 className="text-sm font-medium text-[var(--color-neutral-800)]">{group.label}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <Badge key={skill} tone="neutral" className="font-mono text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
