# Portfolio Hub — Project Report

**Purpose of this document:** a complete, factual reference for the `portfolio-hub` monorepo, written to be handed to an AI assistant as context. It describes what exists, how it is wired, why each decision was made, what is verified, and what is still outstanding. Everything here was read from the repository, not recalled.

- **Repository:** https://github.com/enghondaa/portfolio-hub (public)
- **Owner:** Mohand Elshahawy — Full-Stack Developer
- **Local clone:** `F:\Mohand-Dev`
- **Branch:** `main` (single branch, no PR flow)
- **Head commit at time of writing:** `deb607d` — "Redesign all three demos: premium dark, bold type, real motion"
- **Total commits:** 57

---

## 1. What this project is

A Turborepo monorepo containing one portfolio site plus four supporting deliverables, all deployed independently to Vercel from the same repository. The portfolio ("hub") presents real production work alongside demo applications that each prove a specific technical claim.

The governing principle throughout is **verifiable honesty**: no invented metrics, no fake data presented as real, no claimed capability without a live URL and source link backing it. Where a demo uses synthetic data, the UI says so in a persistent banner. Where a real metric is cited, it comes from actual paid work.

### Deployed URLs

| Site | URL | Vercel project | Root directory |
|---|---|---|---|
| Hub (portfolio) | https://mohand-hub.vercel.app | `mohand-hub` | `apps/hub` |
| Task Board | https://mohand-taskboard-demo.vercel.app | `mohand-taskboard-demo` | `apps/taskboard` |
| Analytics Dashboard | https://mohand-analytics-demo.vercel.app | `mohand-analytics-demo` | `apps/analytics` |
| CMS Demo | https://mohand-cms-demo.vercel.app | `mohand-cms-demo` | `apps/cms-demo` |
| Storybook | https://mohand-storybook.vercel.app | `mohand-storybook` | `packages/ui` |

Vercel team ID: `team_17hKaquP23nJm97Q14TNcEE7` (account `enghondaas-projects`).

Each Vercel project points at a different `Root Directory` inside the same GitHub repo and auto-deploys on push to `main`. Each app's production URL is **hardcoded** in its own `layout.tsx` as `siteUrl` and used for `metadataBase`, so the Vercel project name must match the URL or metadata breaks.

---

## 2. Repository structure

```
portfolio-hub/
├── .github/workflows/ci.yml     GitHub Actions: lint → typecheck → test → build
├── .npmrc                       engine-strict, auto-install-peers, fetch retries
├── package.json                 root scripts, all delegate to turbo
├── pnpm-workspace.yaml          packages: apps/*, packages/*
├── turbo.json                   task graph + cache outputs
├── README.md
│
├── apps/
│   ├── hub/                     the portfolio site
│   ├── taskboard/               Kanban demo (REST API + drag and drop)
│   ├── analytics/               data-visualisation demo (D3 + Chart.js)
│   └── cms-demo/                MDX content site
│
└── packages/
    ├── config/                  shared tsconfig / eslint / jest / Tailwind tokens
    └── ui/                      shared component library + Storybook
```

### Code volume (source files only, excludes `node_modules`, `.next`, `dist`)

| Area | Files | Lines |
|---|---|---|
| `packages/ui` | 53 | 2,054 |
| `apps/hub` | 30 | 1,848 |
| `apps/analytics` | 27 | 1,705 |
| `apps/taskboard` | 21 | 1,564 |
| `apps/cms-demo` | 16 | 959 |
| `packages/config` | 1 | 61 |

---

## 3. Toolchain and conventions

### Core stack

