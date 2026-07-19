"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEMO_ORDERS } from "@/lib/demo-orders";
import { TrackTimeline, type TrackResult } from "@/components/TrackTimeline";

type Phase = "idle" | "loading" | "found" | "notfound" | "error";

export function TrackClient({ initialOrder, initialEmail }: { initialOrder?: string; initialEmail?: string }) {
  const [orderNumber, setOrderNumber] = useState(initialOrder ?? "");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Keep the last successful lookup so polling can refresh it silently.
  const lastLookup = useRef<{ orderNumber: string; email: string } | null>(null);

  const lookup = useCallback(
    async (num: string, mail: string, { silent = false } = {}) => {
      if (!num.trim() || !mail.trim()) return;
      if (!silent) {
        setPhase("loading");
        setMessage(null);
      }
      try {
        const res = await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderNumber: num, email: mail }),
        });
        const payload = await res.json().catch(() => null);

        if (res.ok && payload?.orderNumber) {
          setResult(payload as TrackResult);
          setPhase("found");
          lastLookup.current = { orderNumber: num, email: mail };
        } else if (res.status === 404) {
          if (!silent) {
            setPhase("notfound");
            setMessage(payload?.error ?? "No matching order.");
          }
        } else if (res.status === 422) {
          if (!silent) {
            setPhase("error");
            setMessage("Please enter a valid order number and email.");
          }
        } else if (!silent) {
          setPhase("error");
          setMessage(payload?.error ?? "Something went wrong.");
        }
      } catch {
        if (!silent) {
          setPhase("error");
          setMessage("Could not reach the server. Try again.");
        }
      }
    },
    []
  );

  // Auto-lookup when arriving from the confirmation page with params. The
  // fetch is deferred to a timeout so the state changes it triggers happen
  // outside the effect's synchronous body rather than during render commit.
  useEffect(() => {
    if (!initialOrder || !initialEmail) return;
    const timer = setTimeout(() => {
      void lookup(initialOrder, initialEmail);
    }, 0);
    return () => clearTimeout(timer);
  }, [initialOrder, initialEmail, lookup]);

  // Poll every 30s while an order is on screen and the tab is visible.
  // Polling, not websockets: a tracking page checked a few times an hour does
  // not justify a persistent connection, and honest polling is simpler to
  // reason about. Documented here rather than reached for by reflex.
  useEffect(() => {
    if (phase !== "found") return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible" && lastLookup.current) {
        void lookup(lastLookup.current.orderNumber, lastLookup.current.email, { silent: true });
      }
    }, 30_000);
    return () => clearInterval(id);
  }, [phase, lookup]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    void lookup(orderNumber, email);
  }

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-neutral-600)]">Order number</span>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="KH-2026-0001"
              className="mt-1.5 w-full rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-4 py-2.5 font-mono text-sm text-[var(--color-neutral-800)] outline-none transition-colors focus:border-[var(--color-accent)]"
            />
          </label>
          <label className="block">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-neutral-600)]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-4 py-2.5 text-sm text-[var(--color-neutral-800)] outline-none transition-colors focus:border-[var(--color-accent)]"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={phase === "loading"}
          className="mt-4 rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-neutral-50)] shadow-[0_10px_24px_-10px_rgba(192,90,43,0.9)] transition-all hover:bg-[var(--color-accent-light)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {phase === "loading" ? "Looking…" : "Track order"}
        </button>
      </form>

      {/* Demo shortcuts */}
      <div className="mt-5 rounded-2xl border border-dashed border-[var(--color-neutral-200)] p-4">
        <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-neutral-400)]">
          Try it instantly — three seeded orders in different states
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEMO_ORDERS.map((demo) => (
            <button
              key={demo.orderNumber}
              type="button"
              onClick={() => {
                setOrderNumber(demo.orderNumber);
                setEmail(demo.email);
                void lookup(demo.orderNumber, demo.email);
              }}
              className="rounded-full border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-3.5 py-1.5 text-left font-mono text-[11px] text-[var(--color-neutral-700)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              {demo.orderNumber} · {demo.state}
            </button>
          ))}
        </div>
      </div>

      {phase === "notfound" && (
        <div role="alert" className="mt-6 rounded-2xl border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 px-5 py-4 text-sm text-[var(--color-neutral-700)]">
          <p className="font-medium text-[var(--color-warning)]">No match</p>
          <p className="mt-1">{message}</p>
        </div>
      )}
      {phase === "error" && (
        <div role="alert" className="mt-6 rounded-2xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-5 py-4 text-sm text-[var(--color-danger)]">
          {message}
        </div>
      )}

      {phase === "found" && result && <TrackTimeline result={result} />}
    </div>
  );
}
