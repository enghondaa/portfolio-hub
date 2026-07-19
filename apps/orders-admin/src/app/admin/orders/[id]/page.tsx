import Link from "next/link";
import { notFound } from "next/navigation";
import { formatEGP, nextStatuses, ORDER_STATUS_LABELS } from "@portfolio/orders-core";
import { store } from "@/lib/store";
import { getSession } from "@/lib/session";
import { StatusPill } from "@/components/StatusPill";
import { OrderActions } from "@/components/OrderActions";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, session] = await Promise.all([store.getOrder(id), getSession()]);
  if (!order) notFound();

  const [customer, products] = await Promise.all([store.getCustomer(order.customerId), store.listProducts({ includeInactive: true })]);
  const productById = new Map(products.map((p) => [p.id, p]));

  // The legal next steps come from the shared transitions function, minus
  // cancel (which is its own owner-only action). This is the exact list the
  // API will accept, so the UI can never offer a move the server rejects.
  const advanceOptions = nextStatuses(order.status).filter((s) => s !== "cancelled");
  const canCancel = session?.role === "owner" && nextStatuses(order.status).includes("cancelled");

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-10">
      <Link href="/admin/orders" className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-neutral-600)] hover:text-[var(--color-accent)]">
        ← All orders
      </Link>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-[var(--color-neutral-800)]">
            {order.orderNumber}
          </h1>
          <p className="mt-1 font-mono text-xs text-[var(--color-neutral-600)]">
            Placed {new Date(order.placedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
        <StatusPill status={order.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-5">
            <h2 className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-neutral-400)]">Items</h2>
            <ul className="mt-3 divide-y divide-[var(--color-neutral-200)]">
              {order.items.map((item) => {
                const p = productById.get(item.productId);
                return (
                  <li key={item.productId} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="text-[var(--color-neutral-800)]">
                      {p?.name ?? item.productId} <span className="text-[var(--color-neutral-400)]">× {item.qty}</span>
                    </span>
                    <span className="font-mono text-xs text-[var(--color-neutral-600)]">{formatEGP(item.unitPriceCents * item.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t border-[var(--color-neutral-200)] pt-3 font-mono text-xs">
              <div className="flex justify-between text-[var(--color-neutral-600)]"><dt>Subtotal</dt><dd>{formatEGP(order.subtotalCents)}</dd></div>
              <div className="flex justify-between text-[var(--color-neutral-600)]"><dt>Shipping</dt><dd>{order.shippingCents === 0 ? "Free" : formatEGP(order.shippingCents)}</dd></div>
              <div className="flex justify-between text-sm font-medium text-[var(--color-neutral-800)]"><dt>Total</dt><dd>{formatEGP(order.totalCents)}</dd></div>
            </dl>
          </section>

          <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-5">
            <h2 className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-neutral-400)]">Timeline</h2>
            <ol className="mt-3 space-y-3">
              {order.timeline.map((e, i) => (
                <li key={e.id} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: i === order.timeline.length - 1 ? "var(--color-accent)" : "var(--color-neutral-400)" }} />
                  <div>
                    <p className="text-sm font-medium text-[var(--color-neutral-800)]">{ORDER_STATUS_LABELS[e.status]}</p>
                    <p className="text-xs text-[var(--color-neutral-600)]">{e.note}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-[var(--color-neutral-400)]">
                      {e.actor} · {new Date(e.at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-5">
            <h2 className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-neutral-400)]">Customer</h2>
            <p className="mt-2 text-sm font-medium text-[var(--color-neutral-800)]">{customer?.name ?? "—"}</p>
            <p className="font-mono text-[11px] text-[var(--color-neutral-600)]">{customer?.email}</p>
          </section>

          <OrderActions
            orderId={order.id}
            advanceOptions={advanceOptions}
            canCancel={canCancel}
            isTerminal={advanceOptions.length === 0 && !canCancel}
            role={session?.role ?? "staff"}
          />
        </aside>
      </div>
    </div>
  );
}
