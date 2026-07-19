"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

/**
 * Cart link with a live item count.
 *
 * The count comes from a localStorage-backed Zustand store, so the server
 * renders zero and the client may rehydrate to a non-zero value. Rather than
 * gate on a mount flag (which trips react-hooks/set-state-in-effect), the
 * badge is marked suppressHydrationWarning: the one-frame difference is
 * expected and harmless.
 */
export function CartButton() {
  const count = useCart((s) => s.lines.reduce((sum, l) => sum + l.qty, 0));

  return (
    <Link
      href="/cart"
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-3 py-1.5 text-[var(--color-neutral-700)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
    >
      Cart
      <span
        suppressHydrationWarning
        className={
          count > 0
            ? "inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-semibold text-[var(--color-neutral-50)]"
            : "hidden"
        }
      >
        {count}
      </span>
    </Link>
  );
}
