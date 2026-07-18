"use client";

import { useCallback, useRef, useState } from "react";

export interface UseControllableStateParams<T> {
  /** Supplied by the consumer to drive the component from outside. */
  value?: T | undefined;
  /** Starting value when the component manages its own state. */
  defaultValue?: T | undefined;
  onChange?: ((value: T) => void) | undefined;
}

/**
 * Lets one component support both controlled and uncontrolled use, which is
 * the difference between a component that fits into someone else's form and
 * one that only works the way its author happened to wire it.
 *
 * Warns in development if a component flips between the two, because that
 * silently discards state and is otherwise very hard to spot.
 */
export function useControllableState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): [T | undefined, (next: T) => void] {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<T | undefined>(defaultValue);

  const wasControlled = useRef(isControlled);
  if (process.env.NODE_ENV !== "production" && wasControlled.current !== isControlled) {
    console.warn(
      `[portfolio/ui] A component switched from ${wasControlled.current ? "controlled" : "uncontrolled"} ` +
        `to ${isControlled ? "controlled" : "uncontrolled"}. Pick one for the lifetime of the component.`
    );
  }

  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolledValue(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [value, setValue];
}
