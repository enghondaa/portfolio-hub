import type { OrderItem, Product } from "./types";

/**
 * Money is handled in integer piastres (1 EGP = 100) throughout. Floats are
 * never used for currency: 0.1 + 0.2 problems in an order total are the kind
 * of bug that is invisible in a demo and expensive in production.
 */

/** Free shipping at or above this subtotal. */
export const FREE_SHIPPING_THRESHOLD_CENTS = 100_000; // 1,000 EGP
/** Flat rate below the threshold. */
export const FLAT_SHIPPING_CENTS = 6_000; // 60 EGP

export function lineTotalCents(item: Pick<OrderItem, "qty" | "unitPriceCents">): number {
  return item.qty * item.unitPriceCents;
}

export function subtotalCents(items: Pick<OrderItem, "qty" | "unitPriceCents">[]): number {
  return items.reduce((sum, item) => sum + lineTotalCents(item), 0);
}

export function shippingCentsFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS;
}

export interface Totals {
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export function computeTotals(items: Pick<OrderItem, "qty" | "unitPriceCents">[]): Totals {
  const subtotal = subtotalCents(items);
  const shipping = shippingCentsFor(subtotal);
  return { subtotalCents: subtotal, shippingCents: shipping, totalCents: subtotal + shipping };
}

/** Formats piastres as EGP. Kept here so storefront and admin never disagree. */
export function formatEGP(cents: number): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(cents / 100));
}

/* ------------------------------------------------------------------ *
 * Stock
 * ------------------------------------------------------------------ */

export const LOW_STOCK_THRESHOLD = 5;

export function isLowStock(product: Pick<Product, "stockQty" | "active">): boolean {
  return product.active && product.stockQty > 0 && product.stockQty < LOW_STOCK_THRESHOLD;
}

export function isPurchasable(product: Pick<Product, "stockQty" | "active">): boolean {
  return product.active && product.stockQty > 0;
}

export interface StockProblem {
  productId: string;
  reason: "inactive" | "out_of_stock" | "insufficient_stock";
  available: number;
  requested: number;
}

/**
 * Validates a basket against live stock before an order is written.
 *
 * Returns every problem rather than the first, so checkout can show the
 * customer all of them at once instead of one per attempt.
 */
export function findStockProblems(
  requested: { productId: string; qty: number }[],
  products: Product[]
): StockProblem[] {
  const byId = new Map(products.map((product) => [product.id, product]));
  const problems: StockProblem[] = [];

  for (const line of requested) {
    const product = byId.get(line.productId);
    if (!product || !product.active) {
      problems.push({ productId: line.productId, reason: "inactive", available: 0, requested: line.qty });
      continue;
    }
    if (product.stockQty === 0) {
      problems.push({ productId: line.productId, reason: "out_of_stock", available: 0, requested: line.qty });
      continue;
    }
    if (product.stockQty < line.qty) {
      problems.push({
        productId: line.productId,
        reason: "insufficient_stock",
        available: product.stockQty,
        requested: line.qty,
      });
    }
  }

  return problems;
}
