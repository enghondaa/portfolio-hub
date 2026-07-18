import { isPersistent } from "@/lib/db";

/**
 * States plainly which storage backend is live, instead of letting a visitor
 * assume the board is durable when it isn't.
 */
export function PersistenceBanner() {
  if (isPersistent) {
    return (
      <div className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-success)]/30 bg-[rgba(52,211,153,0.09)] px-4 py-3 font-mono text-[11px] tracking-wide text-[var(--color-success)]">
        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-success)]" />
        Backed by Postgres. Changes here persist.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-[var(--color-warning)]/30 bg-[rgba(251,191,36,0.09)] px-4 py-3 font-mono text-[11px] tracking-wide text-[var(--color-warning)]">
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-warning)]" />
      Running on the in-memory store, so the board resets on cold start. Set POSTGRES_URL and the same API is SQL-backed.
    </div>
  );
}
