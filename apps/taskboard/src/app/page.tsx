import { Board } from "@/components/Board";
import { PersistenceBanner } from "@/components/PersistenceBanner";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
      <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)]">/ task board demo</p>
      <h1 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-[var(--color-neutral-800)] sm:text-4xl">
        Kanban task board
      </h1>
      <p className="mt-2 max-w-2xl text-[var(--color-neutral-600)]">
        A working REST API behind a drag-and-drop board. Every move is optimistic and rolls back
        if the request fails, every write is validated with Zod at the route boundary, and the
        storage layer sits behind an adapter so the same handlers run on Postgres or in memory.
      </p>

      <div className="mt-6">
        <PersistenceBanner />
      </div>

      <div className="mt-6">
        <Board />
      </div>
    </div>
  );
}
