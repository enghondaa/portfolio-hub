import { computeTotals, findStockProblems } from "../pricing";
import { seedAll } from "../seed";
import { StockError, type CreateOrderInput, type OrdersStore } from "../store";
import type {
  AdminUser,
  EventActor,
  Order,
  OrderStatus,
  Product,
} from "../types";

/**
 * Postgres implementation, used in production for both OrderFlow apps.
 *
 * This is the only adapter that lets the storefront and the admin dashboard
 * share state: each serverless deployment gets its own copy of the in-memory
 * store, so with that one the two apps would be disconnected and the whole
 * point of the demo (advance an order in admin, watch it change on the public
 * tracker) could not work. @vercel/postgres is reached through a dynamic
 * import so it is never pulled into a client bundle.
 */

interface AdminSeed {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: AdminUser["role"];
}

export interface PostgresStoreOptions {
  seedVersion: string;
  admins: AdminSeed[];
}

/* Row shapes as they come back from SQL, before mapping to domain types. */
interface ProductRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  image_key: string;
  stock_qty: number;
  active: boolean;
}
interface CustomerRow {
  id: string;
  name: string;
  email: string;
  created_at: Date | string;
}
interface OrderRow {
  id: string;
  order_number: string;
  customer_id: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  status: OrderStatus;
  placed_at: Date | string;
}
interface OrderItemRow {
  order_id: string;
  product_id: string;
  qty: number;
  unit_price_cents: number;
}
interface OrderEventRow {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string;
  actor: string;
  at: Date | string;
}

function iso(value: Date | string): string {
  return new Date(value).toISOString();
}

