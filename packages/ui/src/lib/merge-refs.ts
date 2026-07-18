import type { MutableRefObject, Ref, RefCallback } from "react";

/**
 * Merges several refs into one callback ref, so a component can forward a
 * ref to its consumer while still holding its own reference to the node.
 * Handles both callback refs and ref objects.
 */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (value: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as MutableRefObject<T | null>).current = value;
      }
    }
  };
}
