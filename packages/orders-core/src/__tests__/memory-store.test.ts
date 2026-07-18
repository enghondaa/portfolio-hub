import { createMemoryStore } from "../adapters/memory";
import { StockError, type OrdersStore } from "../store";
import { assertTransition, nextStatuses } from "../transitions";

function makeStore(): OrdersStore {
  return createMemoryStore({
    seedVersion: "test-v1",
    admins: [
      { id: "adm_1", name: "Owner", email: "owner@demo", passwordHash: "hash", role: "owner" },
      { id: "adm_2", name: "Staff", email: "staff@demo", passwordHash: "hash", role: "staff" },
    ],
  });
}

describe("catalogue", () => {
  it("hides inactive products from the storefront by default", async () => {
    const store = makeStore();
    const all = await store.listProducts({ includeInactive: true });
    const target = all[0];
    if (!target) throw new Error("seed produced no products");

    await store.updateProduct(target.id, { active: false });

    const visible = await store.listProducts();
    expect(visible.find((p) => p.id === target.id)).toBeUndefined();
    expect((await store.listProducts({ includeInactive: true })).find((p) => p.id === target.id)).toBeDefined();
  });

  it("looks a product up by slug", async () => {
    const store = makeStore();
    const [first] = await store.listProducts();
    if (!first) throw new Error("seed produced no products");
    expect((await store.getProductBySlug(first.slug))?.id).toBe(first.id);
  });

  it("returns null for an unknown slug rather than throwing", async () => {
    expect(await makeStore().getProductBySlug("does-not-exist")).toBeNull();
  });

  it("returns null when updating an unknown product", async () => {
    expect(await makeStore().updateProduct("prod_999999", { stockQty: 1 })).toBeNull();
  });
});

describe("createOrder", () => {
  it("writes an order that starts at placed with a single customer event", async () => {
    const store = makeStore();
    const [product] = await store.listProducts();
    if (!product) throw new Error("no product");

    const order = await store.createOrder({
      customer: { name: "Test Person", email: "test@example.invalid" },
      address: "12 Somewhere Street, Cairo",
      items: [{ productId: product.id, qty: 1 }],
    });

    expect(order.status).toBe("placed");
    expect(order.timeline).toHaveLength(1);
    expect(order.timeline[0]?.actor).toBe("customer");
    expect(order.orderNumber).toMatch(/^KH-2026-\d{4}$/);
  });

  it("prices lines from the catalogue, not from anything the client sent", async () => {
    const store = makeStore();
    const [product] = await store.listProducts();
    if (!product) throw new Error("no product");

    const order = await store.createOrder({
      customer: { name: "Test", email: "t@example.invalid" },
      address: "12 Somewhere Street, Cairo",
      items: [{ productId: product.id, qty: 2 }],
    });

    expect(order.items[0]?.unitPriceCents).toBe(product.priceCents);
    expect(order.subtotalCents).toBe(product.priceCents * 2);
  });

  it("decrements stock so two checkouts cannot claim the same last bag", async () => {
    const store = makeStore();
    const [product] = await store.listProducts();
    if (!product) throw new Error("no product");
    const before = product.stockQty;

    await store.createOrder({
      customer: { name: "Test", email: "t@example.invalid" },
      address: "12 Somewhere Street, Cairo",
      items: [{ productId: product.id, qty: 3 }],
    });

    const after = (await store.getProductBySlug(product.slug))?.stockQty;
    expect(after).toBe(before - 3);
  });

  it("rejects a basket that exceeds stock, with per-product detail", async () => {
    const store = makeStore();
    const [product] = await store.listProducts();
    if (!product) throw new Error("no product");

    await expect(
      store.createOrder({
        customer: { name: "Test", email: "t@example.invalid" },
        address: "12 Somewhere Street, Cairo",
        items: [{ productId: product.id, qty: product.stockQty + 1 }],
      })
    ).rejects.toBeInstanceOf(StockError);
  });

  it("rejects an out-of-stock product", async () => {
    const store = makeStore();
    const all = await store.listProducts({ includeInactive: true });
    const soldOut = all.find((p) => p.stockQty === 0);
    if (!soldOut) throw new Error("seed should include a sold-out product");

    await expect(
      store.createOrder({
        customer: { name: "Test", email: "t@example.invalid" },
        address: "12 Somewhere Street, Cairo",
        items: [{ productId: soldOut.id, qty: 1 }],
      })
    ).rejects.toBeInstanceOf(StockError);
  });

  it("leaves stock untouched when the order is rejected", async () => {
    const store = makeStore();
    const [product] = await store.listProducts();
    if (!product) throw new Error("no product");
    const before = product.stockQty;

    await expect(
      store.createOrder({
        customer: { name: "Test", email: "t@example.invalid" },
        address: "12 Somewhere Street, Cairo",
        items: [{ productId: product.id, qty: before + 5 }],
      })
    ).rejects.toBeInstanceOf(StockError);

    expect((await store.getProductBySlug(product.slug))?.stockQty).toBe(before);
  });

  it("reuses an existing customer rather than duplicating them by email", async () => {
    const store = makeStore();
    const [product] = await store.listProducts();
    if (!product) throw new Error("no product");
    const before = (await store.listCustomers()).length;

    const first = await store.createOrder({
      customer: { name: "Repeat Buyer", email: "repeat@example.invalid" },
      address: "12 Somewhere Street, Cairo",
      items: [{ productId: product.id, qty: 1 }],
    });
    const second = await store.createOrder({
      customer: { name: "Repeat Buyer", email: "REPEAT@example.invalid" },
      address: "12 Somewhere Street, Cairo",
      items: [{ productId: product.id, qty: 1 }],
    });

    expect(second.customerId).toBe(first.customerId);
    expect((await store.listCustomers()).length).toBe(before + 1);
  });
});

