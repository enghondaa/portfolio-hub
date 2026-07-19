import { type Order } from "@portfolio/orders-core";

/** Derives the overview KPIs and the 30-day revenue series from all orders. */
export interface Overview {
  ordersToday: number;
  revenueThisWeekCents: number;
  avgOrderValueCents: number;
  openOrders: number;
  lowStockCount: number;
  revenueSeries: { date: string; cents: number }[];
  needsAction: Order[];
}

const NON_REVENUE: string[] = ["cancelled"];
const OPEN_STATES: string[] = ["placed", "confirmed", "packed"];

export function computeOverview(orders: Order[], now = Date.now(), lowStockCount = 0): Overview {
  const dayMs = 86_400_000;
  const startOfToday = new Date(now);
  startOfToday.setUTCHours(0, 0, 0, 0);
  const weekAgo = now - 7 * dayMs;

  let ordersToday = 0;
  let revenueThisWeekCents = 0;
  let paidCount = 0;
  let paidTotal = 0;

  // 30-day revenue buckets, oldest first.
  const buckets = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * dayMs);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }

  for (const order of orders) {
    const placed = new Date(order.placedAt).getTime();
    const isRevenue = !NON_REVENUE.includes(order.status);

    if (placed >= startOfToday.getTime()) ordersToday += 1;
    if (isRevenue && placed >= weekAgo) revenueThisWeekCents += order.totalCents;
    if (isRevenue) {
      paidCount += 1;
      paidTotal += order.totalCents;
      const key = order.placedAt.slice(0, 10);
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + order.totalCents);
    }
  }

  const needsAction = orders
    .filter((o) => OPEN_STATES.includes(o.status))
    .sort((a, b) => (a.placedAt < b.placedAt ? -1 : 1)); // oldest first

  return {
    ordersToday,
    revenueThisWeekCents,
    avgOrderValueCents: paidCount === 0 ? 0 : Math.round(paidTotal / paidCount),
    openOrders: needsAction.length,
    lowStockCount,
    revenueSeries: Array.from(buckets, ([date, cents]) => ({ date, cents })),
    needsAction,
  };
}
