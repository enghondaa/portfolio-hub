"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, formatEGP, type OrderStatus } from "@portfolio/orders-core";
import { StatusPill } from "@/components/StatusPill";

export interface OrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalCents: number;
  status: OrderStatus;
  placedAt: string;
}

type SortKey = "orderNumber" | "customerName" | "totalCents" | "status" | "placedAt";
const PAGE_SIZE = 25;

/** Dense orders table: server-fetched rows, filtered/sorted/paginated on the client — the same pattern as the taskboard, at 180 rows. Keyboard navigable (rows are buttons). */
export function OrdersTable({ rows }: { rows: OrderRow[] }) {
  const router = useRouter();
  // Captured once on mount so the render stays pure — ages don't need to tick.
  const [now] = useState(() => Date.now());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<OrderStatus>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("placedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = rows.filter((r) => {
      if (statusFilter.size > 0 && !statusFilter.has(r.status)) return false;
      if (!q) return true;
      return (
        r.orderNumber.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.customerEmail.toLowerCase().includes(q)
      );
    });
    out = [...out].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "totalCents") cmp = a.totalCents - b.totalCents;
      else cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return out;
  }, [rows, query, statusFilter, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const visible = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

  function toggleStatus(s: OrderStatus) {
    setPage(0);
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  function sortBy(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "placedAt" || key === "totalCents" ? "desc" : "asc");
    }
  }

  function ageDays(iso: string): string {
    const d = Math.floor((now - new Date(iso).getTime()) / 86_400_000);
    return d === 0 ? "today" : `${d}d`;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder="Search number, customer, email"
          className="min-w-56 flex-1 rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-4 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
        />
        <div className="flex flex-wrap gap-1">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleStatus(s)}
              className={
                statusFilter.has(s)
                  ? "rounded-full bg-[var(--color-accent)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white"
                  : "rounded-full border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-neutral-600)] transition-colors hover:border-[var(--color-accent)]"
              }
            >
              {ORDER_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--color-neutral-200)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-neutral-100)]">
            <tr>
              {([
                ["orderNumber", "Order"],
                ["customerName", "Customer"],
                ["totalCents", "Total"],
                ["status", "Status"],
                ["placedAt", "Placed"],
              ] as [SortKey, string][]).map(([key, label]) => (
                <th key={key} className="px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => sortBy(key)}
                    className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-neutral-600)] hover:text-[var(--color-accent)]"
                  >
                    {label}
                    {sortKey === key && <span aria-hidden="true">{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </button>
                </th>
              ))}
              <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-neutral-400)]">Age</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr
                key={r.id}
                onClick={() => router.push(`/admin/orders/${r.id}`)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") router.push(`/admin/orders/${r.id}`);
                }}
                className="cursor-pointer border-t border-[var(--color-neutral-200)] transition-colors hover:bg-[var(--color-neutral-100)] focus:bg-[var(--color-neutral-100)] focus:outline-none"
              >
                <td className="px-4 py-2.5 font-mono text-xs text-[var(--color-neutral-800)]">{r.orderNumber}</td>
                <td className="px-4 py-2.5">
                  <span className="text-[var(--color-neutral-800)]">{r.customerName}</span>
                  <span className="block font-mono text-[10px] text-[var(--color-neutral-400)]">{r.customerEmail}</span>
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-[var(--color-neutral-700)]">{formatEGP(r.totalCents)}</td>
                <td className="px-4 py-2.5"><StatusPill status={r.status} /></td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-[var(--color-neutral-600)]">
                  {new Date(r.placedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-[var(--color-neutral-400)]">{ageDays(r.placedAt)}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center font-mono text-xs text-[var(--color-neutral-400)]">
                  No orders match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-xs text-[var(--color-neutral-600)]">
        <span>
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
            className="rounded-lg border border-[var(--color-neutral-200)] px-3 py-1.5 transition-colors hover:border-[var(--color-accent)] disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            {current + 1} / {pageCount}
          </span>
          <button
            type="button"
            disabled={current >= pageCount - 1}
            onClick={() => setPage(current + 1)}
            className="rounded-lg border border-[var(--color-neutral-200)] px-3 py-1.5 transition-colors hover:border-[var(--color-accent)] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
