"use client";

import { motion, useReducedMotion } from "framer-motion";
import { formatEGP } from "@portfolio/orders-core";

export interface TrackResult {
  orderNumber: string;
  status: string;
  statusLabel: string;
  whatNext: string;
  placedAt: string;
  estimatedDelivery: string | null;
  totalCents: number;
  itemCount: number;
  timeline: { status: string; label: string; note: string; at: string }[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export function TrackTimeline({ result }: { result: TrackResult }) {
  const shouldReduceMotion = useReducedMotion();
  const isCancelled = result.status === "cancelled";
  const isDelivered = result.status === "delivered";

  return (
    <motion.div
      key={result.orderNumber + result.status}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.2 : 0.4 }}
      className="mt-8 rounded-3xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-neutral-400)]">Order</p>
          <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight text-[var(--color-neutral-800)]">
            {result.orderNumber}
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider"
          style={{
            color: isCancelled ? "var(--color-danger)" : isDelivered ? "var(--color-success)" : "var(--color-accent)",
            background: isCancelled
              ? "rgba(178,58,46,0.1)"
              : isDelivered
                ? "rgba(79,122,63,0.12)"
                : "var(--color-accent-soft)",
          }}
        >
          {result.statusLabel}
        </span>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-neutral-700)]">{result.whatNext}</p>

      {result.estimatedDelivery && (
        <p className="mt-3 font-mono text-xs text-[var(--color-neutral-600)]">
          Estimated delivery: {formatDay(result.estimatedDelivery)}
        </p>
      )}

      <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-[var(--color-neutral-200)] pt-5 font-mono text-xs text-[var(--color-neutral-600)]">
        <div>
          <dt className="text-[var(--color-neutral-400)]">Placed</dt>
          <dd className="mt-0.5">{formatDate(result.placedAt)}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-neutral-400)]">Items</dt>
          <dd className="mt-0.5">{result.itemCount}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-neutral-400)]">Total</dt>
          <dd className="mt-0.5">{formatEGP(result.totalCents)}</dd>
        </div>
      </dl>

      <ol className="mt-8 space-y-0">
        {result.timeline.map((event, i) => {
          const isCurrent = i === result.timeline.length - 1;
          const dotColor = isCancelled && isCurrent ? "var(--color-danger)" : "var(--color-accent)";
          return (
            <motion.li
              key={event.status + event.at}
              initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0.15 : 0.4,
                delay: shouldReduceMotion ? 0 : i * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              {/* connector line */}
              {i < result.timeline.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[7px] top-4 h-full w-px bg-[var(--color-neutral-200)]"
                />
              )}

              {/* node */}
              <span className="relative mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
                {isCurrent && !shouldReduceMotion && !isDelivered && !isCancelled && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full"
                    style={{ background: dotColor }}
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <span
                  className="relative h-3 w-3 rounded-full"
                  style={{
                    background: isCurrent ? dotColor : "var(--color-neutral-50)",
                    border: `2px solid ${isCurrent ? dotColor : "var(--color-neutral-400)"}`,
                  }}
                />
              </span>

              <div className="min-w-0 flex-1">
                <p
                  className={`font-medium ${isCurrent ? "text-[var(--color-neutral-800)]" : "text-[var(--color-neutral-600)]"}`}
                >
                  {event.label}
                </p>
                <p className="mt-0.5 text-sm text-[var(--color-neutral-600)]">{event.note}</p>
                <p className="mt-1 font-mono text-[11px] text-[var(--color-neutral-400)]">{formatDate(event.at)}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>

      <p className="mt-6 border-t border-[var(--color-neutral-200)] pt-4 font-mono text-[10px] text-[var(--color-neutral-400)]">
        This view refreshes on its own every 30 seconds while the tab is open. Seeded demo data — no real parcel is moving.
      </p>
    </motion.div>
  );
}
