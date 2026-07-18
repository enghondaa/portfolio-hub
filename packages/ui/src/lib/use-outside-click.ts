"use client";

import { useEffect, type RefObject } from "react";

/**
 * Calls `handler` when a pointer event lands outside the referenced element.
 *
 * Listens on mousedown and touchstart rather than click: by the time click
 * fires the element may already have been removed from the DOM, so the
 * containment check would wrongly report "outside".
 */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return;

    function listener(event: MouseEvent | TouchEvent) {
      const element = ref.current;
      if (!element || element.contains(event.target as Node)) return;
      handler(event);
    }

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}
