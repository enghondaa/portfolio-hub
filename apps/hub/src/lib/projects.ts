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
  /** Short one-line metric for the list view, pulled only from real resume numbers. Omitted when no real metric applies. */
  outcome?: string;
  /** Short badge shown on the work-grid card. */
  tag: string;
}

export const REPO_URL = "https://github.com/enghondaa/portfolio-hub";

export const projects: Project[] = [
  {
    slug: "taskboard",
    title: "Task Board",
    tagline: "Drag-and-drop kanban over a real REST API",
    problem:
      "A Kanban board backed by a genuine REST API rather than browser state: five Next.js Route Handlers with Zod validation at every write boundary, drag-and-drop with optimistic updates that roll back when a request fails, and a storage adapter that runs the same handlers against Postgres or an in-memory store.",
    stack: ["Next.js", "TypeScript", "Route Handlers", "Zod", "dnd-kit", "Postgres"],
    status: "live",
    liveUrl: "https://mohand-taskboard-demo.vercel.app",
    repoPath: "apps/taskboard",
    outcome: "422s with field-level errors, not a generic 400",
    tag: "Real REST API",
  },
  {
    slug: "analytics",
    title: "Analytics Dashboard",
    tagline: "School data visualizations with D3.js and Chart.js",
    problem:
      "A school analytics dashboard with attendance trends, grade distributions, and a wellbeing heatmap, all backed by seeded demo data and filterable in real time. Clearly labeled as a demo throughout — no real student data.",
    stack: ["Next.js", "TypeScript", "D3.js", "Chart.js", "Zustand", "Tailwind CSS"],
    status: "live",
    liveUrl: "https://mohand-analytics-demo.vercel.app",
    repoPath: "apps/analytics",
    outcome: "the pattern that cut data processing time 60% at Youhue",
    realWorldNote:
      "The pattern is drawn from the analytics dashboards I currently build at Youhue, where similar D3.js/Chart.js work cut data processing time by 60% for a platform serving 150+ schools.",
    tag: "60% faster",
  },
  {
    slug: "component-library",
    title: "Component Library",
    tagline: "11 accessible components, tested and documented",
    problem:
      "A shared React component library: Button, Card, Input, Select, Modal, Tabs, Table, Badge, Navbar, Footer, and ThemeToggle. Every component has a keyboard-accessible implementation, a Jest + React Testing Library test, and a Storybook story in both light and dark themes. Every app in this monorepo is built on top of it.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Jest", "React Testing Library", "Storybook"],
    status: "live",
    liveUrl: "https://mohand-storybook.vercel.app",
    repoPath: "packages/ui",
    tag: "11 components",
  },
  {
    slug: "cms-demo",
    title: "CMS Demo",
    tagline: "MDX content site with zero-code-change publishing",
    problem:
      "An MDX-powered content site: drop a new .mdx file in and it publishes as a new article on rebuild, no code changes required. Includes tags, search, syntax highlighting, reading time, an RSS feed, and a sitemap.",
    stack: ["Next.js", "TypeScript", "MDX", "Tailwind CSS"],
    status: "live",
    liveUrl: "https://mohand-cms-demo.vercel.app",
    repoPath: "apps/cms-demo",
    outcome: "the same workflow that improved page load speed 45% at Bezoge.com",
    realWorldNote:
      "Builds on the same Next.js + Strapi CMS workflow I used leading a full site redesign at Bezoge.com, which improved page load speed by 45%.",
    tag: "Zero-code publish",
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
  /** Short badge shown on the work-grid card, e.g. "10K+ users". */
  tag: string;
  /** Renders as the dark/high-contrast card in the grid. */
  featured?: boolean;
  /** Renders as a full-width row instead of a grid cell. */
  wide?: boolean;
}

/** Actual production work, built for real employers. Not demos. */
export const realProjects: RealProject[] = [
  {
    name: "aigentsrealty.com",
    url: "https://www.aigentsrealty.com",
    description: "AI-powered Dubai property discovery platform: search projects, compare areas and developers, and review DLD-backed market data through an AI assistant.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    employer: "AiGentsRealty (part-time)",
    tag: "AI · PropTech",
  },
  {
    name: "account.zogilabs.io",
    url: "https://account.zogilabs.io",
    description: "User account management platform with integrated Web3 wallet, serving 10,000+ users.",
    stack: ["React", "TypeScript", "Next.js", "Material-UI", "Web3React"],
    employer: "Bezoge.com",
    tag: "10K+ users",
  },
  {
    name: "mblk.bezogia.com",
    url: "https://mblk.bezogia.com",
    description: "Blockchain marketplace for seamless crypto transactions with real-time pricing.",
    stack: ["React", "Next.js", "TypeScript", "Web3React"],
    employer: "Bezoge.com",
    tag: "Marketplace",
  },
  {
    name: "bezogia.com",
    url: "https://bezogia.com",
    description: "Main cryptocurrency platform, optimized for performance and SEO.",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    employer: "Bezoge.com",
    tag: "+45% speed",
    featured: true,
  },
  {
    name: "zogilabs.io",
    url: "https://zogilabs.io",
    description: "Corporate site with a modern responsive design and 45% faster loads.",
    stack: ["React", "Next.js", "TypeScript"],
    employer: "Bezoge.com",
    tag: "Corporate",
  },
  {
    name: "petzogi-web-eta.vercel.app",
    url: "https://petzogi-web-eta.vercel.app",
    description: "NFT minting platform with custom smart-contract integration.",
    stack: ["React", "Next.js", "TypeScript", "Web3React"],
    employer: "Bezoge.com",
    tag: "NFT · Gaming",
    wide: true,
  },
];