- **Monorepo:** Turborepo 2.x + pnpm 9.15.9 workspaces
- **Node:** `>=20` (enforced via `engines` + `engine-strict=true`)
- **Framework:** Next.js 16.2.10, App Router, Turbopack
- **React:** 19.2.4
- **Language:** TypeScript 5.x, `strict: true` **and `noUncheckedIndexedAccess: true`**
- **Styling:** Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.js`)
- **Testing:** Jest 29 + React Testing Library
- **Component docs:** Storybook 8 (Vite builder)

### TypeScript configuration

`packages/config/tsconfig/base.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "target": "ES2022"
  }
}
```

`noUncheckedIndexedAccess` is the single most consequential setting here. Every array index and record lookup is typed as possibly-`undefined`. Any AI editing this codebase must handle that — `arr[0]` is `T | undefined`, and the established fix pattern in this repo is `arr[0] ?? fallback` or an explicit non-null assertion where genuinely safe.

`packages/config/tsconfig/nextjs.json` extends base and adds DOM libs, `jsx: react-jsx`, `moduleResolution: bundler`, `incremental`, and the Next plugin.

### Turbo task graph (`turbo.json`)

```json
{
  "tasks": {
    "build":     { "dependsOn": ["^build"], "outputs": [".next/**", "!.next/cache/**", "dist/**"] },
    "lint":      { "dependsOn": ["^build"] },
    "typecheck": { "dependsOn": ["^build"] },
    "test":      { "dependsOn": ["^build"] },
    "dev":       { "cache": false, "persistent": true },
    "clean":     { "cache": false }
  }
}
```

`^build` means dependencies build first. This matters: **`packages/ui` must be built (`tsup` → `dist/`) before any app can typecheck or build**, because apps import `@portfolio/ui` via its `dist` entry points. Running `pnpm --filter @portfolio/hub build` directly without a prior `packages/ui` build fails with a module-not-found on `@portfolio/ui`.

### Design token system

This is the architectural centrepiece and must be understood before changing any styling.

`packages/config/tailwind/theme.css` defines a **shared set of CSS custom properties** inside a Tailwind v4 `@theme` block: `--color-neutral-0` through `--color-neutral-950`, `--color-accent`, `--color-accent-light`, `--color-accent-soft`, `--color-success`, a 1.25-ratio type scale, and font-family variables.

Every component — including everything in `packages/ui` — references these **by variable name**, never by literal colour:

```tsx
className="bg-[var(--color-neutral-50)] text-[var(--color-neutral-800)]"
```

Each app then re-declares those same variables with different values in its own `globals.css`, after importing the shared file:

```css
@import "tailwindcss";
@import "@portfolio/config/tailwind/theme.css";

