/**
 * Focus containment for modal surfaces.
 *
 * A dialog that does not trap focus lets Tab walk into the page behind it,
 * which for a keyboard or screen-reader user means losing the dialog without
 * any way of knowing where they went.
 */

export const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  "details > summary",
].join(", ");

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.closest("[hidden]") && !element.closest('[aria-hidden="true"]')
  );
}

export function getFocusBounds(container: HTMLElement): {
  first: HTMLElement | null;
  last: HTMLElement | null;
} {
  const focusable = getFocusableElements(container);
  return {
    first: focusable[0] ?? null,
    last: focusable[focusable.length - 1] ?? null,
  };
}

export interface FocusTrapOptions {
  initialFocus?: HTMLElement | null | undefined;
  returnFocus?: HTMLElement | null | undefined;
}

/**
 * Traps Tab within `container` and restores focus on release. Returns the
 * cleanup function, which is what a caller should return from useEffect.
 */
export function createFocusTrap(container: HTMLElement, options: FocusTrapOptions = {}): () => void {
  const previouslyFocused = options.returnFocus ?? (document.activeElement as HTMLElement | null);

  // Deferred a frame so the container has painted before focus moves into it.
  const frame = requestAnimationFrame(() => {
    const target = options.initialFocus ?? getFocusBounds(container).first;
    target?.focus();
  });

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== "Tab") return;

    const { first, last } = getFocusBounds(container);
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("keydown", handleKeyDown);

  return () => {
    cancelAnimationFrame(frame);
    document.removeEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => previouslyFocused?.focus());
  };
}
