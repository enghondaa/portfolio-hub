import type { Metadata } from "next";
import { Badge } from "@portfolio/ui";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Mohand Elshahawy — Full-Stack Developer, experience and stack.",
  alternates: { canonical: "/about" },
};

const skillGroups: { label: string; skills: string[] }[] = [
  { label: "Frontend", skills: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3"] },
  { label: "UI/UX", skills: ["Material-UI", "Tailwind CSS", "Bootstrap", "Accessibility (WCAG)"] },
  { label: "State management", skills: ["Redux Toolkit", "Zustand", "Context API"] },
  { label: "Testing & DevOps", skills: ["Jest", "React Testing Library", "CI/CD (GitHub Actions)", "Git"] },
  { label: "Backend", skills: ["Node.js", "Express.js", "Strapi CMS", "REST API design"] },
  { label: "Data visualization", skills: ["D3.js", "Chart.js", "Interactive dashboards"] },
];

const experience = [
  {
    role: "Senior Front-End Developer",
    company: "Youhue",
    location: "Remote — Dubai",
    period: "Sep 2024 – Present",
    bullets: [
      "Reduced data processing time by 60% by building interactive analytics dashboards with D3.js and Chart.js for a platform serving 150+ schools.",
      "Delivered 100% of Q4 2024 milestones on schedule leading cross-functional collaboration with 8+ team members.",
      "Improved code consistency across the team by establishing component architecture standards and leading regular code reviews.",
      "Streamlined releases across 3 concurrent projects by implementing CI/CD pipelines with GitHub Actions.",
    ],
  },
  {
    role: "Full-Stack Mid-Senior Developer",
    company: "Bezoge.com",
    location: "Remote — Dubai",
    period: "Oct 2021 – Sep 2024",
    bullets: [
      "Improved page load speed by 45% leading a full website redesign using React, Next.js, and Strapi CMS.",
      "Reduced UI bounce rate from 68% to 42% by redesigning responsive layouts and optimizing UX flows.",
      "Supported 10,000+ daily active users building and deploying 5+ cryptocurrency trading platforms with 99.8% uptime.",
      "Shipped 12+ major feature releases on schedule mentoring junior developers and standardizing frontend coding practices.",
    ],
  },
  {
    role: "Front-End Developer (Part-Time Contract)",
    company: "SimonTech",
    location: "Remote — Hungary",
    period: "Aug 2021 – Apr 2023",
    bullets: [
      "Supported 5,000+ monthly users building 8+ responsive web interfaces using React and TypeScript.",
      "Improved application performance by 30% through component-level code optimization.",
      "Achieved 95% cross-browser compatibility across Chrome, Firefox, Safari, and Edge.",
    ],
  },
];

const education = [
  { title: "Bachelor's Degree in Computer Science", org: "Future Academy, Cairo, Egypt", period: "2019 – 2024" },
  { title: "Advanced Front-End Web Development using React JS (60 hrs)", org: "Information Technology Institute (ITI)", period: "Aug 2023" },
  { title: "Full-Stack Web Development Diploma", org: "Route IT Training Center", period: "Jul 2023" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Reveal>
        <p className="font-mono text-sm uppercase tracking-widest text-[var(--color-accent)]">About</p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight text-[var(--color-neutral-800)] sm:text-5xl">
          Mohand Elshahawy
        </h1>
        <p className="mt-2 text-[var(--color-neutral-600)]">Full-Stack Developer · Giza, Egypt</p>

        <div className="mt-6 space-y-5 text-lg leading-relaxed text-[var(--color-neutral-600)]">
          <p>
            Five years delivering React-based applications for international
            teams across Web3, crypto, and EdTech. I&apos;ve built
            cryptocurrency platforms that ran for 10,000+ daily users and now
            lead development of educational analytics tools used by 150+
            schools, translating business requirements into responsive,
            accessible interfaces within Scrum/Agile teams.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <section className="mt-16">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--color-neutral-800)]">
            Experience
          </h2>
          <div className="mt-6 space-y-10">
            {experience.map((job) => (
              <div key={job.company + job.period}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-medium text-[var(--color-neutral-800)]">
                    {job.role} · {job.company}
                  </h3>
                  <span className="font-mono text-xs text-[var(--color-neutral-400)]">{job.period}</span>
                </div>
                <p className="text-sm text-[var(--color-neutral-400)]">{job.location}</p>
                <ul className="mt-3 space-y-2">
                  {job.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-[var(--color-neutral-600)]">
                      <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-neutral-400)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.1}>
        <section className="mt-16">
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--color-neutral-800)]">
            Education & certifications
          </h2>
          <ul className="mt-6 space-y-3">
            {education.map((item) => (
              <li key={item.title} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-[var(--color-neutral-800)]">
                  {item.title} <span className="text-[var(--color-neutral-400)]">— {item.org}</span>
                </span>
                <span className="font-mono text-xs text-[var(--color-neutral-400)]">{item.period}</span>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={0.15}>
        <section className="mt-16">
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
      </Reveal>
    </div>
  );
}
