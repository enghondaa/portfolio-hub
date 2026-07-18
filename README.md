# Portfolio Hub + Demo Apps

Monorepo for Mohand Elshahawy's portfolio: a hub site plus four live deliverables
that each prove a specific resume claim, so job applications and freelance
proposals can link to working software instead of descriptions.

Every claim here is verifiable. Demo apps use seeded or synthetic data only, and
say so in the UI. There are no invented clients, testimonials, or usage metrics.

## Live sites

| Site | URL | Source |
|---|---|---|
| Hub (portfolio) | https://mohand-hub.vercel.app | `apps/hub` |
| Task Board | https://mohand-taskboard-demo.vercel.app | `apps/taskboard` |
| Analytics Dashboard | https://mohand-analytics-demo.vercel.app | `apps/analytics` |
| CMS Demo | https://mohand-cms-demo.vercel.app | `apps/cms-demo` |
| Storybook | https://mohand-storybook.vercel.app | `packages/ui` |

## Lighthouse (PageSpeed Insights, mobile)

Measured 18 July 2026 against the deployed production URLs at commit `deb607d`.
These are real measured numbers, not estimates.

| Site | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Hub | 86 | 96 | 92 | 100 |
| Task Board | 95 | 96 | 100 | 100 |
| Analytics | 87 | 96 | 100 | 100 |
| CMS Demo | 95 | 95 | 96 | 100 |
| Storybook | 65 | 79 | 100 | 90 |

Target gates: Performance >= 90, Accessibility >= 95, SEO >= 95.

**Currently failing:** Hub and Analytics performance (86, 87). Storybook fails
performance and accessibility, but its scores are governed by Storybook's own
bundled application shell rather than any code in this repository — see the note
in `PROJECT-REPORT.md`.

## Structure

```
/apps
  /hub          Next.js App Router portfolio: home, case studies, about, contact
  /taskboard    Kanban board over a real REST API (Route Handlers + Zod + Postgres/in-memory adapter)
  /analytics    Dashboard with D3.js and Chart.js over seeded, deterministic data
  /cms-demo     MDX content site: drop in a .mdx file and it publishes on rebuild
/packages
  /ui           Shared React component library (11 components, Jest/RTL tested, Storybook documented)
  /config       Shared ESLint config, TypeScript base configs, and the Tailwind v4 design tokens
```

## Stack

React 19, Next.js 16 (App Router, Turbopack), TypeScript (strict +
`noUncheckedIndexedAccess`), Tailwind CSS v4, Zustand, Zod, D3.js, Chart.js,
dnd-kit, framer-motion, MDX, Jest, React Testing Library, Storybook, Turborepo,
GitHub Actions.

## How the design system works

One shared set of CSS custom properties lives in
`packages/config/tailwind/theme.css`. Every component references tokens by
variable name only (`var(--color-accent)`), never a literal colour. Each app then
redeclares those variables with its own values in its `globals.css`.

The result is five visually distinct sites sharing one component library, with no
per-app component code. Changing an app's entire identity is a matter of changing
token values.

Note the `@source "../../ui/src/**/*.{ts,tsx}"` directive in that file: Tailwind
v4 does not scan inside `node_modules`, and workspace packages are symlinked
there, so without it any utility class used only inside `packages/ui` is never
generated.

## Getting started

Requires Node 20+ and pnpm (via corepack).

```bash
corepack enable
pnpm install

pnpm dev                          # run everything
pnpm --filter @portfolio/hub dev  # run a single app
```

`packages/ui` must be built before any app can typecheck or build, since apps
import it through its `dist` entry points. `turbo` handles this ordering
automatically via `dependsOn: ["^build"]`.

## Scripts (from the repo root, applied to every workspace via Turborepo)

```bash
pnpm build       # production build of every app/package
pnpm lint        # ESLint across the monorepo
pnpm typecheck   # tsc --noEmit across the monorepo
pnpm test        # Jest across the monorepo
```

## Tests

52 tests across 13 suites: 35 in `packages/ui` (one suite per component) and 17
in `apps/taskboard` (Zod schema behaviour and every storage-adapter branch).

## Deployment

All five sites deploy to Vercel from this single repository. Each Vercel project
points at a different Root Directory and auto-deploys on push to `main`.

Each app hardcodes its own production URL as `siteUrl` in its root layout and
uses it for `metadataBase`, so a Vercel project name must match its URL or the
metadata breaks.

## Further reading

`PROJECT-REPORT.md` is the full architectural reference: every design decision
and its reasoning, the established code patterns, known gotchas, and outstanding
work.
