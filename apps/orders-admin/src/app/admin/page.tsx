import Link from "next/link";
import { formatEGP, isLowStock } from "@portfolio/orders-core";
import { store } from "@/lib/store";
import { computeOverview } from "@/lib/metrics";
import { RevenueChart } from "@/components/RevenueChart";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const [orders, products] = await Promise.all([store.listOrders(), store.listProducts({ includeInactive: true })]);
  const lowStock = products.filter((p) => isLowStock(p));
  // now defaults to Date.now() inside computeOverview (a plain module), keeping
  // this server component free of the purity lint on a direct Date.now() call.
  const o = computeOverview(orders, undefined, lowStock.length);

  const kpis = [
    { label: "Orders today", value: String(o.ordersToday) },
    { label: "Revenue this week", value: formatEGP(o.revenueThisWeekCents) },
    { label: "Avg. order value", value: formatEGP(o.avgOrderValueCents) },
    { label: "Open orders", value: String(o.openOrders), accent: o.openOrders > 0 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-[var(--color-neutral-800)]">
        Overview
      </h1>
      <p className="mt-1 font-mono text-xs text-[var(--color-neutral-600)]">Seeded demo data for Kahwa Supply.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-neutral-400)]">{k.label}</p>
            <p
              className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight"
              style={{ color: k.accent ? "var(--color-accent)" : "var(--color-neutral-800)" }}
            >
              {k.value}
            </p>
          </div>
        ))}
      </div>

      {o.lowStockCount > 0 && (
        <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 px-4 py-3 text-sm text-[var(--color-warning)]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-warning)]" />
          {o.lowStockCount} product{o.lowStockCount === 1 ? "" : "s"} low on stock.
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-6">
        <h2 className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-wider text-[var(--color-neutral-600)]">
          Revenue — last 30 days
        </h2>
        <div className="mt-4">
          <RevenueChart series={o.revenueSeries} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-heading)] text-sm font-semibold uppercase tracking-wider text-[var(--color-neutral-600)]">
            Needs action — oldest first
          </h2>
          <Link href="/admin/orders" className="font-mono text-xs text-[var(--color-accent)] hover:underline">
            All orders →
          </Link>
        </div>
        {o.needsAction.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-neutral-600)]">Nothing waiting. Every open order has been actioned.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--color-neutral-200)]">
            {o.needsAction.slice(0, 8).map((order) => (
              <li key={order.id}>
                <Link href={`/admin/orders/${order.id}`} className="flex items-center justify-between gap-3 py-3 transition-colors hover:text-[var(--color-accent)]">
                  <span className="font-mono text-sm text-[var(--color-neutral-800)]">{order.orderNumber}</span>
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[var(--color-neutral-600)]">{formatEGP(order.totalCents)}</span>
                    <StatusPill status={order.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
