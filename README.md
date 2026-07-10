# Portfolio Hub + Demo Apps

Monorepo for Mohand Elshahawy's portfolio: a hub site plus four live demo apps
that each prove a specific resume claim, so job applications and freelance
proposals can link to working software instead of descriptions.

## Structure

```
/apps
  /hub          -> Next.js (App Router) portfolio: home, case studies, about, contact
  /taskboard    -> Next.js frontend for the MERN task board demo
  /api          -> Express + Mongoose REST API for the MERN task board demo
  /analytics    -> Next.js dashboard, D3.js + Chart.js school data visualizations
  /cms-demo     -> Next.js + MDX content site
/packages
  /ui           -> shared React component library (Tailwind, tested with Jest/RTL,
                    documented in Storybook)
  /config       -> shared ESLint config, TypeScript base configs, and the
                    Tailwind v4 design-token theme every app imports
```

Every app is TypeScript strict mode, styled with Tailwind CSS, and built to
Lighthouse 90+ on performance, accessibility, and SEO. Demo apps use seeded or
mock data only — no invented clients, testimonials, or usage metrics.

## Stack

React, Next.js, TypeScript, Tailwind CSS, Zustand, Node.js, Express,
MongoDB/Mongoose, D3.js, Chart.js, Jest, React Testing Library, GitHub Actions.

## Getting started

Requires Node 20+ and pnpm (via corepack).

```bash
corepack enable
pnpm install

# run everything
pnpm dev

# run a single app
pnpm --filter @portfolio/hub dev
pnpm --filter api dev
```

## Common scripts (run from the repo root, apply to every workspace via Turborepo)

```bash
pnpm build       # production build of every app/package
pnpm lint        # ESLint across the monorepo
pnpm typecheck   # tsc --noEmit across the monorepo
pnpm test        # Jest/Vitest across the monorepo
```

## Deployment

- `hub`, `taskboard`, `analytics`, `cms-demo` deploy to Vercel (free tier).
- `api` deploys to Render (free tier) with MongoDB Atlas (free tier) as the
  database.
- No custom domain yet by design — everything ships to Vercel/Render URLs
  first. A domain gets attached later with zero code changes.

## Status

Building in phases; see `portfolio-hub-implementation-plan.md` for the full
plan, ready-to-paste prompts per phase, and acceptance criteria. Currently:
**Phase 0 — scaffold** complete.
