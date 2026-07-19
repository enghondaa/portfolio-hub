"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ACCOUNTS = [
  { label: "Owner", email: "owner@demo", note: "Full access — advance, cancel, edit products" },
  { label: "Staff", email: "staff@demo", note: "Read + status updates. No cancel, no product edits" },
];

export function LoginForm({ from, demoPassword }: { from?: string; demoPassword: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(withEmail: string, withPassword: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: withEmail, password: withPassword }),
      });
      const payload = await res.json().catch(() => null);
      if (res.ok) {
        router.push(from && from.startsWith("/admin") ? from : "/admin");
        router.refresh();
        return;
      }
      setError(payload?.error ?? "Sign-in failed.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {ACCOUNTS.map((acc) => (
          <button
            key={acc.email}
            type="button"
            disabled={busy}
            onClick={() => submit(acc.email, demoPassword)}
            className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-4 text-left transition-all hover:border-[var(--color-accent)] hover:shadow-[0_10px_28px_-18px_rgba(79,70,229,0.7)] disabled:opacity-60"
          >
            <p className="font-[family-name:var(--font-heading)] font-semibold text-[var(--color-neutral-800)]">
              Sign in as {acc.label}
            </p>
            <p className="mt-1 font-mono text-[10px] text-[var(--color-neutral-400)]">{acc.email}</p>
            <p className="mt-2 text-xs leading-relaxed text-[var(--color-neutral-600)]">{acc.note}</p>
          </button>
        ))}
      </div>

      <p className="mt-4 text-center font-mono text-[11px] text-[var(--color-neutral-500)]">
        one-click above, or sign in manually — password: <span className="text-[var(--color-accent)]">{demoPassword}</span>
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit(email, password);
        }}
        className="mt-4 space-y-3 rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-4"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="owner@demo"
          autoComplete="username"
          className="w-full rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          autoComplete="current-password"
          className="w-full rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-0)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-light)] disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        {error && (
          <p role="alert" className="text-center font-mono text-[11px] text-[var(--color-danger)]">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