describe("findOrderForTracking", () => {
  it("returns the order when number and email both match", async () => {
    const store = makeStore();
    const [order] = await store.listOrders();
    if (!order) throw new Error("no orders");
    const customer = await store.getCustomer(order.customerId);
    if (!customer) throw new Error("no customer");

    const found = await store.findOrderForTracking(order.orderNumber, customer.email);
    expect(found?.id).toBe(order.id);
  });

  it("is case-insensitive on both fields", async () => {
    const store = makeStore();
    const [order] = await store.listOrders();
    if (!order) throw new Error("no orders");
    const customer = await store.getCustomer(order.customerId);
    if (!customer) throw new Error("no customer");

    const found = await store.findOrderForTracking(
      order.orderNumber.toLowerCase(),
      customer.email.toUpperCase()
    );
    expect(found?.id).toBe(order.id);
  });

  it("refuses to return an order when the email does not match", async () => {
    const store = makeStore();
    const [order] = await store.listOrders();
    if (!order) throw new Error("no orders");

    expect(await store.findOrderForTracking(order.orderNumber, "attacker@example.invalid")).toBeNull();
  });

  it("gives the same null for a wrong email as for an unknown number, so neither confirms the other exists", async () => {
    const store = makeStore();
    const [order] = await store.listOrders();
    if (!order) throw new Error("no orders");

    const wrongEmail = await store.findOrderForTracking(order.orderNumber, "nobody@example.invalid");
    const unknownNumber = await store.findOrderForTracking("KH-2026-9999", "nobody@example.invalid");
    expect(wrongEmail).toBeNull();
    expect(unknownNumber).toBeNull();
  });
});

describe("appendEvent", () => {
  it("moves the order and records who acted", async () => {
    const store = makeStore();
    const orders = await store.listOrders();
    const placed = orders.find((o) => o.status === "placed");
    if (!placed) throw new Error("seed should include a placed order");

    const updated = await store.appendEvent(placed.id, "confirmed", "Checked stock.", "admin:Owner");

    expect(updated?.status).toBe("confirmed");
    const last = updated?.timeline[updated.timeline.length - 1];
    expect(last?.status).toBe("confirmed");
    expect(last?.actor).toBe("admin:Owner");
    expect(last?.note).toBe("Checked stock.");
  });

  it("returns null for an unknown order", async () => {
    expect(await makeStore().appendEvent("ord_999999", "confirmed", "", "system")).toBeNull();
  });

  it("keeps timelines legal when driven through the shared transitions function", async () => {
    const store = makeStore();
    const orders = await store.listOrders();
    const placed = orders.find((o) => o.status === "placed");
    if (!placed) throw new Error("no placed order");

    let current = placed;
    for (let step = 0; step < 5; step++) {
      const [next] = nextStatuses(current.status);
      if (!next || next === "cancelled") break;
      expect(() => assertTransition(current.status, next)).not.toThrow();
      const updated = await store.appendEvent(current.id, next, "", "admin:Owner");
      if (!updated) throw new Error("append failed");
      current = updated;
    }

    expect(current.status).toBe("delivered");
    expect(nextStatuses(current.status)).toEqual([]);
  });
});

describe("admin lookup", () => {
  it("finds a seeded admin by email, case-insensitively", async () => {
    const store = makeStore();
    expect((await store.findAdminByEmail("OWNER@demo"))?.role).toBe("owner");
    expect((await store.findAdminByEmail("staff@demo"))?.role).toBe("staff");
  });

  it("returns null for an unknown admin", async () => {
    expect(await makeStore().findAdminByEmail("nobody@demo")).toBeNull();
  });
});

describe("reset", () => {
  it("restores the seeded state, discarding anything created since", async () => {
    const store = makeStore();
    const [product] = await store.listProducts();
    if (!product) throw new Error("no product");
    const originalCount = (await store.listOrders()).length;

    await store.createOrder({
      customer: { name: "Test", email: "t@example.invalid" },
      address: "12 Somewhere Street, Cairo",
      items: [{ productId: product.id, qty: 1 }],
    });
    expect((await store.listOrders()).length).toBe(originalCount + 1);

    await store.reset();

    expect((await store.listOrders()).length).toBe(originalCount);
    expect((await store.getProductBySlug(product.slug))?.stockQty).toBe(product.stockQty);
  });
});
