import { computeOverview } from "@/lib/metrics";
import type { Order } from "@portfolio/orders-core";

function order(overrides: Partial<Order>): Order {
  return {
    id: "ord_1",
    orderNumber: "KH-2026-0001",
    customerId: "cust_1",
    items: [{ productId: "p1", qty: 1, unitPriceCents: 10_000 }],
    subtotalCents: 10_000,
    shippingCents: 0,
    totalCents: 10_000,
    status: "placed",
    placedAt: new Date().toISOString(),
    timeline: [],
    ...overrides,
  };
}

const NOW = Date.UTC(2026, 6, 18, 12, 0, 0);

describe("computeOverview", () => {
  it("counts only orders placed today", () => {
    const o = computeOverview(
      [
        order({ placedAt: new Date(NOW).toISOString() }),
        order({ id: "ord_2", placedAt: new Date(NOW - 2 * 86_400_000).toISOString() }),
      ],
      NOW
    );
    expect(o.ordersToday).toBe(1);
  });

  it("excludes cancelled orders from revenue", () => {
    const o = computeOverview(
      [
        order({ totalCents: 50_000, placedAt: new Date(NOW).toISOString() }),
        order({ id: "ord_2", status: "cancelled", totalCents: 90_000, placedAt: new Date(NOW).toISOString() }),
      ],
      NOW
    );
    expect(o.revenueThisWeekCents).toBe(50_000);
  });

  it("averages order value over revenue-generating orders only", () => {
    const o = computeOverview(
      [
        order({ totalCents: 40_000 }),
        order({ id: "ord_2", totalCents: 60_000 }),
        order({ id: "ord_3", status: "cancelled", totalCents: 100_000 }),
      ],
      NOW
    );
    expect(o.avgOrderValueCents).toBe(50_000);
  });

  it("treats placed/confirmed/packed as open and orders them oldest first", () => {
    const o = computeOverview(
      [
        order({ id: "new", status: "confirmed", placedAt: new Date(NOW).toISOString() }),
        order({ id: "old", status: "placed", placedAt: new Date(NOW - 5 * 86_400_000).toISOString() }),
        order({ id: "done", status: "delivered" }),
      ],
      NOW
    );
    expect(o.openOrders).toBe(2);
    expect(o.needsAction[0]?.id).toBe("old");
  });

  it("always returns a 30-point revenue series", () => {
    expect(computeOverview([], NOW).revenueSeries).toHaveLength(30);
  });

  it("reports zero average without dividing by zero on an empty store", () => {
    expect(computeOverview([], NOW).avgOrderValueCents).toBe(0);
  });
});
