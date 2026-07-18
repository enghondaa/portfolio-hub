"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import type { Priority, Task } from "@/lib/types";

const PRIORITY: Record<Priority, { label: string; dot: string; text: string }> = {
  high: { label: "High", dot: "bg-[var(--color-danger)]", text: "text-[var(--color-danger)]" },
  medium: { label: "Medium", dot: "bg-[var(--color-warning)]", text: "text-[var(--color-warning)]" },
  low: { label: "Low", dot: "bg-[var(--color-neutral-400)]", text: "text-[var(--color-neutral-400)]" },
};

export function TaskCard({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const priority = PRIORITY[task.priority];

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.25 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.16 } }}
      transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="group/card relative rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-4 transition-[border-color,box-shadow] duration-200 hover:border-[rgba(45,212,167,0.4)] hover:shadow-[0_10px_30px_-14px_rgba(0,0,0,0.8)]"
    >
      {/* Accent rail that fills in on hover, so the card reacts to the cursor. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-4 h-6 w-[3px] origin-top scale-y-0 rounded-r-full bg-[var(--color-accent)] transition-transform duration-250 group-hover/card:scale-y-100"
      />

      <div className="flex items-start gap-2.5">
        <button
          type="button"
          aria-label={`Drag to move: ${task.title}`}
          className="mt-0.5 shrink-0 cursor-grab touch-none rounded-md p-0.5 text-[var(--color-neutral-400)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <span aria-hidden="true" className="grip block" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium leading-snug text-[var(--color-neutral-800)]">{task.title}</p>
          {task.description && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-neutral-600)]">{task.description}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete task: ${task.title}`}
          className="shrink-0 rounded-lg px-1.5 py-0.5 text-sm text-[var(--color-neutral-400)] opacity-0 transition-all duration-200 hover:bg-[rgba(251,113,133,0.12)] hover:text-[var(--color-danger)] focus-visible:opacity-100 group-hover/card:opacity-100"
        >
          ✕
        </button>
      </div>

      <div className="mt-3.5 flex items-center gap-1.5 pl-[21px]">
        <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${priority.dot}`} />
        <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${priority.text}`}>{priority.label}</span>
      </div>
    </motion.div>
  );
}
