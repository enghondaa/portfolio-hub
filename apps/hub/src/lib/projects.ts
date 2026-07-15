export type ProjectStatus = "live" | "in-progress";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  /** What the demo actually is and what it proves. Factual, no invented numbers. */
  problem: string;
  stack: string[];
  status: ProjectStatus;
  /** Live demo URL, once deployed. */
  liveUrl?: string;
  /** Source folder in the monorepo — always real, always available. */
  repoPath: string;
  /** A real, verifiable result from paid work this demo's pattern is based on (optional). */
  realWorldNote?: string;
}

export const REPO_URL = "https://github.com/enghondaa/portfolio-hub";

export const projects: Project[] = [
  {
    slug: "taskboard",
    title: "Task Board",
    tagline: "Kanban board with auth and a real REST API",
    problem:
      "A Kanban-style task board: React frontend, an Express REST API with JWT auth and refresh tokens, drag-and-drop cards with optimistic updates, and a guest login that spins up a seeded demo account in one click.",
    stack: ["React", "TypeScript", "Next.js", "Zustand", "Node.js", "Express.js"],
    status: "in-progress",
    repoPath: "apps/taskboard",
  },
  {
    slug: "analytics",
    title: "Analytics Dashboard",
    tagline: "School data visualizations with D3.js and Chart.js",
    problem:
      "A school analytics dashboard with attendance trends, grade distributions, and a wellbeing heatmap, all backed by seeded demo data and filterable in real time. Clearly labeled as a demo throughout — no real student data.",
    stack: ["Next.js", "TypeScript", "D3.js", "Chart.js", "Zustand", "Tailwind CSS"],
    status: "in-progress",
    repoPath: "apps/analytics",
    realWorldNote:
      "The pattern is drawn from the analytics dashboards I currently build at Youhue, where similar D3.js/Chart.js work cut data processing time by 60% for a platform serving 150+ schools.",
  },
  {
    slug: "component-library",
    title: "Component Library",
    tagline: "11 accessible components, tested and documented",
    problem:
      "A shared React component library: Button, Card, Input, Select, Modal, Tabs, Table, Badge, Navbar, Footer, and ThemeToggle. Every component has a keyboard-accessible implementation, a Jest + React Testing Library test, and a Storybook story in both light and dark themes. Every app in this monorepo is built on top of it.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Jest", "React Testing Library", "Storybook"],
    status: "live",
    repoPath: "packages/ui",
  },
  {
    slug: "cms-demo",
    title: "CMS Demo",
    tagline: "MDX content site with zero-code-change publishing",
    problem:
      "An MDX-powered content site: drop a new .mdx file in and it publishes as a new article on rebuild, no code changes required. Includes tags, search, syntax highlighting, reading time, an RSS feed, and a sitemap.",
    stack: ["Next.js", "TypeScript", "MDX", "Tailwind CSS"],
    status: "in-progress",
    repoPath: "apps/cms-demo",
    realWorldNote:
      "Builds on the same Next.js + Strapi CMS workflow I used leading a full site redesign at Bezoge.com, which improved page load speed by 45%.",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export interface RealProject {
  name: string;
  url: string;
  description: string;
  stack: string[];
  employer: string;
}

/** Actual production work, built for real employers. Not demos. */
export const realProjects: RealProject[] = [
  {
    name: "bezogia.com",
    url: "https://bezogia.com",
    description: "Cryptocurrency platform optimized for performance and SEO.",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    employer: "Bezoge.com",
  },
  {
    name: "zogilabs.io",
    url: "https://zogilabs.io",
    description: "Corporate website rebuilt for a 45% improvement in load times.",
    stack: ["React", "Next.js", "TypeScript"],
    employer: "Bezoge.com",
  },
  {
    name: "account.zogilabs.io",
    url: "https://account.zogilabs.io",
    description: "Account management platform with Web3 wallet integration, serving 10,000+ users.",
    stack: ["React", "TypeScript", "Next.js", "Material-UI", "Web3React"],
    employer: "Bezoge.com",
  },
];
