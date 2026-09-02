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
  /**
   * A second way into the same project, for demos that are more than one app.
   * OrderFlow's admin panel is the reason this exists: it is the harder half of
   * the build and it sits behind a login, so with only liveUrl pointing at the
   * storefront a visitor had no route to it at all and would never know it was
   * there. Anything listed here has to be openable by a stranger — no
   * credentials to type, no setup.
   */
  altEntry?: { label: string; url: string; note: string };
  /** Source folder in the monorepo — always real, always available. */
  repoPath: string;
  /** A real, verifiable result from paid work this demo's pattern is based on (optional). */
  realWorldNote?: string;
  /** Short one-line metric for the list view, pulled only from real resume numbers. Omitted when no real metric applies. */
  outcome?: string;
  /** Short badge shown on the work-grid card. */
  tag: string;
  /** Marks the single headline demo, rendered larger and first. */
  flagship?: boolean;
}

export const REPO_URL = "https://github.com/enghondaa/portfolio-hub";

export const projects: Project[] = [
  {
    slug: "orderflow",
    title: "OrderFlow",
    tagline: "A two-app order platform: storefront + admin, one shared database",
    problem:
      "A small order-management product, not a page. A customer storefront (browse a coffee catalogue, check out with a simulated payment, track the order) and a separate auth-gated admin dashboard, both sitting on one shared data-layer package and one Postgres database, so advancing an order in admin updates the customer's tracking page. The status-transition rules live in one tested function that the UI and the API both consume.",
    stack: ["Next.js", "TypeScript", "orders-core", "Zod", "Postgres", "Zustand"],
    status: "live",
    liveUrl: "https://mohand-orders-demo.vercel.app",
    altEntry: {
      label: "Open the admin panel",
      url: "https://mohand-orders-admin.vercel.app/login",
      note: "Sign in as Owner or Staff with one click — the two roles see different actions.",
    },
    repoPath: "apps/orders",
    outcome: "the most-tested package in the monorepo drives it",
    tag: "Flagship · full product",
    flagship: true,
  },
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
  /**
   * The site is no longer reachable. It keeps its entry, because the work
   * happened and the experience is real, but it renders without a link and is
   * excluded from the live-preview strip. A visitor clicking through to a dead
   * page learns less than one who was never invited to click.
   */
  retired?: boolean;
  /**
   * Path under /public to a screenshot of the working product, e.g.
   * "/shots/laila.png".
   *
   * Preferred over the live iframe wherever it exists. Three of these sites are
   * behind a sign-in, so framing them shows a login box — which is a worse
   * advertisement than no preview at all, whether or not the site permits
   * framing. A screenshot shows the thing the work actually produced.
   */
  screenshot?: string;
}

/** Actual production work, built for real employers. Not demos. */
export const realProjects: RealProject[] = [
  {
    name: "laila.dialexpert.com",
    screenshot: "/shots/laila.png",
    url: "https://laila.dialexpert.com",
    description:
      "Internal operations platform for a debt-relief call centre, replacing a legacy Blazor Server system. 35 screens behind a 29-key permission model, a rules engine that reads credit files against a 3,000-entry creditor list, bank-statement parsing, deal and attendance tracking, and a Discord bot that runs the nightly checks. Access is staff-only, so the link goes to the sign-in page.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Auth.js v5", "Postgres", "TanStack Query", "Radix UI", "Zod"],
    employer: "DialExpert",
    tag: "Production · internal tooling",
    featured: true,
    wide: true,
  },
  {
    name: "app.youhue.com",
    screenshot: "/shots/youhue-app.png",
    url: "https://app.youhue.com",
    description:
      "The educator side of a K-12 wellbeing platform. Teachers run a daily one-minute emotional check-in with a class, then read the result as class-climate trends and per-student history, with alerts when a reflection or a pattern needs attention and a shared log for what was done about it.",
    stack: ["Next.js", "React", "TypeScript"],
    employer: "YouHue",
    tag: "K-12 · EdTech",
  },
  {
    name: "youhue.com",
    screenshot: "/shots/youhue-site.png",
    url: "https://www.youhue.com",
    description:
      "The public marketing site for the same platform: product tour, pricing, research summaries and school case studies. Built in Webflow rather than in code, and feeding sign-ups into the app.",
    stack: ["Webflow"],
    employer: "YouHue",
    tag: "Marketing site",
  },
  {
    name: "aigentsrealty.com",
    screenshot: "/shots/aigentsrealty.png",
    url: "https://www.aigentsrealty.com",
    description: "AI-powered Dubai property discovery platform: search projects, compare areas and developers, and review DLD-backed market data through an AI assistant.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    employer: "AiGentsRealty (part-time)",
    tag: "AI · PropTech",
  },
  {
    name: "account.zogilabs.io",
    retired: true,
    url: "https://account.zogilabs.io",
    description: "User account management platform with integrated Web3 wallet, serving 10,000+ users.",
    stack: ["React", "TypeScript", "Next.js", "Material-UI", "Web3React"],
    employer: "Bezoge.com",
    tag: "10K+ users",
  },
  {
    name: "mblk.bezogia.com",
    retired: true,
    url: "https://mblk.bezogia.com",
    description: "Blockchain marketplace for seamless crypto transactions with real-time pricing.",
    stack: ["React", "Next.js", "TypeScript", "Web3React"],
    employer: "Bezoge.com",
    tag: "Marketplace",
  },
  {
    name: "bezogia.com",
    retired: true,
    url: "https://bezogia.com",
    description: "Main cryptocurrency platform, optimized for performance and SEO.",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    employer: "Bezoge.com",
    tag: "+45% speed",
    featured: true,
  },
  {
    name: "zogilabs.io",
    retired: true,
    url: "https://zogilabs.io",
    description: "Corporate site with a modern responsive design and 45% faster loads.",
    stack: ["React", "Next.js", "TypeScript"],
    employer: "Bezoge.com",
    tag: "Corporate",
  },
  {
    name: "petzogi-web-eta.vercel.app",
    retired: true,
    url: "https://petzogi-web-eta.vercel.app",
    description: "NFT minting platform with custom smart-contract integration.",
    stack: ["React", "Next.js", "TypeScript", "Web3React"],
    employer: "Bezoge.com",
    tag: "NFT · Gaming",
    wide: true,
  },
];