@theme {
  --color-neutral-0: #06080c;   /* this app's own palette */
  --color-accent: #2dd4a7;
}
```

**Consequence:** the same shared component renders in a completely different visual identity per app, with zero per-app component code. This is why five sites look distinct while sharing one component library.

### The `@source` directive (critical gotcha)

`theme.css` contains:

```css
@source "../../ui/src/**/*.{ts,tsx}";
```

Tailwind v4's automatic content detection **does not scan inside `node_modules`**, and workspace packages are symlinked there. Without this line, any utility class used *only* inside `packages/ui` and never duplicated in an app's own source never gets generated. This caused a real bug (commit `d0c5bc7`): the shared Navbar's `hidden md:flex gap-6` classes were silently absent from compiled CSS.

### ESLint

`packages/config/eslint/base.mjs` provides a flat config for non-Next packages. Next apps use `eslint-config-next` 16.2.10.

Two rules from the newer `eslint-plugin-react-hooks` bite frequently:

- **`react-hooks/set-state-in-effect`** — flags any `setState()` called synchronously in a `useEffect` body outside an async callback. Two established fixes are used in this repo:
  1. Compute a flag at render time and never enter the state-setting branch (see `apps/hub/src/components/AnimatedNumber.tsx`, which uses a `skipAnimation` boolean instead of setting state on the reduced-motion path).
  2. The "adjust state during render" pattern — compare against a stored previous value directly in the component body, not in an effect (see `apps/hub/src/components/FloatingNavbar.tsx`, which closes the mobile menu on route change this way).
- **`@next/next/no-html-link-for-pages`** — raw `<a href="/...">` for internal routes is an error; use `next/link`.

---

## 4. `packages/ui` — the shared component library

Eleven components, each in its own folder with four files (`Component.tsx`, `Component.test.tsx`, `Component.stories.tsx`, `index.ts`):

Badge, Button, Card, Footer, Input, Modal, Navbar, Select, Table, Tabs, ThemeToggle.

- **Build:** `tsup` → dual CJS (`dist/index.js`) + ESM (`dist/index.mjs`) + `.d.ts`
- **Tests:** 35 tests across 11 suites, Jest + React Testing Library
- **Docs:** Storybook 8 with a light/dark theme toolbar global, deployed at https://mohand-storybook.vercel.app
- **Client boundary:** `src/index.ts` carries a single top-level `"use client"`. Most components need it (state, handlers); Card/Badge/Table/Footer strictly don't, but splitting the bundle per-component wasn't judged worth the build complexity at this size. This is documented in a comment in that file.

### Deliberate architectural decision: the hub does NOT use these components

The hub app builds its own parallel components — `PillButton`, `FloatingNavbar`, `SiteFooter` — rather than using `packages/ui`'s `Button`, `Navbar`, `Footer`.

**Reason:** `packages/ui` is itself a portfolio piece, presented as a stable, tested, documented component library. Bending it to match the hub's bespoke visual identity would compromise that. The two are allowed to diverge on purpose. An AI should not "fix" this by consolidating them.

### Deployment quirk

`packages/ui/vercel.json` builds the Storybook static site:

```json
{
  "buildCommand": "cd ../.. && pnpm --filter @portfolio/ui build-storybook",
  "outputDirectory": "storybook-static",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "framework": null
}
```

`packages/ui/src/styles.css` must import Tailwind itself, not only the tokens:

```css
@import "tailwindcss";
@import "../../config/tailwind/theme.css";
```

The tokens alone only define CSS variables. Omitting the `tailwindcss` import means no utility classes are generated and every Storybook story renders as unstyled markup — a real bug that shipped and was fixed in commit `6555cf9`. It is not caught by a passing build.

---

## 5. `apps/hub` — the portfolio site

**Live:** https://mohand-hub.vercel.app · **Fonts:** Bricolage Grotesque / Hanken Grotesk / DM Mono · **Palette:** warm cream `#f7f1e8`, warm charcoal ink `#2a2017`, amber accent `#e08a2c`

### Routes

| Route | Rendering | Notes |
|---|---|---|
| `/` | Static | Hero, stats, work grid, live demos, capabilities, contact CTA |
| `/projects` | Static | Production work + demo apps |
| `/projects/[slug]` | SSG | 4 case studies via `generateStaticParams` |
| `/about` | Static | |
| `/contact` | Static | Form with mailto fallback |
| `/api/contact` | Dynamic | Route handler |
| `/opengraph-image`, `/icon` | Dynamic | Generated OG image and favicon |
| `/sitemap.xml`, `/robots.txt` | Static | Metadata API |
| `not-found` | Static | Custom 404 |

### Content model — `apps/hub/src/lib/projects.ts`

Two exported arrays and a `getProject(slug)` helper. This single file drives the home page, the projects index, and all case-study pages.

**`realProjects`** — six shipped production sites, in display order:

1. `aigentsrealty.com` — AI Dubai property discovery (AiGentsRealty, part-time)
2. `account.zogilabs.io` — account platform with Web3 wallet, 10,000+ users (Bezoge.com)
3. `mblk.bezogia.com` — blockchain marketplace (Bezoge.com)
4. `bezogia.com` — main crypto platform, +45% speed *(marked `featured`)*
5. `zogilabs.io` — corporate site (Bezoge.com)
6. `petzogi-web-eta.vercel.app` — NFT minting platform *(marked `wide`)*

**`projects`** — four demos, all now `status: "live"` with real `liveUrl` values: `taskboard`, `analytics`, `component-library` (points at the Storybook URL), `cms-demo`.

The `Project` interface carries doc comments enforcing the honesty rule — e.g. `realWorldNote` is described as "*A real, verifiable result from paid work*" and `outcome` as "*pulled only from real resume numbers. Omitted when no real metric applies.*"

### Notable components

