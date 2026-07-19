import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { isPersistent, DEMO_PASSWORD } from "@/lib/store";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = { title: "Sign in — OrderFlow Admin" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  const session = await getSession();
  if (session) redirect("/admin");
  const { from } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-accent)]">/ orderflow admin</p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-[var(--color-neutral-800)]">
          Operator sign-in
        </h1>
        <p className="mt-2 text-sm text-[var(--color-neutral-600)]">
          Internal tool for Kahwa Supply. No self-registration — accounts are provisioned by an owner.
        </p>

        {!isPersistent && (
          <div className="mt-5 rounded-xl border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3 font-mono text-[11px] text-[var(--color-danger)]">
            No database configured — admin and storefront are disconnected in this mode. Set POSTGRES_URL.
          </div>
        )}

        <LoginForm from={from} demoPassword={DEMO_PASSWORD} />

        <p className="mt-6 text-center font-mono text-[11px] text-[var(--color-neutral-400)]">
          Seeded demo. Both accounts use the password shown above. Passwords are stored bcrypt-hashed.
        </p>
      </div>
    </div>
  );
}
