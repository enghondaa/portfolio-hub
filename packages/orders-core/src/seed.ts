import { computeTotals } from "./pricing";
import type { Customer, Order, OrderEvent, OrderItem, OrderStatus, Product } from "./types";

/**
 * Deterministic seed data for Kahwa Supply, a fictional specialty coffee
 * roaster. Same generator as the analytics dashboard: a mulberry32 PRNG
 * seeded from a string hash, so server and client render identical data and
 * a given SEED_VERSION always produces the same catalogue and order history.
 * Nothing here is real — no real roaster, customers, or orders.
 */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Deterministic id, so re-seeding produces stable references. */
function seededId(prefix: string, n: number): string {
  return `${prefix}_${String(n).padStart(6, "0")}`;
}

function pick<T>(random: () => number, list: readonly T[]): T {
  const index = Math.floor(random() * list.length);
  // noUncheckedIndexedAccess: index is in range by construction, but the
  // fallback keeps this total rather than asserting.
  return list[index] ?? (list[0] as T);
}

/* ------------------------------------------------------------------ *
 * Catalogue
 * ------------------------------------------------------------------ */

interface ProductSeed {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
}

const PRODUCT_SEEDS: ProductSeed[] = [
  { slug: "sidamo-natural", name: "Sidamo Natural", description: "Ethiopian natural process. Blueberry and dark chocolate, heavy body, low acidity. Roasted for filter.", priceCents: 32_000 },
  { slug: "yirgacheffe-washed", name: "Yirgacheffe Washed", description: "Bright and floral, with jasmine and bergamot. The one to reach for when you want the cup to taste like tea.", priceCents: 35_000 },
  { slug: "harrar-longberry", name: "Harrar Longberry", description: "Dry-processed and wild. Blueberry jam, a little funk, and a syrupy finish. Divisive on purpose.", priceCents: 30_000 },
  { slug: "colombia-huila", name: "Colombia Huila", description: "Caramel, red apple, and a clean sweetness. The house all-rounder, and the easiest place to start.", priceCents: 28_000 },
  { slug: "brazil-cerrado", name: "Brazil Cerrado", description: "Peanut, milk chocolate, very low acidity. Built for espresso and forgiving with milk.", priceCents: 26_000 },
  { slug: "guatemala-antigua", name: "Guatemala Antigua", description: "Cocoa and toasted almond, with a spice note in the finish. Holds up well in a moka pot.", priceCents: 31_000 },
  { slug: "kenya-aa", name: "Kenya AA", description: "Blackcurrant and tomato leaf, huge acidity, unmistakable. For people who already know they like Kenyan coffee.", priceCents: 38_000 },
  { slug: "yemen-mocha", name: "Yemen Mocha", description: "Aged, winey, and deeply spiced. Small lot, and priced like it. Brew it strong and drink it slowly.", priceCents: 52_000 },
  { slug: "house-espresso", name: "House Espresso Blend", description: "Brazil and Colombia, roasted a shade darker. Chocolate, hazelnut, and enough body to cut through milk.", priceCents: 24_000 },
  { slug: "decaf-sugarcane", name: "Sugarcane Decaf", description: "Colombian, decaffeinated with sugarcane ethyl acetate rather than solvents. Tastes like coffee, not like decaf.", priceCents: 27_000 },
  { slug: "cold-brew-coarse", name: "Cold Brew Coarse Grind", description: "Pre-ground coarse for immersion. Twelve hours in the fridge and you have a week of iced coffee.", priceCents: 22_000 },
  { slug: "taster-flight", name: "Taster Flight (4 x 100g)", description: "Four single origins in 100g bags, rotating monthly. The cheapest way to find out what you actually like.", priceCents: 45_000 },
];

export function seedProducts(seedVersion: string): Product[] {
  const random = mulberry32(hashString(`products:${seedVersion}`));

  return PRODUCT_SEEDS.map((product, i) => {
    // A couple of items are deliberately low or out of stock so the low-stock
    // badge and the out-of-stock block are visible without editing anything.
    const roll = random();
    let stockQty: number;
    if (i === 7) stockQty = 0;
    else if (i === 2 || i === 10) stockQty = 1 + Math.floor(random() * 4);
    else stockQty = 12 + Math.floor(roll * 60);

    return {
      id: seededId("prod", i + 1),
      slug: product.slug,
      name: product.name,
      description: product.description,
      priceCents: product.priceCents,
      imageKey: product.slug,
      stockQty,
      active: true,
    };
  });
}

/* ------------------------------------------------------------------ *
 * Customers
 * ------------------------------------------------------------------ */

const FIRST_NAMES = ["Mona", "Youssef", "Salma", "Karim", "Nour", "Omar", "Hana", "Tarek", "Farida", "Amir", "Layla", "Hassan", "Dina", "Sherif", "Rania", "Adel", "Yasmin", "Khaled", "Maha", "Ziad"] as const;
const LAST_NAMES = ["Hassan", "Ibrahim", "Fouad", "Mansour", "Saleh", "Nagy", "Rashad", "Halim", "Sabry", "Zaki", "Farouk", "Adly", "Shafik", "Gaber", "Lotfy"] as const;

