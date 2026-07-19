"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { computeTotals, formatEGP } from "@portfolio/orders-core";
import { useCart } from "@/lib/cart";

type FieldErrors = Partial<Record<"name" | "email" | "address" | "items", string[]>>;
type Phase = "form" | "paying" | "placing";

export function CheckoutForm() {
  const { lines, clear } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const totals = useMemo(
    () => computeTotals(lines.map((l) => ({ qty: l.qty, unitPriceCents: l.unitPriceCents }))),
    [lines]
  );

  if (lines.length === 0 && phase === "form") {
    return (
      <p className="mt-8 rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-4 py-4 text-[var(--color-neutral-600)]">
        Your cart is empty.{" "}
        <Link href="/" className="text-[var(--color-accent)] underline underline-offset-2">
          Browse the roastery
        </Link>{" "}
        first.
      </p>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setFormError(null);

    // The payment is simulated — no card details are ever collected. This
    // pause exists to make the fake step visible and honest, not to process
    // anything.
    setPhase("paying");
    await new Promise((r) => setTimeout(r, 1400));
    setPhase("placing");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          address,
          items: lines.map((l) => ({ productId: l.productId, qty: l.qty })),
        }),
      });
      const payload = await res.json().catch(() => null);

      if (res.status === 201 && payload?.orderNumber) {
        clear();
        router.push(`/confirmation?order=${encodeURIComponent(payload.orderNumber)}&email=${encodeURIComponent(email)}`);
        return;
      }

      if (res.status === 422 && payload?.fields) {
        setErrors(payload.fields as FieldErrors);
      } else {
        setFormError(payload?.error ?? "Something went wrong placing your order.");
      }
      setPhase("form");
    } catch {
      setFormError("Could not reach the server. Please try again.");
      setPhase("form");
    }
  }

  const busy = phase !== "form";

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
      <div className="space-y-5">
        <Field label="Full name" error={errors.name?.[0]}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-4 py-3 text-[var(--color-neutral-800)] outline-none transition-colors focus:border-[var(--color-accent)]"
          />
        </Field>
        <Field label="Email" error={errors.email?.[0]} hint="We send your order number and tracking to this address.">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-4 py-3 text-[var(--color-neutral-800)] outline-none transition-colors focus:border-[var(--color-accent)]"
          />
        </Field>
        <Field label="Delivery address" error={errors.address?.[0]}>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            autoComplete="street-address"
            className="w-full resize-none rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-4 py-3 text-[var(--color-neutral-800)] outline-none transition-colors focus:border-[var(--color-accent)]"
          />
        </Field>

        {formError && (
          <p role="alert" className="rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)]">
            {formError}
          </p>
        )}
      </div>

      <aside className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-6 lg:sticky lg:top-24">
        <dl className="space-y-2.5 font-mono text-sm">
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

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-[var(--color-neutral-50)] shadow-[0_10px_24px_-10px_rgba(192,90,43,0.9)] transition-all hover:bg-[var(--color-accent-light)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {phase === "paying" ? "Simulating payment…" : phase === "placing" ? "Placing order…" : "Pay & place order"}
        </button>

        <p className="mt-3 text-center font-mono text-[10px] leading-relaxed text-[var(--color-neutral-400)]">
          Payment is simulated — this is a demo. No card details are collected and nothing is charged.
        </p>
      </aside>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-neutral-600)]">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <span className="mt-1.5 block font-mono text-[11px] text-[var(--color-neutral-400)]">{hint}</span>}
      {error && (
        <span role="alert" className="mt-1.5 block font-mono text-[11px] text-[var(--color-danger)]">
          {error}
        </span>
      )}
    </label>
  );
}
