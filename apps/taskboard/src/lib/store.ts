import { randomUUID } from "node:crypto";
import type { ColumnId, CreateTaskInput, Priority, Task, UpdateTaskInput } from "@/lib/types";

/**
 * In-memory store used when no POSTGRES_URL is configured.
 *
 * This is a deliberate trade-off, documented on the /how-this-was-built page
 * rather than hidden: it lets the demo be deployed and used immediately with
 * zero database provisioning, at the cost of resetting whenever the
 * serverless function cold-starts. The Postgres adapter behind the same
 * interface is the real persistence path — see lib/db.ts.
 */

const SEED: Omit<Task, "id" | "createdAt" | "updatedAt">[] = [
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

function nowISO(): string {
  return new Date().toISOString();
}

let tasks: Task[] | null = null;

function ensureSeeded(): Task[] {
  if (tasks === null) {
    const timestamp = nowISO();
    tasks = SEED.map((task) => ({
      ...task,
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
    }));
  }
  return tasks;
}

export const memoryStore = {
  async list(): Promise<Task[]> {
    return [...ensureSeeded()].sort((a, b) =>
      a.column === b.column ? a.position - b.position : a.column.localeCompare(b.column)
    );
  },

  async create(input: CreateTaskInput): Promise<Task> {
    const all = ensureSeeded();
    const inColumn = all.filter((t) => t.column === input.column);
    const timestamp = nowISO();
    const task: Task = {
      id: randomUUID(),
      title: input.title,
      description: input.description,
      column: input.column as ColumnId,
      priority: input.priority as Priority,
      position: inColumn.length,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    all.push(task);
    return task;
  },

  async update(id: string, input: UpdateTaskInput): Promise<Task | null> {
    const all = ensureSeeded();
    const task = all.find((t) => t.id === id);
    if (!task) return null;

    // Moving to a different column appends to the end of that column unless
    // an explicit position came with the request.
    if (input.column && input.column !== task.column && input.position === undefined) {
      task.position = all.filter((t) => t.column === input.column).length;
    }

    Object.assign(task, input, { updatedAt: nowISO() });
    return task;
  },

  async remove(id: string): Promise<boolean> {
    const all = ensureSeeded();
    const index = all.findIndex((t) => t.id === id);
    if (index === -1) return false;
    all.splice(index, 1);
    return true;
  },

  async reorder(column: ColumnId, orderedIds: string[]): Promise<Task[]> {
    const all = ensureSeeded();
    const timestamp = nowISO();
    orderedIds.forEach((id, index) => {
      const task = all.find((t) => t.id === id);
      if (task) {
        task.column = column;
        task.position = index;
        task.updatedAt = timestamp;
      }
    });
    return all.filter((t) => t.column === column).sort((a, b) => a.position - b.position);
  },
};
