import type { ColumnId, Priority } from "@/lib/types";

export interface SeedTask {
  title: string;
  description: string;
  column: ColumnId;
  priority: Priority;
  position: number;
}

/**
 * Starter board, shared by both storage adapters.
 *
 * The in-memory store loads this on boot. The Postgres store loads it once,
 * the first time it finds the tasks table empty — otherwise a fresh database
 * would leave a visitor staring at three empty columns and assuming the demo
 * is broken. After that first seed, Postgres is the source of truth and this
 * is never consulted again.
 */
export const SEED_TASKS: SeedTask[] = [
  {
    title: "Audit reduced-motion coverage",
    description: "Every animated component should respect prefers-reduced-motion, not just the hero.",
    column: "done",
    priority: "medium",
    position: 0,
  },
  {
    title: "Split D3 and Chart.js into async chunks",
    description: "Neither library should be in the initial bundle. Verify by grepping the built chunks.",
    column: "done",
    priority: "high",
    position: 1,
  },
  {
    title: "Add optimistic updates with rollback",
    description: "Drag should feel instant. If the PATCH fails, snap the card back and surface the error.",
    column: "in_progress",
    priority: "high",
    position: 0,
  },
  {
    title: "Write Zod schemas for every route handler",
    description: "Validate at the boundary and return 422 with field-level messages, not a generic 400.",
    column: "in_progress",
    priority: "medium",
    position: 1,
  },
  {
    title: "Swap in-memory store for Postgres",
    description: "The adapter interface is already there. Set POSTGRES_URL and the same API is backed by SQL.",
    column: "todo",
    priority: "high",
    position: 0,
  },
  {
    title: "Add keyboard-accessible drag and drop",
    description: "dnd-kit ships a keyboard sensor. Cards should be movable without a mouse.",
    column: "todo",
    priority: "medium",
    position: 1,
  },
  {
    title: "Rate-limit the write endpoints",
    description: "This is a public demo. POST and PATCH should be throttled per IP.",
    column: "todo",
    priority: "low",
    position: 2,
  },
];
