import { ORDER_STATUS_LABELS, type OrderStatus } from "./types";

/**
 * The single source of truth for order status logic.
 *
 * Both the API route handlers and the admin UI consume this. The UI uses
 * `nextStatuses` to decide which buttons to render; the API uses
 * `assertTransition` to reject anything else. The rules are never restated
 * in either place, so the UI cannot drift from what the server enforces.
 */

/** The happy path, in order. Every status except `cancelled` appears here. */
const FULFILMENT_SEQUENCE: OrderStatus[] = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

/** Once an order reaches one of these it is finished and cannot move again. */
const TERMINAL_STATUSES: OrderStatus[] = ["delivered", "cancelled"];

/** Cancellation is only honest before the parcel has physically left. */
const CANCELLABLE_STATUSES: OrderStatus[] = ["placed", "confirmed", "packed"];

export function isTerminal(status: OrderStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

export function isCancellable(status: OrderStatus): boolean {
  return CANCELLABLE_STATUSES.includes(status);
}

/**
 * Every status this order may legally move to next.
 *
 * Returns an empty array for terminal statuses, which is what makes the
 * admin UI render no action buttons on a delivered or cancelled order
 * without needing its own copy of that rule.
 */
export function nextStatuses(current: OrderStatus): OrderStatus[] {
  if (isTerminal(current)) return [];

  const options: OrderStatus[] = [];

  const index = FULFILMENT_SEQUENCE.indexOf(current);
  const forward = index === -1 ? undefined : FULFILMENT_SEQUENCE[index + 1];
  if (forward) options.push(forward);

  if (isCancellable(current)) options.push("cancelled");

  return options;
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return nextStatuses(from).includes(to);
}

export class IllegalTransitionError extends Error {
  from: OrderStatus;
  to: OrderStatus;

  constructor(from: OrderStatus, to: OrderStatus, message: string) {
    super(message);
    this.name = "IllegalTransitionError";
    this.from = from;
    this.to = to;
  }
}

/**
 * Throws `IllegalTransitionError` with a message written for a human rather
 * than a stack trace, because it is surfaced verbatim in the API's 422 body.
 */
export function assertTransition(from: OrderStatus, to: OrderStatus): void {
  if (canTransition(from, to)) return;

  const fromLabel = ORDER_STATUS_LABELS[from];
  const toLabel = ORDER_STATUS_LABELS[to];

  if (from === to) {
    throw new IllegalTransitionError(from, to, `This order is already ${fromLabel.toLowerCase()}.`);
  }

  if (isTerminal(from)) {
    throw new IllegalTransitionError(
      from,
      to,
      `This order is ${fromLabel.toLowerCase()} and cannot be changed.`
    );
  }

  if (to === "cancelled") {
    throw new IllegalTransitionError(
      from,
      to,
      `An order cannot be cancelled once it is ${fromLabel.toLowerCase()} — it has already left us.`
    );
  }

  const allowed = nextStatuses(from).map((s) => ORDER_STATUS_LABELS[s]).join(" or ");
  throw new IllegalTransitionError(
    from,
    to,
    `Cannot move from ${fromLabel} straight to ${toLabel}. The next step is ${allowed}.`
  );
}
