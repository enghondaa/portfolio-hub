import { computeTotals } from "../pricing";
import { SEED_NOW_MS, hashString, mulberry32, seedAll, seedCustomers, seedOrders, seedProducts } from "../seed";
import { canTransition } from "../transitions";
import type { OrderStatus } from "../types";

describe("PRNG", () => {
  it("produces the same sequence for the same seed", () => {
    const a = mulberry32(hashString("x"));
    const b = mulberry32(hashString("x"));
    const seqA = Array.from({ length: 20 }, () => a());
    const seqB = Array.from({ length: 20 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it("produces different sequences for different seeds", () => {
    const a = mulberry32(hashString("x"));
    const b = mulberry32(hashString("y"));
    expect(a()).not.toBe(b());
  });

  it("stays within [0, 1)", () => {
    const random = mulberry32(hashString("range"));
    for (let i = 0; i < 500; i++) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe("seed determinism", () => {
  it("produces byte-identical data for the same seed version", () => {
    expect(JSON.stringify(seedAll("v1"))).toEqual(JSON.stringify(seedAll("v1")));
  });

  it("produces different data when the seed version is bumped", () => {
    expect(JSON.stringify(seedAll("v1"))).not.toEqual(JSON.stringify(seedAll("v2")));
  });
});

describe("seeded catalogue", () => {
  const products = seedProducts("v1");

  it("has 12 products", () => {
    expect(products).toHaveLength(12);
  });

  it("gives every product a unique id and slug", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });

  it("prices everything above zero, in whole piastres", () => {
    for (const product of products) {
      expect(product.priceCents).toBeGreaterThan(0);
      expect(Number.isInteger(product.priceCents)).toBe(true);
    }
  });

  it("never generates negative stock", () => {
    for (const product of products) {
      expect(product.stockQty).toBeGreaterThanOrEqual(0);
    }
  });

  it("includes at least one out-of-stock and one low-stock product, so both UI states are reachable", () => {
    expect(products.some((p) => p.stockQty === 0)).toBe(true);
    expect(products.some((p) => p.stockQty > 0 && p.stockQty < 5)).toBe(true);
  });
});

describe("seeded customers", () => {
  const customers = seedCustomers("v1");

  it("has 40 customers", () => {
    expect(customers).toHaveLength(40);
  });

  it("gives every customer a unique email", () => {
    expect(new Set(customers.map((c) => c.email)).size).toBe(customers.length);
  });

  it("only uses the reserved example.invalid domain, so no address can be real", () => {
    for (const customer of customers) {
      expect(customer.email.endsWith("@example.invalid")).toBe(true);
    }
  });
});

describe("seeded orders", () => {
  const { products, customers, orders } = seedAll("v1");

  it("has 180 orders", () => {
    expect(orders).toHaveLength(180);
  });

  it("gives every order a unique, human-readable number", () => {
    expect(new Set(orders.map((o) => o.orderNumber)).size).toBe(orders.length);
    for (const order of orders) {
      expect(order.orderNumber).toMatch(/^KH-2026-\d{4}$/);
    }
  });

  it("references only real customers and products", () => {
    const customerIds = new Set(customers.map((c) => c.id));
    const productIds = new Set(products.map((p) => p.id));
    for (const order of orders) {
      expect(customerIds.has(order.customerId)).toBe(true);
      for (const item of order.items) {
        expect(productIds.has(item.productId)).toBe(true);
      }
    }
  });

  it("stores totals that match the pricing rules exactly", () => {
    for (const order of orders) {
      const expected = computeTotals(order.items);
      expect(order.subtotalCents).toBe(expected.subtotalCents);
      expect(order.shippingCents).toBe(expected.shippingCents);
      expect(order.totalCents).toBe(expected.totalCents);
    }
  });

  it("never writes an order with no items", () => {
    for (const order of orders) {
      expect(order.items.length).toBeGreaterThan(0);
    }
  });

  it("ends every timeline on the order's current status", () => {
    for (const order of orders) {
      const last = order.timeline[order.timeline.length - 1];
      expect(last?.status).toBe(order.status);
    }
  });

  it("builds every timeline from legal transitions only", () => {
    for (const order of orders) {
      for (let i = 0; i < order.timeline.length - 1; i++) {
        const from = order.timeline[i]?.status as OrderStatus;
        const to = order.timeline[i + 1]?.status as OrderStatus;
        expect(canTransition(from, to)).toBe(true);
      }
    }
  });

  it("orders every timeline forwards in time", () => {
    for (const order of orders) {
      for (let i = 0; i < order.timeline.length - 1; i++) {
        const a = new Date(order.timeline[i]?.at ?? 0).getTime();
        const b = new Date(order.timeline[i + 1]?.at ?? 0).getTime();
        expect(b).toBeGreaterThanOrEqual(a);
      }
    }
  });

  it("starts every timeline at placed", () => {
    for (const order of orders) {
      expect(order.timeline[0]?.status).toBe("placed");
    }
  });

  it("returns orders newest first", () => {
    for (let i = 0; i < orders.length - 1; i++) {
      const a = new Date(orders[i]?.placedAt ?? 0).getTime();
      const b = new Date(orders[i + 1]?.placedAt ?? 0).getTime();
      expect(a).toBeGreaterThanOrEqual(b);
    }
  });

  it("leaves a handful of orders mid-flight so the tracking demo has live examples", () => {
    const inFlight = orders.filter(
      (o) => !["delivered", "cancelled"].includes(o.status)
    );
    expect(inFlight.length).toBeGreaterThan(5);
  });

  it("never stamps an event in the future", () => {
    // Timelines used to be built forwards from placedAt, so a recent in-flight
    // order with several steps left could have its later events dated days
    // ahead of the seed clock. Those events then sorted above anything an
    // admin did today, which is how a live order showed "Shipped" underneath
    // "Out for delivery".
    for (const order of orders) {
      for (const event of order.timeline) {
        expect(new Date(event.at).getTime()).toBeLessThanOrEqual(SEED_NOW_MS);
      }
    }
  });

  it("keeps every timeline in chronological order", () => {
    for (const order of orders) {
      const times = order.timeline.map((event) => new Date(event.at).getTime());
      expect(times).toEqual([...times].sort((a, b) => a - b));
    }
  });

  it("starts every timeline exactly at placedAt", () => {
    for (const order of orders) {
      expect(order.timeline[0]?.at).toBe(order.placedAt);
    }
  });

  it("keeps mid-flight orders recent, since a 3-month-old order still shipping would be nonsense", () => {
    const now = SEED_NOW_MS;
    for (const order of orders) {
      if (["delivered", "cancelled"].includes(order.status)) continue;
      const ageDays = (now - new Date(order.placedAt).getTime()) / 86_400_000;
      expect(ageDays).toBeLessThan(10);
    }
  });

  it("covers every status across the seeded history", () => {
    const seen = new Set(orders.map((o) => o.status));
    for (const status of ["placed", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"]) {
      expect(seen.has(status as OrderStatus)).toBe(true);
    }
  });
});

describe("seedOrders sizing", () => {
  it("honours an explicit count", () => {
    const products = seedProducts("v1");
    const customers = seedCustomers("v1");
    expect(seedOrders("v1", products, customers, 12)).toHaveLength(12);
  });
});