- `HeroIntro.tsx` — staggered entrance with scroll parallax between text and stat columns
- `RotatingWord.tsx` — cycles `["Web3.", "EdTech.", "crypto.", "dashboards."]` every 2200ms via `AnimatePresence`
- `AnimatedNumber.tsx` — count-up on scroll into view; see §3 for its reduced-motion pattern
- `ProjectCard.tsx` — numbered card with cursor-tracked 3D tilt, `featured`/`wide` layout variants
- `LiveDemos.tsx` — tabbed iframe previews of the real production sites at 60% scale, with a "Visit live site" overlay as fallback (some sites refuse framing via `X-Frame-Options`/CSP)
- `ScrollProgress.tsx`, `FloatingNavbar.tsx` (magnetic hover links), `SiteFooter.tsx`

### SEO

Per-page `metadata` exports, canonical URLs via `alternates.canonical`, JSON-LD (`Person` + `SoftwareApplication`), generated OG image, sitemap and robots via the Next Metadata API.

---

## 6. The three demo apps

All three share a structure: a `DemoStrip` provenance bar, a `how-this-was-built` page, a persistent honesty banner where data is synthetic, and a dark premium visual identity with motion — but each has a **deliberately different palette, typeface pairing and component language**.

### 6.0 `DemoStrip` — the shared provenance bar

An **identical file** copied into all three apps at `src/components/DemoStrip.tsx`. It renders the stack used, a link to that app's source folder on GitHub, and a link to its case study in the hub.

It references only design tokens (`--color-accent`, `--color-neutral-*`), so the same markup renders in each app's own palette automatically with no per-app styling. Props: `stack: string[]`, `sourcePath: string`, `caseStudySlug: string`. The `caseStudySlug` values must match slugs in `apps/hub/src/lib/projects.ts` (`taskboard`, `analytics`, `cms-demo`).

---

### 6.1 `apps/taskboard` — Kanban board over a real REST API

**Live:** https://mohand-taskboard-demo.vercel.app · **Fonts:** Sora / Inter / IBM Plex Mono · **Palette:** near-black `#06080c`, emerald accent `#2dd4a7`

**What it proves:** backend competence — a genuine HTTP API with validation, correct status codes, and optimistic UI that reconciles with the server, not browser state pretending to be an app.

#### API surface

| Method | Route | Behaviour |
|---|---|---|
| `GET` | `/api/tasks` | List all tasks, ordered by column then position |
| `POST` | `/api/tasks` | Create; `201` on success |
| `PATCH` | `/api/tasks/[id]` | Partial update; `404` if id unknown |
| `DELETE` | `/api/tasks/[id]` | `204` on success, `404` if already gone |
| `POST` | `/api/tasks/reorder` | Persist one column's full order in a single request |

All handlers export `dynamic = "force-dynamic"`.

**Status code contract (verified end-to-end with curl against production):**
- `201` create, `204` delete
- `400` malformed JSON — a distinct case from validation failure
- `404` unknown id
- `422` validation failure, **with field-level messages** so the form can attach the error to the offending field
- `500` unexpected

Example `422` body:
```json
{ "error": "Validation failed", "fields": { "title": ["Title is required"] } }
```

#### Why a dedicated reorder endpoint

Dragging one card changes the `position` of every card below it. One `PATCH` per affected card would mean a burst of requests per gesture. Instead the client sends the whole ordered id list for the target column and the server writes it in one statement.

#### The storage adapter — `src/lib/db.ts`

A `TaskStore` interface with two implementations:

- **Postgres** (`@vercel/postgres`) — used when `process.env.POSTGRES_URL` is set. Creates its schema on first use (memoised via a module-level promise). Reorder is a single statement using `UPDATE ... FROM unnest($1::uuid[]) WITH ORDINALITY`, not a loop. Partial updates use `COALESCE` so one statement handles any subset of fields without string-concatenating SQL.
- **In-memory** (`src/lib/store.ts`) — seeded with 7 tasks, used otherwise.

`export const store: TaskStore = isPersistent ? postgresStore : memoryStore;`

Route handlers are written once against the interface and have no knowledge of which backend is live. **The demo therefore deploys and works with zero database provisioning.** The trade-off — the in-memory board resets on serverless cold start — is stated in the UI by `PersistenceBanner.tsx`, which reads `isPersistent` and shows an amber warning or a green confirmation.

