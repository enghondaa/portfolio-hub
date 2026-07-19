import { randomUUID } from "node:crypto";
import type { ColumnId, CreateTaskInput, Priority, Task, UpdateTaskInput } from "@/lib/types";
import { SEED_TASKS } from "@/lib/seed-data";

/**
 * In-memory store used when no POSTGRES_URL is configured.
 *
 * This is a deliberate trade-off, documented on the /how-this-was-built page
 * rather than hidden: it lets the demo be deployed and used immediately with
 * zero database provisioning, at the cost of resetting whenever the
 * serverless function cold-starts. The Postgres adapter behind the same
 * interface is the real persistence path — see lib/db.ts.
 */


function nowISO(): string {
  return new Date().toISOString();
}

let tasks: Task[] | null = null;

function ensureSeeded(): Task[] {
  if (tasks === null) {
    const timestamp = nowISO();
    tasks = SEED_TASKS.map((task) => ({
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
