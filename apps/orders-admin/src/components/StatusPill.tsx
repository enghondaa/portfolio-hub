import { ORDER_STATUS_LABELS, type OrderStatus } from "@portfolio/orders-core";

const TONE: Record<OrderStatus, { color: string; bg: string }> = {
  placed: { color: "var(--color-neutral-600)", bg: "var(--color-neutral-100)" },
  confirmed: { color: "var(--color-accent)", bg: "var(--color-accent-soft)" },
  packed: { color: "var(--color-accent)", bg: "var(--color-accent-soft)" },
  shipped: { color: "#0369a1", bg: "#e0f2fe" },
  out_for_delivery: { color: "var(--color-warning)", bg: "#fef3c7" },
  delivered: { color: "var(--color-success)", bg: "#dcfce7" },
  cancelled: { color: "var(--color-danger)", bg: "#fee2e2" },
};

export function StatusPill({ status }: { status: OrderStatus }) {
  const tone = TONE[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider"
      style={{ color: tone.color, background: tone.bg }}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