**Current production state:** running on the in-memory store. `POSTGRES_URL` has not been set.

#### Front end

- `@dnd-kit/core` + `@dnd-kit/sortable`, with **both** a `PointerSensor` and a `KeyboardSensor` — cards are movable without a mouse
- Optimistic updates with rollback in `Board.tsx`: capture `previous`, repaint immediately, restore and surface an error on failure
- Drag affordances: a six-dot CSS grip (`background-image: radial-gradient(...)`, no icon payload), a `DragOverlay` that lifts, tilts 2.5° and scales with a coloured glow, spring-physics reordering via framer-motion `layout`, columns that light up and swap their empty-state copy to "Release to drop"

#### Tests — 17, the only app with its own test suite

- `src/lib/__tests__/types.test.ts` — Zod schema behaviour: defaults, trimming, whitespace-only rejection, length limits, enum rejection, empty-update rejection, non-integer position rejection
- `src/lib/__tests__/store.test.ts` — every store branch: seeding, append-to-end on create, `null` on unknown id, move-to-end-of-target-column, reorder rewriting positions, delete returning whether anything was removed. Uses `@jest-environment node`.

This app is the only one with `@types/jest` in `devDependencies` and `"types": ["jest", "node"]` in its `tsconfig.json` — required or `tsc --noEmit` fails on `describe`/`it`/`expect` even though the tests run fine.

---

### 6.2 `apps/analytics` — school analytics dashboard

**Live:** https://mohand-analytics-demo.vercel.app · **Fonts:** Manrope / Work Sans / JetBrains Mono · **Palette:** near-black `#0b0d12`, violet accent `#8b7cf6`, cyan secondary `#22d3ee`

**What it proves:** data visualisation with D3 used directly, plus product thinking — the dashboard answers a question none of its individual charts can.

#### Seeded, deterministic data — `src/lib/data.ts` + `src/lib/seed.ts`

All figures come from a `mulberry32` PRNG seeded by a hash of the active filter state:

```ts
const random = mulberry32(hashString(`attendance:${range}:${gradeBand}`));
```

**Why not `Math.random()`:** components render on the server and hydrate on the client. Random values would differ between the two passes and throw a React hydration mismatch. Seeding also means a given filter state always produces the same chart, so a shared link shows the same thing to everyone.

Exports: `getAttendanceSeries`, `getGradeDistribution` (accepts `period: "current" | "previous"`), `getWellbeingHeatmap`, `getRoster`, `getAtRiskStudents`, `getKPISummary`, `formatWeekLabel`. Filter types: `TimeRange = "4w" | "12w" | "26w"`, `GradeBand = "All" | "K-2" | "3-5" | "6-8" | "9-12"`.

Week labels are real calendar dates anchored to a **fixed** `TERM_START` of 2026-01-05 (a Monday), so they stay deterministic across rebuilds rather than drifting with build date.

#### The at-risk signal — the product insight

The three charts each show one dimension in aggregate, so none can answer the question a head of year actually has: *which students are struggling on more than one front at once?*

`getRoster()` generates a synthetic per-student roster where attendance, grades and wellbeing exist **on the same row**. A student is flagged when all three fall below threshold (attendance < 85, grade score < 70, wellbeing < 55). `AtRiskTable.tsx` renders the intersection as a sortable drill-down.

Students are identified by **anonymised IDs only** (`STU-0001`). Inventing plausible names for a public demo would make the fiction harder to see, not easier.

#### KPI deltas — derived, not invented

`getKPISummary()` computes each delta from the same source the charts use:
- Attendance and wellbeing — compare the two halves of the selected period
- Grades — current vs. a `period: "previous"` seed variant, weighted by `GRADE_POINTS = {A:95, B:85, C:75, D:65, F:50}`
- At-risk count — current roster vs. a previous-period roster variant

`InsightCallout.tsx` narrates the largest-magnitude delta and the at-risk count using plain conditionals over those numbers. It is **rule-based, not a model call**, and the UI labels it "Auto-generated insight".

#### Visualisation choices

