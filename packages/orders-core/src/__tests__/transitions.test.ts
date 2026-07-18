import {
  assertTransition,
  canTransition,
  IllegalTransitionError,
  isCancellable,
  isTerminal,
  nextStatuses,
} from "../transitions";
import { ORDER_STATUSES, type OrderStatus } from "../types";

const HAPPY_PATH: OrderStatus[] = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

describe("nextStatuses", () => {
  it("offers the next fulfilment step for every non-terminal status", () => {
    for (let i = 0; i < HAPPY_PATH.length - 1; i++) {
      const current = HAPPY_PATH[i] as OrderStatus;
      const expected = HAPPY_PATH[i + 1] as OrderStatus;
      expect(nextStatuses(current)).toContain(expected);
    }
  });

  it("offers cancellation only before dispatch", () => {
    expect(nextStatuses("placed")).toContain("cancelled");
    expect(nextStatuses("confirmed")).toContain("cancelled");
    expect(nextStatuses("packed")).toContain("cancelled");

    expect(nextStatuses("shipped")).not.toContain("cancelled");
    expect(nextStatuses("out_for_delivery")).not.toContain("cancelled");
  });

  it("offers nothing at all from a terminal status", () => {
    expect(nextStatuses("delivered")).toEqual([]);
    expect(nextStatuses("cancelled")).toEqual([]);
  });
});

describe("canTransition — the full matrix", () => {
  it("accepts every legal transition", () => {
    for (let i = 0; i < HAPPY_PATH.length - 1; i++) {
      expect(canTransition(HAPPY_PATH[i] as OrderStatus, HAPPY_PATH[i + 1] as OrderStatus)).toBe(true);
    }
    expect(canTransition("placed", "cancelled")).toBe(true);
    expect(canTransition("confirmed", "cancelled")).toBe(true);
    expect(canTransition("packed", "cancelled")).toBe(true);
  });

  it("rejects every transition not explicitly allowed", () => {
    const legal = new Set<string>();
    for (let i = 0; i < HAPPY_PATH.length - 1; i++) {
      legal.add(`${HAPPY_PATH[i]}->${HAPPY_PATH[i + 1]}`);
    }
    legal.add("placed->cancelled");
    legal.add("confirmed->cancelled");
    legal.add("packed->cancelled");

    for (const from of ORDER_STATUSES) {
      for (const to of ORDER_STATUSES) {
        const isLegal = legal.has(`${from}->${to}`);
        expect(canTransition(from, to)).toBe(isLegal);
      }
    }
  });

  it("never allows skipping a step", () => {
    expect(canTransition("placed", "shipped")).toBe(false);
    expect(canTransition("placed", "delivered")).toBe(false);
    expect(canTransition("confirmed", "out_for_delivery")).toBe(false);
    expect(canTransition("packed", "delivered")).toBe(false);
  });

  it("never allows moving backwards", () => {
    expect(canTransition("shipped", "packed")).toBe(false);
    expect(canTransition("delivered", "shipped")).toBe(false);
    expect(canTransition("confirmed", "placed")).toBe(false);
  });

  it("never allows a status to repeat itself", () => {
    for (const status of ORDER_STATUSES) {
      expect(canTransition(status, status)).toBe(false);
    }
  });

  it("never allows anything to move out of a terminal status", () => {
    for (const to of ORDER_STATUSES) {
      expect(canTransition("delivered", to)).toBe(false);
      expect(canTransition("cancelled", to)).toBe(false);
    }
  });
});

describe("assertTransition", () => {
  it("stays silent on a legal move", () => {
    expect(() => assertTransition("placed", "confirmed")).not.toThrow();
    expect(() => assertTransition("packed", "cancelled")).not.toThrow();
  });

  it("throws IllegalTransitionError carrying both statuses", () => {
    try {
      assertTransition("placed", "delivered");
      throw new Error("expected assertTransition to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(IllegalTransitionError);
      const typed = error as IllegalTransitionError;
      expect(typed.from).toBe("placed");
      expect(typed.to).toBe("delivered");
    }
  });

  it("explains a repeat rather than saying it is illegal", () => {
    expect(() => assertTransition("shipped", "shipped")).toThrow(/already shipped/i);
  });

  it("explains that a finished order cannot change", () => {
    expect(() => assertTransition("delivered", "shipped")).toThrow(/cannot be changed/i);
    expect(() => assertTransition("cancelled", "confirmed")).toThrow(/cannot be changed/i);
  });

  it("explains why a dispatched order cannot be cancelled", () => {
    expect(() => assertTransition("shipped", "cancelled")).toThrow(/already left us/i);
    expect(() => assertTransition("out_for_delivery", "cancelled")).toThrow(/already left us/i);
  });

  it("names the actual next step when a step is skipped", () => {
    expect(() => assertTransition("placed", "shipped")).toThrow(/next step is Confirmed/i);
  });
});

describe("status predicates", () => {
  it("classifies terminal statuses", () => {
    expect(isTerminal("delivered")).toBe(true);
    expect(isTerminal("cancelled")).toBe(true);
    expect(isTerminal("placed")).toBe(false);
    expect(isTerminal("shipped")).toBe(false);
  });

  it("classifies cancellable statuses", () => {
    expect(isCancellable("placed")).toBe(true);
    expect(isCancellable("packed")).toBe(true);
    expect(isCancellable("shipped")).toBe(false);
    expect(isCancellable("delivered")).toBe(false);
  });
});
