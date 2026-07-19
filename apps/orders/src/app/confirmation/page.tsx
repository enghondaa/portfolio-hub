import Link from "next/link";
import { CopyOrderNumber } from "@/components/CopyOrderNumber";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; email?: string }>;
}) {
  const { order, email } = await searchParams;

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center sm:px-6">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold text-[var(--color-neutral-800)]">
          No order to show
        </h1>
        <Link href="/" className="mt-6 inline-block font-mono text-sm text-[var(--color-accent)] underline underline-offset-4">
          Back to the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-16 text-center sm:px-6 sm:py-24">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-success)]/15 text-2xl text-[var(--color-success)]">
        ✓
      </div>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent)]">Payment simulated</p>
      <h1 className="mt-3 font-[family-name:var(--font-heading)] text-[clamp(30px,5vw,44px)] font-semibold tracking-tight text-[var(--color-neutral-800)]">
        Order placed.
      </h1>
      <p className="mt-4 text-[var(--color-neutral-600)]">
        Thanks{email ? `, we've noted ${email}` : ""}. Your beans are queued for roasting.
      </p>

      <div className="mt-8 rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-6">
        <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-neutral-400)]">Your order number</p>
        <p className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-[var(--color-neutral-800)]">
          {order}
        </p>
        <p className="mt-3 text-sm text-[var(--color-neutral-600)]">
          Save this number. You&apos;ll need it, with your email, to track your order.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <CopyOrderNumber orderNumber={order} />
          <Link
            href={`/track?order=${encodeURIComponent(order)}${email ? `&email=${encodeURIComponent(email)}` : ""}`}
            className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-[var(--color-neutral-50)] transition-colors hover:bg-[var(--color-accent-light)]"
          >
            Track this order →
          </Link>
        </div>
      </div>

      <Link href="/" className="mt-8 inline-block font-mono text-xs text-[var(--color-neutral-600)] hover:text-[var(--color-accent)]">
        ← Keep shopping
      </Link>
    </div>
  );
}
