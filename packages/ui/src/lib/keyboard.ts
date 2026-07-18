import type { KeyboardEvent as ReactKeyboardEvent } from "react";

/**
 * Keyboard constants and navigation helpers.
 *
 * Ported from the forge-ui-primitives project so every interactive component
 * in this monorepo compares against the same constants instead of scattering
 * string literals like " " (Space) that are easy to get subtly wrong.
 */
export const Keys = {
  Enter: "Enter",
  Space: " ",
  Escape: "Escape",
  Tab: "Tab",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown",
  Backspace: "Backspace",
  Delete: "Delete",
} as const;

export type Key = (typeof Keys)[keyof typeof Keys];

export function isKey(event: KeyboardEvent | ReactKeyboardEvent, key: Key): boolean {
  return event.key === key;
}

/** Next index, wrapping at the end. */
export function getNextIndex(currentIndex: number, length: number): number {
  if (length <= 0) return 0;
  return (currentIndex + 1) % length;
}

/** Previous index, wrapping at the start. */
export function getPrevIndex(currentIndex: number, length: number): number {
  if (length <= 0) return 0;
  return (currentIndex - 1 + length) % length;
}

export type Orientation = "horizontal" | "vertical" | "both";

/**
 * Roving tabindex navigation. Returns the index that should now be active,
 * or the current index unchanged when the key was not a navigation key —
 * which lets a caller pass every keydown through without pre-filtering.
 */
export function handleRovingTabIndex(
  event: ReactKeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  orientation: Orientation = "vertical"
): number {
  if (items.length === 0) return currentIndex;

  const isVertical = orientation === "vertical" || orientation === "both";
  const isHorizontal = orientation === "horizontal" || orientation === "both";

  let nextIndex = currentIndex;

  if (isVertical && event.key === Keys.ArrowDown) {
    nextIndex = getNextIndex(currentIndex, items.length);
  } else if (isVertical && event.key === Keys.ArrowUp) {
    nextIndex = getPrevIndex(currentIndex, items.length);
  } else if (isHorizontal && event.key === Keys.ArrowRight) {
    nextIndex = getNextIndex(currentIndex, items.length);
  } else if (isHorizontal && event.key === Keys.ArrowLeft) {
    nextIndex = getPrevIndex(currentIndex, items.length);
  } else if (event.key === Keys.Home) {
    nextIndex = 0;
  } else if (event.key === Keys.End) {
    nextIndex = items.length - 1;
  } else {
    return currentIndex;
  }

  event.preventDefault();
  items[nextIndex]?.focus();
  return nextIndex;
}