- **Grade distribution** and **wellbeing heatmap** — real D3 v7 against the DOM via `useRef` + `useEffect`: `scaleBand`, `scaleLinear`, `scaleSequential`, hand-drawn axes, `.join()` enter/update/exit with transitions. Deliberately **not** a chart-library wrapper. Grade distribution uses a nested `scaleBand` for grouped bars in comparison mode.
- **Attendance** — Chart.js 4 via `react-chartjs-2`, because a smoothed filled time series is exactly what that library is good at. Using both and picking per chart is the honest version of "knows D3 and Chart.js".

#### Code splitting

Each visualisation loads through `next/dynamic(..., { ssr: false })` behind a `*PanelLoader.tsx` wrapper, so neither D3 nor Chart.js sits in the initial payload or can become the LCP element.

**This was verified, not assumed:** by grepping the built `.next/static/chunks/*.js` for library-specific strings, then confirming those chunk filenames are absent from the script tags in the prerendered HTML.

#### Other features

Zustand store (`timeRange`, `gradeBand`, `compareBand`); grade-band comparison mode overlaying a second line / grouped bars; CSV export per panel via a client-side Blob download (`src/lib/csv.ts`, RFC-4180-style quoting); heatmap colour legend; `DemoDataBanner` stating all data is fictional.

---

### 6.3 `apps/cms-demo` — MDX content site

**Live:** https://mohand-cms-demo.vercel.app · **Fonts:** Newsreader / Inter / IBM Plex Mono · **Palette:** warm near-black `#0c0a09`, ivory ink `#f5efe6`, gold accent `#d9a441`

**What it proves:** a zero-code-change content workflow.

#### Content model

Every article is one `.mdx` file in `content/articles/` with YAML frontmatter (`title`, `date`, `tags`, `excerpt`). `src/lib/articles.ts` reads the **whole directory** with `gray-matter` + `reading-time` and sorts by date. **Nothing in that file names any individual article.** Add a file, rebuild, and it appears in the list, the RSS feed and the sitemap.

#### The three published articles are real

Written from actual bugs hit while building this monorepo, not filler:

1. `tailwind-v4-source-directive.mdx` — the `@source` content-detection gap described in §3
2. `params-is-a-promise-next-16.mdx` — Next.js 16 made route `params` a `Promise`; every dynamic route silently 404'd while `tsc --noEmit` passed clean (fixed in commit `2980d6e`)
3. `scroll-reveals-reduced-motion.mdx` — the reduced-motion animation pattern used across every app here

#### Rendering and routes

`MDXRemote` from `next-mdx-remote/rsc` as an async Server Component, with `remark-gfm` and `rehype-pretty-code` (Shiki-backed) — no client hydration round-trip for article bodies.

Routes: `/` (list), `/articles/[slug]` (SSG via `generateStaticParams`, `BlogPosting` JSON-LD), `/how-this-was-built`, `/rss.xml` (Route Handler using the `feed` package), `/sitemap.xml`, `/robots.txt`.

Article pages carry a gold reading-progress bar driven by `useScroll` + `useSpring`.

---

## 7. `apps/api` — removed

This workspace has been deleted. It was a 22-line Express service exposing a single `GET /health` endpoint, left over from the original plan in which the Task Board would be backed by a separate Express + MongoDB service hosted on Render. That plan was superseded: the Task Board now serves its own API from Next.js Route Handlers behind a storage adapter, which demonstrates the same API-design skills without requiring external accounts. A health-check stub with no consumer added nothing to the portfolio and invited the question of why it was there, so it was removed along with its references in the README. The monorepo now has six workspaces.

---

## 8. Verification status

Last full run, at commit `deb607d`:

| Check | Result |
|---|---|
| `pnpm typecheck` | 6/6 packages pass |
| `pnpm lint` | 6/6 packages pass |
| `pnpm test` | 52 tests, 13 suites, all pass |
| `pnpm build` | all packages build |

Test breakdown: `packages/ui` 35 tests / 11 suites; `apps/taskboard` 17 tests / 2 suites. The hub, analytics and cms-demo apps have `jest --passWithNoTests` and currently no tests.