export function createPostgresStore(options: PostgresStoreOptions): OrdersStore {
  let schemaReady: Promise<void> | null = null;

  async function db() {
    return import("@vercel/postgres");
  }

  async function ensureSchema(): Promise<void> {
    if (schemaReady) return schemaReady;
    schemaReady = (async () => {
      const { sql } = await db();

      await sql`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price_cents INTEGER NOT NULL,
        image_key TEXT NOT NULL,
        stock_qty INTEGER NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE
      );`;
      await sql`CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );`;
      await sql`CREATE INDEX IF NOT EXISTS customers_email_idx ON customers (LOWER(email));`;
      await sql`CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        order_number TEXT UNIQUE NOT NULL,
        customer_id TEXT NOT NULL REFERENCES customers(id),
        subtotal_cents INTEGER NOT NULL,
        shipping_cents INTEGER NOT NULL,
        total_cents INTEGER NOT NULL,
        status TEXT NOT NULL,
        placed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );`;
      await sql`CREATE INDEX IF NOT EXISTS orders_number_idx ON orders (UPPER(order_number));`;
      await sql`CREATE TABLE IF NOT EXISTS order_items (
        order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id TEXT NOT NULL REFERENCES products(id),
        qty INTEGER NOT NULL,
        unit_price_cents INTEGER NOT NULL
      );`;
      await sql`CREATE TABLE IF NOT EXISTS order_events (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        status TEXT NOT NULL,
        note TEXT NOT NULL DEFAULT '',
        actor TEXT NOT NULL,
        at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );`;
      await sql`CREATE INDEX IF NOT EXISTS order_events_order_idx ON order_events (order_id, at);`;
      await sql`CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL
      );`;

      // Records which seed version currently occupies the tables. Without it
      // the only seeding trigger is "products is empty", which means a fix to
      // the generator can never reach a database that has already been
      // populated: the corrected code deploys, the wrong rows stay. Storing the
      // version turns a seed change into something that actually propagates.
      await sql`CREATE TABLE IF NOT EXISTS seed_meta (
        id INTEGER PRIMARY KEY DEFAULT 1,
        seed_version TEXT NOT NULL,
        seeded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT seed_meta_single_row CHECK (id = 1)
      );`;

      // Seed when the tables are empty, or reseed when the version on disk is
      // stale. The same honest caveat as the taskboard adapter applies: two
      // cold starts racing here could seed twice, and the ON CONFLICT DO
      // NOTHING inserts absorb that rather than an advisory lock.
      const { rows: countRows } = await sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM products;`;
      const { rows: metaRows } = await sql<{ seed_version: string }>`SELECT seed_version FROM seed_meta WHERE id = 1;`;
      const isEmpty = Number(countRows[0]?.count ?? 0) === 0;
      const isStale = metaRows[0]?.seed_version !== options.seedVersion;
      if (isEmpty) {
        await seed();
      } else if (isStale) {
        await sql`TRUNCATE order_events, order_items, orders, customers, products RESTART IDENTITY CASCADE;`;
        await seed();
      }
    })();
    return schemaReady;
  }

  async function seed(): Promise<void> {
    const { sql } = await db();
    const data = seedAll(options.seedVersion);

    for (const p of data.products) {
      await sql`INSERT INTO products (id, slug, name, description, price_cents, image_key, stock_qty, active)
        VALUES (${p.id}, ${p.slug}, ${p.name}, ${p.description}, ${p.priceCents}, ${p.imageKey}, ${p.stockQty}, ${p.active})
        ON CONFLICT (id) DO NOTHING;`;
    }
    for (const c of data.customers) {
      await sql`INSERT INTO customers (id, name, email, created_at)
        VALUES (${c.id}, ${c.name}, ${c.email}, ${c.createdAt})
        ON CONFLICT (id) DO NOTHING;`;
    }
    for (const o of data.orders) {
      await sql`INSERT INTO orders (id, order_number, customer_id, subtotal_cents, shipping_cents, total_cents, status, placed_at)
        VALUES (${o.id}, ${o.orderNumber}, ${o.customerId}, ${o.subtotalCents}, ${o.shippingCents}, ${o.totalCents}, ${o.status}, ${o.placedAt})
        ON CONFLICT (id) DO NOTHING;`;
      for (const item of o.items) {
        await sql`INSERT INTO order_items (order_id, product_id, qty, unit_price_cents)
          VALUES (${o.id}, ${item.productId}, ${item.qty}, ${item.unitPriceCents});`;
      }
      for (const evt of o.timeline) {
        await sql`INSERT INTO order_events (id, order_id, status, note, actor, at)
          VALUES (${evt.id}, ${evt.orderId}, ${evt.status}, ${evt.note}, ${evt.actor}, ${evt.at})
          ON CONFLICT (id) DO NOTHING;`;
      }
    }
    for (const admin of options.admins) {
      await sql`INSERT INTO admin_users (id, name, email, password_hash, role)
        VALUES (${admin.id}, ${admin.name}, ${admin.email}, ${admin.passwordHash}, ${admin.role})
        ON CONFLICT (id) DO NOTHING;`;
    }

    // Stamped last, so a seed that dies halfway leaves the version stale and
    // the next boot tries again rather than assuming the data is good.
    await sql`INSERT INTO seed_meta (id, seed_version, seeded_at)
      VALUES (1, ${options.seedVersion}, NOW())
      ON CONFLICT (id) DO UPDATE SET seed_version = EXCLUDED.seed_version, seeded_at = EXCLUDED.seeded_at;`;
  }

  function mapProduct(row: ProductRow): Product {
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      priceCents: row.price_cents,
      imageKey: row.image_key,
      stockQty: row.stock_qty,
      active: row.active,
    };
  }

  async function loadOrder(id: string): Promise<Order | null> {
    const { sql } = await db();
    const { rows } = await sql<OrderRow>`SELECT * FROM orders WHERE id = ${id};`;
    const order = rows[0];
    if (!order) return null;
    const { rows: items } = await sql<OrderItemRow>`SELECT * FROM order_items WHERE order_id = ${id};`;
    const { rows: events } = await sql<OrderEventRow>`SELECT * FROM order_events WHERE order_id = ${id} ORDER BY at ASC;`;
    return {
      id: order.id,
      orderNumber: order.order_number,
      customerId: order.customer_id,
      items: items.map((i) => ({ productId: i.product_id, qty: i.qty, unitPriceCents: i.unit_price_cents })),
      subtotalCents: order.subtotal_cents,
      shippingCents: order.shipping_cents,
      totalCents: order.total_cents,
      status: order.status,
      placedAt: iso(order.placed_at),
      timeline: events.map((e) => ({
        id: e.id,
        orderId: e.order_id,
        status: e.status,
        note: e.note,
        actor: e.actor as EventActor,
        at: iso(e.at),
      })),
    };
  }

  return {
    async listProducts(opts) {
      await ensureSchema();
      const { sql } = await db();
      const { rows } = opts?.includeInactive
        ? await sql<ProductRow>`SELECT * FROM products ORDER BY name;`
        : await sql<ProductRow>`SELECT * FROM products WHERE active = TRUE ORDER BY name;`;
      return rows.map(mapProduct);
    },

    async getProductBySlug(slug) {
      await ensureSchema();
      const { sql } = await db();
      const { rows } = await sql<ProductRow>`SELECT * FROM products WHERE slug = ${slug};`;
      return rows[0] ? mapProduct(rows[0]) : null;
    },

    async createProduct(input) {
      await ensureSchema();
      const { sql } = await db();
      const { rows: countRows } = await sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM products;`;
      const id = `prod_${String(Number(countRows[0]?.count ?? 0) + 1).padStart(6, "0")}`;
      const { rows } = await sql<ProductRow>`
        INSERT INTO products (id, slug, name, description, price_cents, image_key, stock_qty, active)
        VALUES (${id}, ${input.slug}, ${input.name}, ${input.description}, ${input.priceCents}, ${input.imageKey}, ${input.stockQty}, ${input.active})
        RETURNING *;`;
      return mapProduct(rows[0] as ProductRow);
    },

    async updateProduct(id, input) {
      await ensureSchema();
      const { sql } = await db();
      const { rows } = await sql<ProductRow>`
        UPDATE products SET
          name        = COALESCE(${input.name ?? null}, name),
          description = COALESCE(${input.description ?? null}, description),
          price_cents = COALESCE(${input.priceCents ?? null}, price_cents),
          stock_qty   = COALESCE(${input.stockQty ?? null}, stock_qty),
          active      = COALESCE(${input.active ?? null}, active)
        WHERE id = ${id}
        RETURNING *;`;
      return rows[0] ? mapProduct(rows[0]) : null;
    },

    async listCustomers() {
      await ensureSchema();
      const { sql } = await db();
      const { rows } = await sql<CustomerRow>`SELECT * FROM customers ORDER BY created_at DESC;`;
      return rows.map((r) => ({ id: r.id, name: r.name, email: r.email, createdAt: iso(r.created_at) }));
    },

    async getCustomer(id) {
      await ensureSchema();
      const { sql } = await db();
      const { rows } = await sql<CustomerRow>`SELECT * FROM customers WHERE id = ${id};`;
      const r = rows[0];
      return r ? { id: r.id, name: r.name, email: r.email, createdAt: iso(r.created_at) } : null;
    },

    async findCustomerByEmail(email) {
      await ensureSchema();
      const { sql } = await db();
      const { rows } = await sql<CustomerRow>`SELECT * FROM customers WHERE LOWER(email) = LOWER(${email.trim()}) LIMIT 1;`;
      const r = rows[0];
      return r ? { id: r.id, name: r.name, email: r.email, createdAt: iso(r.created_at) } : null;
    },

    async listOrders() {
      await ensureSchema();
      const { sql } = await db();
      const { rows } = await sql<{ id: string }>`SELECT id FROM orders ORDER BY placed_at DESC;`;
      const orders = await Promise.all(rows.map((r) => loadOrder(r.id)));
      return orders.filter((o): o is Order => o !== null);
    },

    async getOrder(id) {
      await ensureSchema();
      return loadOrder(id);
    },

    async findOrderForTracking(orderNumber, email) {
      await ensureSchema();
      const { sql } = await db();
      // Number and matching customer email must both line up, checked in SQL
      // so a mismatch never even loads the order.
      const { rows } = await sql<{ id: string }>`
        SELECT o.id FROM orders o
        JOIN customers c ON c.id = o.customer_id
        WHERE UPPER(o.order_number) = UPPER(${orderNumber.trim()})
          AND LOWER(c.email) = LOWER(${email.trim()})
        LIMIT 1;`;
      const id = rows[0]?.id;
      return id ? loadOrder(id) : null;
    },

    async createOrder(input: CreateOrderInput) {
      await ensureSchema();
      const { sql } = await db();

      const products = await this.listProducts({ includeInactive: true });
      const problems = findStockProblems(input.items, products);
      if (problems.length > 0) throw new StockError(problems);

      let customer = await this.findCustomerByEmail(input.customer.email);
      if (!customer) {
        const { rows: countRows } = await sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM customers;`;
        const id = `cust_${String(Number(countRows[0]?.count ?? 0) + 1).padStart(6, "0")}`;
        await sql`INSERT INTO customers (id, name, email) VALUES (${id}, ${input.customer.name}, ${input.customer.email.trim()});`;
        customer = { id, name: input.customer.name, email: input.customer.email.trim(), createdAt: new Date().toISOString() };
      }

      const byId = new Map(products.map((p) => [p.id, p]));
      const lines = input.items.map((line) => ({
        productId: line.productId,
        qty: line.qty,
        unitPriceCents: byId.get(line.productId)?.priceCents ?? 0,
      }));
      const totals = computeTotals(lines);

      const { rows: countRows } = await sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM orders;`;
      const seq = Number(countRows[0]?.count ?? 0) + 1;
      const orderId = `ord_${String(seq).padStart(6, "0")}`;
      const orderNumber = `KH-2026-${String(seq).padStart(4, "0")}`;

      await sql`INSERT INTO orders (id, order_number, customer_id, subtotal_cents, shipping_cents, total_cents, status)
        VALUES (${orderId}, ${orderNumber}, ${customer.id}, ${totals.subtotalCents}, ${totals.shippingCents}, ${totals.totalCents}, 'placed');`;
      for (const line of lines) {
        await sql`INSERT INTO order_items (order_id, product_id, qty, unit_price_cents)
          VALUES (${orderId}, ${line.productId}, ${line.qty}, ${line.unitPriceCents});`;
        await sql`UPDATE products SET stock_qty = stock_qty - ${line.qty} WHERE id = ${line.productId};`;
      }
      await sql`INSERT INTO order_events (id, order_id, status, note, actor)
        VALUES (${orderId + "_evt_1"}, ${orderId}, 'placed', 'Order received.', 'customer');`;

      const order = await loadOrder(orderId);
      if (!order) throw new Error("Order vanished immediately after insert");
      return order;
    },

    async appendEvent(orderId: string, status: OrderStatus, note: string, actor: EventActor) {
      await ensureSchema();
      const { sql } = await db();
      const { rows: countRows } = await sql<{ count: string }>`SELECT COUNT(*)::text AS count FROM order_events WHERE order_id = ${orderId};`;
      const eventId = `${orderId}_evt_${Number(countRows[0]?.count ?? 0) + 1}`;
      const { rowCount } = await sql`UPDATE orders SET status = ${status} WHERE id = ${orderId};`;
      if (!rowCount) return null;
      await sql`INSERT INTO order_events (id, order_id, status, note, actor)
        VALUES (${eventId}, ${orderId}, ${status}, ${note}, ${actor});`;
      return loadOrder(orderId);
    },

    async findAdminByEmail(email) {
      await ensureSchema();
      const { sql } = await db();
      const { rows } = await sql<{ id: string; name: string; email: string; password_hash: string; role: AdminUser["role"] }>`
        SELECT * FROM admin_users WHERE LOWER(email) = LOWER(${email.trim()}) LIMIT 1;`;
      const r = rows[0];
      return r ? { id: r.id, name: r.name, email: r.email, passwordHash: r.password_hash, role: r.role } : null;
    },

    async reset() {
      await ensureSchema();
      const { sql } = await db();
      await sql`TRUNCATE order_events, order_items, orders, customers, products, admin_users, seed_meta RESTART IDENTITY CASCADE;`;
      await seed();
    },
  };
}
