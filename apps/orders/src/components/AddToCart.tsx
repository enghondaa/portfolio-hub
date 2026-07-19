"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartLine } from "@/lib/cart";

/** Quantity stepper plus an add button. Caps at available stock so the cart cannot exceed what the server will accept. */
export function AddToCart({ product, maxQty }: { product: Omit<CartLine, "qty">; maxQty: number }) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const cap = Math.min(99, maxQty);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center rounded-full border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="h-10 w-10 rounded-l-full text-lg text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-accent)] disabled:opacity-30"
          disabled={qty <= 1}
        >
          −
        </button>
        <span className="w-8 text-center font-mono text-sm tabular-nums text-[var(--color-neutral-800)]" aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQty((q) => Math.min(cap, q + 1))}
          className="h-10 w-10 rounded-r-full text-lg text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-accent)] disabled:opacity-30"
          disabled={qty >= cap}
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={() => {
          add(product, qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 1400);
        }}
        className="h-11 rounded-full bg-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-neutral-50)] shadow-[0_10px_24px_-10px_rgba(192,90,43,0.9)] transition-all duration-200 hover:bg-[var(--color-accent-light)] active:scale-[0.97]"
      >
        {added ? "Added ✓" : "Add to cart"}
      </button>

      {added && (
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="font-mono text-xs text-[var(--color-accent)] underline underline-offset-4"
        >
          View cart →
        </button>
      )}
    </div>
  );
}