The Task Board API was additionally exercised end-to-end with curl against local and production builds, covering `201`, `204`, `400`, `404`, `422`, a full column reorder, a cross-column move, and a repeat-delete.

---

## 9. Known issues and outstanding work

### Not done

1. **Lighthouse measured; two sites below target.** PageSpeed Insights (mobile) was run against all five deployed sites on 18 July 2026 at commit `deb607d`. Results are in the README. Hub scored 86 and Analytics 87 on Performance, against a target of 90. Storybook scored 65 Performance / 79 Accessibility, but those are governed by Storybook's own bundled application shell (a ~884 KiB docs-renderer chunk) rather than by any code in this repository; reaching the target there would mean replacing Storybook, not fixing this codebase. Task Board (95) and CMS Demo (95) meet all gates.
2. **`POSTGRES_URL` is not configured.** The Task Board runs on the in-memory store; the board resets on cold start. Fix: create a Postgres database from the Storage tab of the `mohand-taskboard-demo` Vercel project and set the env var. The code needs no changes and the banner flips to green automatically.
3. **The redesign at commit `deb607d` has not been visually reviewed on the live sites.** It typechecks, lints, builds and deploys, but no screenshot of the deployed result has been examined.
4. **No tests in hub, analytics or cms-demo.** The seeded data functions in `apps/analytics/src/lib/data.ts` are pure and deterministic — they are the obvious next candidates for unit tests.

### Environment gotchas for anyone continuing this work

- **Google Fonts may be unreachable in restricted build environments.** Every Next app calls `next/font/google` in its root layout. Where the network blocks `fonts.googleapis.com`, local verification requires temporarily replacing the font calls with plain `{ variable: "--font-x" }` objects, building, then restoring. Vercel's build environment has working font access — confirmed by repeated successful deploys.
- **`packages/ui` must be built before apps can typecheck.** See §3.
- **A passing build does not mean the page looks right.** The unstyled-Storybook bug (§4) built cleanly and shipped broken. Visual checks are not optional.

---

## 10. Decision log — why things are the way they are

| Decision | Reasoning |
|---|---|
| Tailwind v4 CSS variables over per-app component forks | One component library, five visual identities, zero duplicated component code |
| Hub does not consume `packages/ui` | Keeps the library a clean, stable portfolio artefact rather than bending it to one app's identity |
| Seeded PRNG instead of `Math.random()` | Avoids hydration mismatch; makes filter states shareable and reproducible |
| D3 used directly, not through a wrapper | The resume claims D3; a wrapper would not demonstrate it |
| Chart.js for the attendance series only | Right tool per chart is more honest than forcing one library everywhere |
| Storage adapter with in-memory fallback | Demo works with zero provisioning; the limitation is disclosed in the UI rather than hidden |
| Dedicated reorder endpoint | One request per gesture instead of N |
| `422` with field-level errors, not a generic `400` | Lets the form attach errors to the right field |
| Anonymised student IDs, not fake names | Keeps the fiction visible |
| Persistent demo-data banners | The honesty rule, applied in the UI and not just in docs |
| Separate Vercel project per app | Independent URLs and deploys from one repo |
| Next.js Route Handlers instead of Express + MongoDB on Render | Same demonstrable skills without requiring external accounts |
| Jest over Vitest | Matches what the resume claims |

---

## 11. Working practices established on this project

- **Commit messages are prose, not bullet-point changelogs.** They explain the problem, the fix, and the trade-off. See `6555cf9` and `c4e6b63` for the established tone.
- **Verify before claiming.** Code-splitting was confirmed by inspecting built chunks; the API by curling every status path; the Storybook fix by grepping the built CSS. "The build passed" is not treated as verification.
- **State limitations in the product, not just the docs.** Every synthetic dataset and every non-durable store says so on screen.
- **No invented numbers, ever.** If a metric isn't measured, it doesn't appear. This is why there are no Lighthouse scores anywhere in the UI.

---

*Report generated from the repository at commit `deb607d`. Every fact was read from source files, configuration, git history, or verified tool output.*
