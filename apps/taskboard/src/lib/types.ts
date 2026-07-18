import { z } from "zod";

export const COLUMNS = ["todo", "in_progress", "done"] as const;
export type ColumnId = (typeof COLUMNS)[number];

export const COLUMN_LABELS: Record<ColumnId, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnId;
  priority: Priority;
  position: number;
  createdAt: string;
  updatedAt: string;
}

/** Request body for POST /api/tasks. */
export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120, "Title must be 120 characters or fewer"),
  description: z.string().trim().max(500, "Description must be 500 characters or fewer").default(""),
  column: z.enum(COLUMNS).default("todo"),
  priority: z.enum(PRIORITIES).default("medium"),
});

/** Request body for PATCH /api/tasks/[id]. Every field optional, but at least one required. */
export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().max(500).optional(),
    column: z.enum(COLUMNS).optional(),
    priority: z.enum(PRIORITIES).optional(),
    position: z.number().int().min(0).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

/** Request body for POST /api/tasks/reorder — the full ordered id list for one column. */
export const reorderSchema = z.object({
  column: z.enum(COLUMNS),
  orderedIds: z.array(z.string()).min(1),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ReorderInput = z.infer<typeof reorderSchema>;
