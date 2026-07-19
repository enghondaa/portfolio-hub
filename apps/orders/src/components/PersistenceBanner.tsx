import { isPersistent } from "@/lib/store";

/**
 * States the storage reality plainly. In production this must be green: the
 * storefront and the admin dashboard share one Postgres database, and only
 * then does advancing an order in admin show up on the customer's tracking
 * page. If POSTGRES_URL is missing the two apps run on separate in-memory
 * stores and are disconnected, so the banner goes RED, not amber — this is a
 * broken state for these two apps, not a soft fallback.
 */
export function PersistenceBanner() {
  if (isPersistent) {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-[var(--color-success)]/30 bg-[var(--color-success)]/10 px-4 py-2.5 font-mono text-[11px] tracking-wide text-[var(--color-success)]">
        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-success)]" />
        Demo store for Kahwa Supply, a fictional roaster. All products, customers, and orders are seeded fiction. Demo data resets nightly.
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-2.5 font-mono text-[11px] tracking-wide text-[var(--color-danger)]">
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-danger)]" />
      No database configured — storefront and admin are disconnected in this mode. Order tracking will not reflect admin changes. Set POSTGRES_URL.
    </div>
  );
}
