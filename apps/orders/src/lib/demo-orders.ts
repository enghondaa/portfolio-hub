import { store } from "@/lib/store";
import type { OrderStatus } from "@portfolio/orders-core";

/**
 * Three seeded orders in different states, so a visitor can try tracking
 * instantly without checking out first.
 *
 * These used to be a hardcoded list copied out of the seed. That worked until
 * the seed changed: bumping SEED_VERSION regenerated the order numbers and the
 * three shortcuts silently started 404ing, with nothing in the test suite to
 * notice. Reading them out of the store at request time means the shortcuts
 * cannot disagree with the data behind them, whichever seed version is live.
 */
export interface DemoOrder {
  orderNumber: string;
  email: string;
  state: string;
}

const SHOWCASE_STATUSES: { status: OrderStatus; label: string }[] = [
  { status: "out_for_delivery", label: "Out for delivery" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

export async function getDemoOrders(): Promise<DemoOrder[]> {
  const [orders, customers] = await Promise.all([store.listOrders(), store.listCustomers()]);
  const emailById = new Map(customers.map((customer) => [customer.id, customer.email]));

  const demos: DemoOrder[] = [];
  for (const { status, label } of SHOWCASE_STATUSES) {
    // Orders arrive newest first, so this picks the freshest example of each
    // state rather than a months-old one.
    const match = orders.find((order) => order.status === status);
    const email = match ? emailById.get(match.customerId) : undefined;
    if (match && email) {
      demos.push({ orderNumber: match.orderNumber, email, state: label });
    }
  }
  return demos;
}
