"use client";

import Link from "next/link";
import { useMemo } from "react";
import { computeTotals, formatEGP } from "@portfolio/orders-core";
import { useCart } from "@/lib/cart";
import { ProductImage } from "@/components/ProductImage";

export default function CartPage() {
  const { lines, setQty, remove } = useCart();
  const totals = useMemo(
    () => computeTotals(lines.map((l) => ({ qty: l.qty, unitPriceCents: l.unitPriceCents }))),
    [lines]
  );

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-6">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold text-[var(--color-neutral-800)]">
          Your cart is empty
        </h1>
        <p className="mt-3 text-[var(--color-neutral-600)]">No coffee yet. Let&apos;s fix that.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-semibold text-[var(--color-neutral-50)] transition-colors hover:bg-[var(--color-accent-light)]"
        >
          Browse the roastery
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 sm:py-14">
      <h1 className="font-[family-name:var(--font-heading)] text-[clamp(30px,5vw,44px)] font-semibold tracking-tight text-[var(--color-neutral-800)]">
        Your cart
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
        <ul className="space-y-4">
          {lines.map((line) => (
            <li
              key={line.productId}
              className="flex gap-4 rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-4"
            >
              <ProductImage name={line.name} imageKey={line.imageKey} className="h-20 w-20 shrink-0 rounded-xl" />
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/products/${line.slug}`}
                    className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--color-neutral-800)] hover:text-[var(--color-accent)]"
                  >
                    {line.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(line.productId)}
                    className="font-mono text-xs text-[var(--color-neutral-400)] transition-colors hover:text-[var(--color-danger)]"
                  >
                    Remove
                  </button>
                </div>
                <p className="mt-1 font-mono text-sm text-[var(--color-neutral-600)]">{formatEGP(line.unitPriceCents)} each</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center rounded-full border border-[var(--color-neutral-200)]">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${line.name}`}
                      onClick={() => setQty(line.productId, line.qty - 1)}
                      className="h-8 w-8 rounded-l-full text-[var(--color-neutral-600)] hover:text-[var(--color-accent)]"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-mono text-sm tabular-nums">{line.qty}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${line.name}`}
                      onClick={() => setQty(line.productId, line.qty + 1)}
                      className="h-8 w-8 rounded-r-full text-[var(--color-neutral-600)] hover:text-[var(--color-accent)]"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-mono text-sm font-medium text-[var(--color-neutral-800)]">
                    {formatEGP(line.unitPriceCents * line.qty)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-6 lg:sticky lg:top-24">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--color-neutral-800)]">Summary</h2>
          <dl className="mt-4 space-y-2.5 font-mono text-sm">
            <div className="flex justify-between text-[var(--color-neutral-600)]">
              <dt>Subtotal</dt>
              <dd>{formatEGP(totals.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between text-[var(--color-neutral-600)]">
              <dt>Shipping</dt>
              <dd>{totals.shippingCents === 0 ? "Free" : formatEGP(totals.shippingCents)}</dd>
            </div>
            <div className="flex justify-between border-t border-[var(--color-neutral-200)] pt-2.5 text-base font-medium text-[var(--color-neutral-800)]">
              <dt>Total</dt>
              <dd>{formatEGP(totals.totalCents)}</dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-[var(--color-accent)] px-6 py-3 text-center text-sm font-semibold text-[var(--color-neutral-50)] shadow-[0_10px_24px_-10px_rgba(192,90,43,0.9)] transition-colors hover:bg-[var(--color-accent-light)]"
          >
            Checkout
          </Link>
          <Link href="/" className="mt-3 block text-center font-mono text-xs text-[var(--color-neutral-600)] hover:text-[var(--color-accent)]">
            Keep shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
