import { computeTotals, findStockProblems } from "../pricing";
import { seedAll } from "../seed";
import { StockError, type OrdersStore } from "../store";
import type {
  AdminUser,
  Customer,
  EventActor,
  Order,
  OrderEvent,
  OrderStatus,
  Product,
} from "../types";

/**
 * In-memory implementation.
 *
 * This exists for local development and so the code can be read as proof of
 * the adapter pattern. It is NOT a production backend for these two apps:
 * each serverless deployment gets its own copy of this state, so the
 * storefront and the admin dashboard would silently operate on separate
 * data and the cross-app flow (admin advances an order, customer sees it on
 * the tracking page) could never work. Both apps surface that loudly rather
 * than degrading quietly — see PersistenceBanner.
 */

interface AdminSeed {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminUser["role"];
}

export interface MemoryStoreOptions {
  seedVersion: string;
  /** Pre-hashed, because hashing is async and belongs to the app that owns bcrypt. */
  admins: AdminSeed[];
}

export function createMemoryStore(options: MemoryStoreOptions): OrdersStore {
  let products: Product[] = [];
  let customers: Customer[] = [];
  let orders: Order[] = [];
  let seeded = false;
  let orderCounter = 0;

  function ensureSeeded(): void {
    if (seeded) return;
    const data = seedAll(options.seedVersion);
    products = data.products.map((p) => ({ ...p }));
    customers = data.customers.map((c) => ({ ...c }));
    orders = data.orders.map((o) => ({ ...o, items: [...o.items], timeline: [...o.timeline] }));
    orderCounter = orders.length;
    seeded = true;
  }

  function nextOrderNumber(): string {
    orderCounter += 1;
    return `KH-2026-${String(orderCounter).padStart(4, "0")}`;
  }

  return {
    async listProducts(opts) {
      ensureSeeded();
      return products
        .filter((p) => (opts?.includeInactive ? true : p.active))
        .map((p) => ({ ...p }));
    },

    async getProductBySlug(slug) {
      ensureSeeded();
      const found = products.find((p) => p.slug === slug);
      return found ? { ...found } : null;
    },

    async createProduct(input) {
      ensureSeeded();
      const product: Product = { ...input, id: `prod_${String(products.length + 1).padStart(6, "0")}` };
      products.push(product);
      return { ...product };
    },

    async updateProduct(id, input) {
      ensureSeeded();
      const product = products.find((p) => p.id === id);
      if (!product) return null;
      Object.assign(product, input);
      return { ...product };
    },

    async listCustomers() {
      ensureSeeded();
      return customers.map((c) => ({ ...c }));
    },

    async getCustomer(id) {
      ensureSeeded();
      const found = customers.find((c) => c.id === id);
      return found ? { ...found } : null;
    },

    async findCustomerByEmail(email) {
      ensureSeeded();
      const normalised = email.trim().toLowerCase();
      const found = customers.find((c) => c.email.toLowerCase() === normalised);
      return found ? { ...found } : null;
    },

    async listOrders() {
      ensureSeeded();
      return orders.map((o) => ({ ...o, items: [...o.items], timeline: [...o.timeline] }));
    },

    async getOrder(id) {
      ensureSeeded();
      const found = orders.find((o) => o.id === id);
      return found ? { ...found, items: [...found.items], timeline: [...found.timeline] } : null;
    },

    async findOrderForTracking(orderNumber, email) {
      ensureSeeded();
      const number = orderNumber.trim().toUpperCase();
      const normalisedEmail = email.trim().toLowerCase();

      const order = orders.find((o) => o.orderNumber.toUpperCase() === number);
      if (!order) return null;

      // The email must match the order's own customer. Without this, anyone
      // could enumerate order numbers and read other people's orders.
      const customer = customers.find((c) => c.id === order.customerId);
      if (!customer || customer.email.toLowerCase() !== normalisedEmail) return null;

      return { ...order, items: [...order.items], timeline: [...order.timeline] };
    },

    async createOrder(input) {
      ensureSeeded();

      const problems = findStockProblems(input.items, products);
      if (problems.length > 0) throw new StockError(problems);

      const normalisedEmail = input.customer.email.trim().toLowerCase();
      let customer = customers.find((c) => c.email.toLowerCase() === normalisedEmail);
      if (!customer) {
        customer = {
          id: `cust_${String(customers.length + 1).padStart(6, "0")}`,
          name: input.customer.name,
          email: input.customer.email.trim(),
          createdAt: new Date().toISOString(),
        };
        customers.push(customer);
      }

      const lines = input.items.map((line) => {
        const product = products.find((p) => p.id === line.productId);
        return { productId: line.productId, qty: line.qty, unitPriceCents: product?.priceCents ?? 0 };
      });
      const totals = computeTotals(lines);

      // Stock comes down as part of writing the order, so two checkouts
      // cannot both claim the last bag.
      for (const line of input.items) {
        const product = products.find((p) => p.id === line.productId);
        if (product) product.stockQty -= line.qty;
      }

      const now = new Date().toISOString();
      const id = `ord_${String(orders.length + 1).padStart(6, "0")}`;
      const order: Order = {
        id,
        orderNumber: nextOrderNumber(),
        customerId: customer.id,
        items: lines,
        subtotalCents: totals.subtotalCents,
        shippingCents: totals.shippingCents,
        totalCents: totals.totalCents,
        status: "placed",
        placedAt: now,
        timeline: [
          {
            id: `${id}_evt_1`,
            orderId: id,
            status: "placed",
            note: "Order received.",
            actor: "customer",
            at: now,
          },
        ],
      };

      orders.unshift(order);
      return { ...order, items: [...order.items], timeline: [...order.timeline] };
    },

    async appendEvent(orderId: string, status: OrderStatus, note: string, actor: EventActor) {
      ensureSeeded();
      const order = orders.find((o) => o.id === orderId);
      if (!order) return null;

      const event: OrderEvent = {
        id: `${order.id}_evt_${order.timeline.length + 1}`,
        orderId: order.id,
        status,
        note,
        actor,
        at: new Date().toISOString(),
      };
      order.timeline.push(event);
      order.status = status;

      return { ...order, items: [...order.items], timeline: [...order.timeline] };
    },

    async findAdminByEmail(email) {
      const normalised = email.trim().toLowerCase();
      const found = options.admins.find((a) => a.email.toLowerCase() === normalised);
      return found ? { ...found } : null;
    },

    async reset() {
      seeded = false;
      ensureSeeded();
    },
  };
}
