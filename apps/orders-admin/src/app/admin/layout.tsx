import Link from "next/link";
import { getSession } from "@/lib/session";
import { isPersistent } from "@/lib/store";
import { LogoutButton } from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--color-neutral-200)] bg-[rgba(238,241,246,0.85)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-[var(--color-neutral-800)]">
              OrderFlow<span className="text-[var(--color-accent)]">.</span>
            </Link>
            <nav className="flex items-center gap-4 font-mono text-xs">
              <Link href="/admin" className="text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-accent)]">Overview</Link>
              <Link href="/admin/orders" className="text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-accent)]">Orders</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {session && (
              <span className="hidden font-mono text-[11px] text-[var(--color-neutral-600)] sm:inline">
                {session.name} · <span className="uppercase text-[var(--color-accent)]">{session.role}</span>
              </span>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>

      {!isPersistent && (
        <div className="border-b border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10">
          <div className="mx-auto max-w-6xl px-5 py-2 font-mono text-[11px] text-[var(--color-danger)] sm:px-6">
            No database configured — admin and storefront are disconnected. Status changes here will not reach the customer tracking page. Set POSTGRES_URL.
          </div>
        </div>
      )}

      <main className="flex-1">{children}</main>
    </div>
  );
}
