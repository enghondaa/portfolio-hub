import { store } from "@/lib/store";
import { OrdersTable, type OrderRow } from "@/components/OrdersTable";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [orders, customers] = await Promise.all([store.listOrders(), store.listCustomers()]);
  const byId = new Map(customers.map((c) => [c.id, c]));

  const rows: OrderRow[] = orders.map((o) => {
    const customer = byId.get(o.customerId);
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: customer?.name ?? "—",
      customerEmail: customer?.email ?? "",
      totalCents: o.totalCents,
      status: o.status,
      placedAt: o.placedAt,
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight text-[var(--color-neutral-800)]">
        Orders
      </h1>
      <p className="mt-1 font-mono text-xs text-[var(--color-neutral-600)]">{rows.length} orders · seeded demo data</p>
      <div className="mt-6">
        <OrdersTable rows={rows} />
      </div>
    </div>
  );
}
