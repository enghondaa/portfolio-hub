import type { ColumnId, CreateTaskInput, Task, UpdateTaskInput } from "@/lib/types";
import { memoryStore } from "@/lib/store";
import { SEED_TASKS } from "@/lib/seed-data";

/**
 * Storage adapter.
 *
 * Both backends implement the same interface, so every route handler is
 * written once and works against either. When POSTGRES_URL is present the
 * Postgres implementation is used; otherwise the demo falls back to an
 * in-memory store so it can be deployed and exercised with no database
 * provisioning at all. The fallback is stated plainly in the UI rather than
 * papered over.
 */
export interface TaskStore {
  list(): Promise<Task[]>;
  create(input: CreateTaskInput): Promise<Task>;
  update(id: string, input: UpdateTaskInput): Promise<Task | null>;
  remove(id: string): Promise<boolean>;
  reorder(column: ColumnId, orderedIds: string[]): Promise<Task[]>;
}

export const isPersistent = Boolean(process.env.POSTGRES_URL);

interface TaskRow {
  id: string;
  title: string;
  description: string;
  column_id: ColumnId;
  priority: Task["priority"];
  position: number;
  created_at: Date | string;
  updated_at: Date | string;
}

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    column: row.column_id,
    priority: row.priority,
    position: row.position,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

let schemaReady: Promise<void> | null = null;

async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const { sql } = await import("@vercel/postgres");
      await sql`
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          column_id TEXT NOT NULL,
          priority TEXT NOT NULL DEFAULT 'medium',
          position INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;
      await sql`CREATE INDEX IF NOT EXISTS tasks_column_position_idx ON tasks (column_id, position);`;

      // Seed the starter board exactly once, the first time the table is
      // empty. Without this a freshly provisioned database opens on three
      // empty columns, which reads as broken. A concurrent cold start could
      // in principle seed twice; the COUNT check makes that harmless-ish for
      // a demo, and the nightly reset squares it away. Documented rather than
      // over-engineered with an advisory lock.
      const { rows } = await sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM tasks;`;
      if (Number(rows[0]?.count ?? 0) === 0) {
        for (const task of SEED_TASKS) {
          await sql`
            INSERT INTO tasks (title, description, column_id, priority, position)
            VALUES (${task.title}, ${task.description}, ${task.column}, ${task.priority}, ${task.position});
          `;
        }
      }
    })();
  }
  return schemaReady;
}

const postgresStore: TaskStore = {
  async list() {
    await ensureSchema();
    const { sql } = await import("@vercel/postgres");
    const { rows } = await sql<TaskRow>`SELECT * FROM tasks ORDER BY column_id, position;`;
    return rows.map(rowToTask);
  },

  async create(input) {
    await ensureSchema();
    const { sql } = await import("@vercel/postgres");
    const { rows: countRows } = await sql<{ count: string }>`
      SELECT COUNT(*)::text AS count FROM tasks WHERE column_id = ${input.column};
    `;
    const position = Number(countRows[0]?.count ?? 0);
    const { rows } = await sql<TaskRow>`
      INSERT INTO tasks (title, description, column_id, priority, position)
      VALUES (${input.title}, ${input.description}, ${input.column}, ${input.priority}, ${position})
      RETURNING *;
    `;
    return rowToTask(rows[0] as TaskRow);
  },

  async update(id, input) {
    await ensureSchema();
    const { sql } = await import("@vercel/postgres");
    // COALESCE lets one statement handle any subset of fields without
    // building SQL by string concatenation.
    const { rows } = await sql<TaskRow>`
      UPDATE tasks SET
        title       = COALESCE(${input.title ?? null}, title),
        description = COALESCE(${input.description ?? null}, description),
        column_id   = COALESCE(${input.column ?? null}, column_id),
        priority    = COALESCE(${input.priority ?? null}, priority),
        position    = COALESCE(${input.position ?? null}, position),
        updated_at  = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;
    return rows[0] ? rowToTask(rows[0]) : null;
  },

  async remove(id) {
    await ensureSchema();
    const { sql } = await import("@vercel/postgres");
    const { rowCount } = await sql`DELETE FROM tasks WHERE id = ${id};`;
    return (rowCount ?? 0) > 0;
  },

  async reorder(column, orderedIds) {
    await ensureSchema();
    const { sql } = await import("@vercel/postgres");
    // One statement instead of N: unnest the id array and join on ordinality
    // so each row gets its index in the supplied order.
    await sql`
      UPDATE tasks AS t SET
        position = o.ord - 1,
        column_id = ${column},
        updated_at = NOW()
      FROM unnest(${orderedIds as unknown as string}::uuid[]) WITH ORDINALITY AS o(id, ord)
      WHERE t.id = o.id;
    `;
    const { rows } = await sql<TaskRow>`
      SELECT * FROM tasks WHERE column_id = ${column} ORDER BY position;
    `;
    return rows.map(rowToTask);
  },
};

export const store: TaskStore = isPersistent ? postgresStore : memoryStore;
