"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskCard } from "@/components/TaskCard";
import { COLUMN_LABELS, type ColumnId, type Task } from "@/lib/types";

export function BoardColumn({
  column,
  tasks,
  onDelete,
}: {
  column: ColumnId;
  tasks: Task[];
  onDelete: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl border p-4 transition-colors ${
        isOver
          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
          : "border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)]"
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-[var(--color-neutral-800)]">
          {COLUMN_LABELS[column]}
        </h2>
        <span className="rounded-full bg-[var(--color-neutral-50)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-neutral-600)]">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="mt-3 flex min-h-24 flex-col gap-2.5">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} />
          ))}
          {tasks.length === 0 && (
            <p className="rounded-xl border border-dashed border-[var(--color-neutral-200)] px-3 py-6 text-center font-mono text-xs text-[var(--color-neutral-400)]">
              Drop a card here
            </p>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
