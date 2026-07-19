"use client";

import { useState } from "react";

export function CopyOrderNumber({ orderNumber }: { orderNumber: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(orderNumber);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          setCopied(false);
        }
      }}
      className="rounded-full border border-[var(--color-neutral-200)] px-5 py-2 font-mono text-xs text-[var(--color-neutral-700)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
    >
      {copied ? "Copied ✓" : "Copy number"}
    </button>
  );
}