export function seedCustomers(seedVersion: string, count = 40): Customer[] {
  const random = mulberry32(hashString(`customers:${seedVersion}`));
  const now = Date.UTC(2026, 6, 18);
  const customers: Customer[] = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < count; i++) {
    const first = pick(random, FIRST_NAMES);
    const last = pick(random, LAST_NAMES);

    // example.invalid is reserved by RFC 6761 and can never be a real address,
    // which is the point: these are fictional customers.
    let email = `${first}.${last}${i}`.toLowerCase() + "@example.invalid";
    while (usedEmails.has(email)) email = `${first}.${last}${i}x`.toLowerCase() + "@example.invalid";
    usedEmails.add(email);

    const daysAgo = Math.floor(random() * 400);
    customers.push({
      id: seededId("cust", i + 1),
      name: `${first} ${last}`,
      email,
      createdAt: new Date(now - daysAgo * 86_400_000).toISOString(),
    });
  }

  return customers;
}

/* ------------------------------------------------------------------ *
 * Orders
 * ------------------------------------------------------------------ */

/** Weighted so most history is complete and only a handful are mid-flight. */
const STATUS_WEIGHTS: { status: OrderStatus; weight: number }[] = [
  { status: "delivered", weight: 0.62 },
  { status: "cancelled", weight: 0.06 },
  { status: "out_for_delivery", weight: 0.07 },
  { status: "shipped", weight: 0.1 },
  { status: "packed", weight: 0.06 },
  { status: "confirmed", weight: 0.05 },
  { status: "placed", weight: 0.04 },
];

function weightedStatus(random: () => number): OrderStatus {
  const roll = random();
  let cumulative = 0;
  for (const entry of STATUS_WEIGHTS) {
    cumulative += entry.weight;
    if (roll <= cumulative) return entry.status;
  }
  return "delivered";
}

/** The sequence of statuses an order passed through to reach `final`. */
function pathTo(final: OrderStatus): OrderStatus[] {
  const happy: OrderStatus[] = ["placed", "confirmed", "packed", "shipped", "out_for_delivery", "delivered"];
  if (final === "cancelled") {
    // Cancelled somewhere before shipping.
    return ["placed", "confirmed", "cancelled"];
  }
  const index = happy.indexOf(final);
  return happy.slice(0, index + 1);
}

const EVENT_NOTES: Record<OrderStatus, string> = {
  placed: "Order received.",
  confirmed: "Stock checked and order confirmed.",
  packed: "Beans roasted, ground to order where requested, and sealed.",
  shipped: "Handed to the courier.",
  out_for_delivery: "On the van for delivery today.",
  delivered: "Delivered and signed for.",
  cancelled: "Cancelled at the customer's request before dispatch.",
};

export interface SeededData {
  products: Product[];
  customers: Customer[];
  orders: Order[];
}

export function seedOrders(seedVersion: string, products: Product[], customers: Customer[], count = 180): Order[] {
  const random = mulberry32(hashString(`orders:${seedVersion}`));
  const now = Date.UTC(2026, 6, 18);
  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const customer = pick(random, customers);
    const finalStatus = weightedStatus(random);

    // Spread across 90 days. Mid-flight orders are pulled recent, because a
    // three-month-old order still "out for delivery" would be nonsense.
    const inFlight = !["delivered", "cancelled"].includes(finalStatus);
    const daysAgo = inFlight ? Math.floor(random() * 6) : 2 + Math.floor(random() * 88);
    const placedAtMs = now - daysAgo * 86_400_000 - Math.floor(random() * 86_400_000);

    const lineCount = 1 + Math.floor(random() * 3);
    const items: OrderItem[] = [];
    const usedProducts = new Set<string>();
    for (let l = 0; l < lineCount; l++) {
      const product = pick(random, products);
      if (usedProducts.has(product.id)) continue;
      usedProducts.add(product.id);
      items.push({
        productId: product.id,
        qty: 1 + Math.floor(random() * 3),
        unitPriceCents: product.priceCents,
      });
    }
    if (items.length === 0) {
      const fallback = products[0];
      if (fallback) items.push({ productId: fallback.id, qty: 1, unitPriceCents: fallback.priceCents });
    }

    const totals = computeTotals(items);
    const orderId = seededId("ord", i + 1);
    const orderNumber = `KH-2026-${String(i + 1).padStart(4, "0")}`;

    const path = pathTo(finalStatus);
    // Accumulate the gap between steps rather than multiplying a fresh random
    // by the step index: with a per-step multiplier, a later step that drew a
    // small number could land before an earlier step that drew a large one,
    // producing a timeline that runs backwards.
    let eventAtMs = placedAtMs;
    const timeline: OrderEvent[] = path.map((status, stepIndex) => {
      if (stepIndex > 0) {
        // Each step lands 6-30 hours after the previous one.
        eventAtMs += (6 + random() * 24) * 3_600_000;
      }
      return {
        id: `${orderId}_evt_${stepIndex + 1}`,
        orderId,
        status,
        note: EVENT_NOTES[status],
        actor: stepIndex === 0 ? "system" : ("admin:Kahwa Ops" as const),
        at: new Date(eventAtMs).toISOString(),
      };
    });

    orders.push({
      id: orderId,
      orderNumber,
      customerId: customer.id,
      items,
      subtotalCents: totals.subtotalCents,
      shippingCents: totals.shippingCents,
      totalCents: totals.totalCents,
      status: finalStatus,
      placedAt: new Date(placedAtMs).toISOString(),
      timeline,
    });
  }

  return orders.sort((a, b) => (a.placedAt < b.placedAt ? 1 : -1));
}

export function seedAll(seedVersion: string): SeededData {
  const products = seedProducts(seedVersion);
  const customers = seedCustomers(seedVersion);
  const orders = seedOrders(seedVersion, products, customers);
  return { products, customers, orders };
}
