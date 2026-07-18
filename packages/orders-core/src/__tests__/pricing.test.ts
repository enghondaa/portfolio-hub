import {
  FLAT_SHIPPING_CENTS,
  FREE_SHIPPING_THRESHOLD_CENTS,
  computeTotals,
  findStockProblems,
  formatEGP,
  isLowStock,
  isPurchasable,
  lineTotalCents,
  shippingCentsFor,
  subtotalCents,
} from "../pricing";
import type { Product } from "../types";

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: "prod_000001",
    slug: "test",
    name: "Test",
    description: "Test product",
    priceCents: 10_000,
    imageKey: "test",
    stockQty: 10,
    active: true,
    ...overrides,
  };
}

describe("line and subtotal math", () => {
  it("multiplies quantity by unit price", () => {
    expect(lineTotalCents({ qty: 3, unitPriceCents: 32_000 })).toBe(96_000);
  });

  it("sums every line into the subtotal", () => {
    expect(
      subtotalCents([
        { qty: 2, unitPriceCents: 28_000 },
        { qty: 1, unitPriceCents: 35_000 },
      ])
    ).toBe(91_000);
  });

  it("treats an empty basket as zero, not NaN", () => {
    expect(subtotalCents([])).toBe(0);
  });
});

describe("shipping rule", () => {
  it("charges the flat rate below the threshold", () => {
    expect(shippingCentsFor(FREE_SHIPPING_THRESHOLD_CENTS - 1)).toBe(FLAT_SHIPPING_CENTS);
    expect(shippingCentsFor(0)).toBe(FLAT_SHIPPING_CENTS);
  });

  it("is free exactly at the threshold, not just above it", () => {
    expect(shippingCentsFor(FREE_SHIPPING_THRESHOLD_CENTS)).toBe(0);
  });

  it("is free above the threshold", () => {
    expect(shippingCentsFor(FREE_SHIPPING_THRESHOLD_CENTS + 1)).toBe(0);
  });
});

describe("computeTotals", () => {
  it("adds shipping to a small basket", () => {
    const totals = computeTotals([{ qty: 1, unitPriceCents: 28_000 }]);
    expect(totals).toEqual({
      subtotalCents: 28_000,
      shippingCents: FLAT_SHIPPING_CENTS,
      totalCents: 34_000,
    });
  });

  it("drops shipping once the basket crosses the threshold", () => {
    const totals = computeTotals([{ qty: 4, unitPriceCents: 32_000 }]);
    expect(totals.subtotalCents).toBe(128_000);
    expect(totals.shippingCents).toBe(0);
    expect(totals.totalCents).toBe(128_000);
  });

  it("always reports total as subtotal plus shipping", () => {
    const baskets = [
      [{ qty: 1, unitPriceCents: 1 }],
      [{ qty: 7, unitPriceCents: 26_000 }],
      [
        { qty: 2, unitPriceCents: 52_000 },
        { qty: 3, unitPriceCents: 22_000 },
      ],
    ];
    for (const basket of baskets) {
      const totals = computeTotals(basket);
      expect(totals.totalCents).toBe(totals.subtotalCents + totals.shippingCents);
    }
  });

  it("keeps every figure an integer, so no float drift reaches a total", () => {
    const totals = computeTotals([
      { qty: 3, unitPriceCents: 33_333 },
      { qty: 1, unitPriceCents: 10_001 },
    ]);
    expect(Number.isInteger(totals.subtotalCents)).toBe(true);
    expect(Number.isInteger(totals.shippingCents)).toBe(true);
    expect(Number.isInteger(totals.totalCents)).toBe(true);
  });
});

describe("formatEGP", () => {
  it("renders piastres as whole pounds", () => {
    expect(formatEGP(32_000)).toContain("320");
  });

  it("renders zero without breaking", () => {
    expect(formatEGP(0)).toContain("0");
  });
});

describe("stock predicates", () => {
  it("flags low stock only for active products with some stock left", () => {
    expect(isLowStock(product({ stockQty: 4 }))).toBe(true);
    expect(isLowStock(product({ stockQty: 5 }))).toBe(false);
    expect(isLowStock(product({ stockQty: 0 }))).toBe(false);
    expect(isLowStock(product({ stockQty: 4, active: false }))).toBe(false);
  });

  it("only allows purchase of active, in-stock products", () => {
    expect(isPurchasable(product({ stockQty: 1 }))).toBe(true);
    expect(isPurchasable(product({ stockQty: 0 }))).toBe(false);
    expect(isPurchasable(product({ stockQty: 10, active: false }))).toBe(false);
  });
});

describe("findStockProblems", () => {
  const catalogue = [
    product({ id: "prod_000001", stockQty: 10 }),
    product({ id: "prod_000002", stockQty: 0 }),
    product({ id: "prod_000003", stockQty: 5, active: false }),
  ];

  it("returns nothing when every line can be fulfilled", () => {
    expect(findStockProblems([{ productId: "prod_000001", qty: 10 }], catalogue)).toEqual([]);
  });

  it("rejects an out-of-stock product", () => {
    const problems = findStockProblems([{ productId: "prod_000002", qty: 1 }], catalogue);
    expect(problems).toHaveLength(1);
    expect(problems[0]?.reason).toBe("out_of_stock");
  });

  it("rejects a deactivated product", () => {
    const problems = findStockProblems([{ productId: "prod_000003", qty: 1 }], catalogue);
    expect(problems[0]?.reason).toBe("inactive");
  });

  it("rejects an unknown product id rather than ignoring it", () => {
    const problems = findStockProblems([{ productId: "prod_999999", qty: 1 }], catalogue);
    expect(problems).toHaveLength(1);
  });

  it("reports insufficient stock with what is actually available", () => {
    const problems = findStockProblems([{ productId: "prod_000001", qty: 11 }], catalogue);
    expect(problems[0]).toMatchObject({ reason: "insufficient_stock", available: 10, requested: 11 });
  });

  it("reports every problem at once rather than stopping at the first", () => {
    const problems = findStockProblems(
      [
        { productId: "prod_000002", qty: 1 },
        { productId: "prod_000003", qty: 1 },
        { productId: "prod_000001", qty: 99 },
      ],
      catalogue
    );
    expect(problems).toHaveLength(3);
  });
});
