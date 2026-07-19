/**
 * Three seeded orders in different states, so a visitor can try tracking
 * instantly without checking out first.
 *
 * These come from the deterministic seed (seedAll("kahwa-v1")). They are
 * stable as long as SEED_VERSION stays "kahwa-v1"; if that env var changes,
 * regenerate this list from the seed or the shortcuts will 404.
 */
export interface DemoOrder {
  orderNumber: string;
  email: string;
  state: string;
}

export const DEMO_ORDERS: DemoOrder[] = [
  { orderNumber: "KH-2026-0133", email: "sherif.shafik35@example.invalid", state: "Out for delivery" },
  { orderNumber: "KH-2026-0165", email: "farida.halim14@example.invalid", state: "Shipped" },
  { orderNumber: "KH-2026-0048", email: "mona.ibrahim5@example.invalid", state: "Delivered" },
];
