"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import { PRIORITIES, type Priority } from "@/lib/types";

export function NewTaskForm({
  onCreate,
}: {
  onCreate: (input: { title: string; description: string; priority: Priority }) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setFieldError(null);
    try {
      await onCreate({ title, description, priority });
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (error) {
      // Surface the server's own field-level message from the 422 rather
      // than a generic failure string.
      const message =
        error instanceof ApiError
          ? (error.fields?.title?.[0] ?? error.fields?.description?.[0] ?? error.message)
          : "Could not create that task.";
      setFieldError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <label htmlFor="task-title" className="sr-only">
            Task title
          </label>
          <input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            className="w-full rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-3 py-2 text-sm text-[var(--color-neutral-800)] outline-none placeholder:text-[var(--color-neutral-400)] focus:border-[var(--color-accent)]"
          />
          <label htmlFor="task-description" className="sr-only">
            Task description
          </label>
          <input
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional detail"
            className="mt-2 w-full rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-3 py-2 text-sm text-[var(--color-neutral-800)] outline-none placeholder:text-[var(--color-neutral-400)] focus:border-[var(--color-accent)]"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="task-priority" className="sr-only">
            Priority
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="rounded-lg border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-3 py-2 font-mono text-xs text-[var(--color-neutral-700)] outline-none focus:border-[var(--color-accent)]"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={submitting || title.trim().length === 0}
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-accent-light)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Adding…" : "Add task"}
          </button>
        </div>
      </div>

      {fieldError && (
        <p role="alert" className="mt-2 text-xs text-[var(--color-danger)]">
          {fieldError}
        </p>
      )}
    </form>
  );
}
