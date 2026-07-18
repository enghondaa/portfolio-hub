"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { BoardColumn } from "@/components/BoardColumn";
import { NewTaskForm } from "@/components/NewTaskForm";
import { api } from "@/lib/api";
import { COLUMNS, type ColumnId, type Task } from "@/lib/types";

function isColumnId(value: string): value is ColumnId {
  return (COLUMNS as readonly string[]).includes(value);
}

export function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    // Keyboard sensor means the board is operable without a mouse.
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    let cancelled = false;
    api
      .listTasks()
      .then((loaded) => {
        if (!cancelled) setTasks(loaded);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load the board. Try reloading.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const byColumn = useMemo(() => {
    const grouped: Record<ColumnId, Task[]> = { todo: [], in_progress: [], done: [] };
    for (const task of tasks) grouped[task.column]?.push(task);
    for (const column of COLUMNS) grouped[column].sort((a, b) => a.position - b.position);
    return grouped;
  }, [tasks]);

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over) return;

      const activeTaskId = String(active.id);
      const overId = String(over.id);
      const moved = tasks.find((t) => t.id === activeTaskId);
      if (!moved) return;

      // The drop target is either a column (empty area) or another card.
      const targetColumn: ColumnId = isColumnId(overId)
        ? overId
        : (tasks.find((t) => t.id === overId)?.column ?? moved.column);

      const destination = tasks
        .filter((t) => t.column === targetColumn && t.id !== activeTaskId)
        .sort((a, b) => a.position - b.position);

      const overIndex = destination.findIndex((t) => t.id === overId);
      const insertAt = overIndex === -1 ? destination.length : overIndex;
      destination.splice(insertAt, 0, { ...moved, column: targetColumn });

      const orderedIds = destination.map((t) => t.id);
      if (moved.column === targetColumn && orderedIds.indexOf(activeTaskId) === moved.position) return;

      // Optimistic: repaint immediately, keep the old state to roll back to.
      const previous = tasks;
      setTasks((current) =>
        current.map((task) => {
          const index = orderedIds.indexOf(task.id);
          if (index === -1) return task;
          return { ...task, column: targetColumn, position: index };
        })
      );
      setError(null);

      try {
        await api.reorder(targetColumn, orderedIds);
      } catch {
        setTasks(previous);
        setError("That move didn't save. The board has been put back.");
      }
    },
    [tasks]
  );

  const handleCreate = useCallback(async (input: { title: string; description: string; priority: Task["priority"] }) => {
    const created = await api.createTask({ ...input, column: "todo" });
    setTasks((current) => [...current, created]);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const previous = tasks;
      setTasks((current) => current.filter((t) => t.id !== id));
      setError(null);
      try {
        await api.deleteTask(id);
      } catch {
        setTasks(previous);
        setError("Could not delete that card. It has been restored.");
      }
    },
    [tasks]
  );

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((column) => (
          <div key={column} className="h-64 animate-pulse rounded-2xl bg-[var(--color-neutral-100)]" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <NewTaskForm onCreate={handleCreate} />

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)]"
        >
          {error}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {COLUMNS.map((column) => (
            <BoardColumn key={column} column={column} tasks={byColumn[column]} onDelete={handleDelete} />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="task-dragging rounded-xl border border-[var(--color-accent)] bg-[var(--color-neutral-50)] p-3.5">
              <p className="text-sm font-medium text-[var(--color-neutral-800)]">{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
