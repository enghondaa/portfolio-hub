"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUS_LABELS, type AdminRole, type OrderStatus } from "@portfolio/orders-core";

/**
 * The operator action panel. It only renders buttons for the legal next
 * statuses handed down from the shared transitions function, and the cancel
 * button only for an owner — but the server enforces both regardless, so a
 * staff user who forges a cancel request gets a 403, not a cancellation.
 */
export function OrderActions({
  orderId,
  advanceOptions,
  canCancel,
  isTerminal,
  role,
}: {
  orderId: string;
  advanceOptions: OrderStatus[];
  canCancel: boolean;
  isTerminal: boolean;
  role: AdminRole;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  async function advance(status: OrderStatus) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });
      if (res.ok) {
        setNote("");
        router.refresh();
        return;
      }
      const payload = await res.json().catch(() => null);
      setError(payload?.error ?? "Could not update the order.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: note || undefined }),
      });
      if (res.ok) {
        setNote("");
        setConfirmingCancel(false);
        router.refresh();
        return;
      }
      const payload = await res.json().catch(() => null);
      setError(payload?.error ?? "Could not cancel the order.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  if (isTerminal) {
    return (
      <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-5">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-neutral-400)]">Actions</h2>
        <p className="mt-2 text-sm text-[var(--color-neutral-600)]">This order is finished. There&apos;s nothing left to do.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-5">
      <h2 className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-neutral-400)]">Actions</h2>

      <label className="mt-3 block">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-neutral-600)]">Note (optional)</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Added to the timeline"
          className="mt-1.5 w-full resize-none rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
        />
      </label>

      <div className="mt-3 space-y-2">
        {advanceOptions.map((status) => (
          <button
            key={status}
            type="button"
            disabled={busy}
            onClick={() => advance(status)}
            className="w-full rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-light)] disabled:opacity-50"
          >
            Mark {ORDER_STATUS_LABELS[status].toLowerCase()}
          </button>
        ))}
      </div>

      {canCancel && (
        <div className="mt-3 border-t border-[var(--color-neutral-200)] pt-3">
          {confirmingCancel ? (
            <div className="space-y-2">
              <p className="text-xs text-[var(--color-neutral-600)]">Cancel this order? Nothing was charged, so no refund is needed.</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={cancel}
                  className="flex-1 rounded-xl bg-[var(--color-danger)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  Confirm cancel
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingCancel(false)}
                  className="rounded-xl border border-[var(--color-neutral-200)] px-4 py-2 text-sm text-[var(--color-neutral-600)]"
                >
                  Keep
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingCancel(true)}
              className="w-full rounded-xl border border-[var(--color-danger)]/40 px-4 py-2.5 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/10"
            >
              Cancel order
            </button>
          )}
        </div>
      )}

      {role === "staff" && (
        <p className="mt-3 font-mono text-[10px] text-[var(--color-neutral-400)]">
          Signed in as staff — cancelling is restricted to owners.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 font-mono text-[11px] text-[var(--color-danger)]">
          {error}
        </p>
      )}
    </section>
  );
}
