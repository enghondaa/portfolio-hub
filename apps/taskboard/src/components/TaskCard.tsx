"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Priority, Task } from "@/lib/types";

const PRIORITY_STYLES: Record<Priority, { label: string; className: string }> = {
  high: { label: "High", className: "bg-[var(--color-danger)]/10 text-[var(--color-danger)]" },
  medium: { label: "Medium", className: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]" },
  low: { label: "Low", className: "bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)]" },
};

export function TaskCard({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const priority = PRIORITY_STYLES[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-3.5 ${
        isDragging ? "task-dragging opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          className="flex-1 cursor-grab text-left active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <p className="text-sm font-medium leading-snug text-[var(--color-neutral-800)]">{task.title}</p>
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete task: ${task.title}`}
          className="shrink-0 rounded-md px-1.5 py-0.5 font-mono text-xs text-[var(--color-neutral-400)] opacity-0 transition-opacity hover:bg-[var(--color-neutral-100)] hover:text-[var(--color-danger)] focus:opacity-100 group-hover:opacity-100"
        >
          ✕
        </button>
      </div>

      {task.description && (
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-neutral-600)]">{task.description}</p>
      )}

      <div className="mt-3">
        <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${priority.className}`}>
          {priority.label}
        </span>
      </div>
    </div>
  );
}
