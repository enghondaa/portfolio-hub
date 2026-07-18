import type { ColumnId, CreateTaskInput, Task, UpdateTaskInput } from "@/lib/types";

/** Thrown for any non-2xx response, carrying the server's field errors when it sent them. */
export class ApiError extends Error {
  status: number;
  fields?: Record<string, string[] | undefined>;

  constructor(message: string, status: number, fields?: Record<string, string[] | undefined>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (response.status === 204) return undefined as T;

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(
      (payload as { error?: string } | null)?.error ?? `Request failed with ${response.status}`,
      response.status,
      (payload as { fields?: Record<string, string[] | undefined> } | null)?.fields
    );
  }
  return payload as T;
}

export const api = {
  listTasks: () => request<{ tasks: Task[] }>("/api/tasks").then((r) => r.tasks),

  createTask: (input: CreateTaskInput) =>
    request<{ task: Task }>("/api/tasks", { method: "POST", body: JSON.stringify(input) }).then((r) => r.task),

  updateTask: (id: string, input: UpdateTaskInput) =>
    request<{ task: Task }>(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(input) }).then((r) => r.task),

  deleteTask: (id: string) => request<void>(`/api/tasks/${id}`, { method: "DELETE" }),

  reorder: (column: ColumnId, orderedIds: string[]) =>
    request<{ tasks: Task[] }>("/api/tasks/reorder", {
      method: "POST",
      body: JSON.stringify({ column, orderedIds }),
    }).then((r) => r.tasks),
};
