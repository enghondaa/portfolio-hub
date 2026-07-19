import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track your order — Kahwa Supply",
  alternates: { canonical: "/track" },
};

// Full tracking experience lands in O2. This placeholder keeps the route
// resolvable so confirmation and nav links are never dead.
export default function TrackPage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent)]">/ track order</p>
      <h1 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold text-[var(--color-neutral-800)]">
        Order tracking is landing next.
      </h1>
      <p className="mt-4 text-[var(--color-neutral-600)]">
        Enter your order number and email to follow a live timeline. This page is being built.
      </p>
    </div>
  );
}
