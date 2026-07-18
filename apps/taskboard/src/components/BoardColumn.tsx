"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { TaskCard } from "@/components/TaskCard";
import { COLUMN_LABELS, type ColumnId, type Task } from "@/lib/types";

const ACCENT: Record<ColumnId, string> = {
  todo: "var(--color-neutral-400)",
  in_progress: "var(--color-warning)",
  done: "var(--color-accent)",
};

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
      className={`glass flex flex-col rounded-3xl p-4 transition-all duration-250 ${isOver ? "column-armed" : ""}`}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: ACCENT[column] }} />
          <h2 className="font-[family-name:var(--font-heading)] text-[13px] font-semibold uppercase tracking-[0.13em] text-[var(--color-neutral-700)]">
            {COLUMN_LABELS[column]}
          </h2>
        </div>
        <motion.span
          key={tasks.length}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 26 }}
          className="rounded-full bg-[var(--color-neutral-100)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-neutral-600)]"
        >
          {tasks.length}
        </motion.span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="mt-4 flex min-h-28 flex-col gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onDelete={onDelete} />
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <div
              className={`flex flex-1 items-center justify-center rounded-2xl border border-dashed px-3 py-8 text-center font-mono text-[11px] transition-colors duration-250 ${
                isOver
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-[var(--color-neutral-200)] text-[var(--color-neutral-400)]"
              }`}
            >
              {isOver ? "Release to drop" : "Drop a card here"}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
