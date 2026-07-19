import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout — Kahwa Supply",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6 sm:py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent)]">/ checkout</p>
      <h1 className="mt-4 font-[family-name:var(--font-heading)] text-[clamp(30px,5vw,44px)] font-semibold tracking-tight text-[var(--color-neutral-800)]">
        Almost there.
      </h1>
      <CheckoutForm />
    </div>
  );
}
