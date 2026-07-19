import type { Metadata } from "next";
import { TrackClient } from "@/components/TrackClient";

export const metadata: Metadata = {
  title: "Track your order — Kahwa Supply",
  description: "Follow a Kahwa Supply order with its number and email. Seeded demo data.",
  alternates: { canonical: "/track" },
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; email?: string }>;
}) {
  const { order, email } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6 sm:py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent)]">/ track order</p>
      <h1 className="mt-4 font-[family-name:var(--font-heading)] text-[clamp(30px,5vw,48px)] font-semibold tracking-tight text-[var(--color-neutral-800)]">
        Where&apos;s my coffee?
      </h1>
      <p className="mt-4 max-w-lg text-[var(--color-neutral-600)]">
        Enter your order number and the email you used. Both have to match — that&apos;s deliberate, so no one can look up an order that isn&apos;t theirs.
      </p>

      <TrackClient initialOrder={order} initialEmail={email} />
    </div>
  );
}
