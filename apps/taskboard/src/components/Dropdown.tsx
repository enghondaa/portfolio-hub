"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Keys, useOutsideClick } from "@portfolio/ui";

export interface DropdownOption {
  value: string;
  label: string;
  /** Optional token-driven colour for a leading dot, e.g. "var(--color-danger)". */
  dot?: string;
}

/**
 * A custom listbox, built because a native <select> renders its option popup
 * through the operating system: on a dark surface the list comes out white and
 * cannot be themed by any CSS we ship. This reimplements the WAI-ARIA listbox
 * pattern so the panel is ours to style, while keeping the keyboard behaviour
 * a native select would have given for free.
 *
 * Keyboard: Up/Down to move, Home/End to jump, Enter or Space to choose,
 * Escape to dismiss, Tab to leave. Closing always returns focus to the trigger.
 *
 * Outside-click handling and the key constants come from @portfolio/ui's
 * behaviour primitives rather than being restated here.
 */
export function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const listboxId = useId();

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex] ?? options[0];

  const close = useCallback((returnFocus: boolean) => {
    setIsOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  }, []);

  const open = useCallback(() => {
    setActiveIndex(selectedIndex === -1 ? 0 : selectedIndex);
    setIsOpen(true);
  }, [selectedIndex]);

  // Dismiss on any pointer event outside the trigger and panel. The shared
  // hook also covers touchstart, which the hand-rolled version here missed.
  const dismiss = useCallback(() => setIsOpen(false), []);
  useOutsideClick(containerRef, dismiss, isOpen);

  // Move DOM focus onto the list so screen readers announce the active option.
  useEffect(() => {
    if (isOpen) listRef.current?.focus();
  }, [isOpen]);

  function commit(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    close(true);
  }

  function onListKeyDown(event: React.KeyboardEvent) {
    switch (event.key) {
      case Keys.ArrowDown:
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
        break;
      case Keys.ArrowUp:
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case Keys.Home:
        event.preventDefault();
        setActiveIndex(0);
        break;
      case Keys.End:
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case Keys.Enter:
      case Keys.Space:
        event.preventDefault();
        commit(activeIndex);
        break;
      case Keys.Escape:
        event.preventDefault();
        close(true);
        break;
      case Keys.Tab:
        close(false);
        break;
    }
  }

  function onTriggerKeyDown(event: React.KeyboardEvent) {
    if (event.key === Keys.ArrowDown || event.key === Keys.Enter || event.key === Keys.Space) {
      event.preventDefault();
      open();
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={() => (isOpen ? close(false) : open())}
        onKeyDown={onTriggerKeyDown}
        className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-[var(--color-neutral-200)] bg-[rgba(255,255,255,0.03)] px-3.5 py-2.5 font-mono text-xs uppercase tracking-wider text-[var(--color-neutral-700)] transition-colors duration-200 hover:border-[var(--color-accent)]/50 focus-visible:outline-none focus-visible:border-[var(--color-accent)] focus-visible:shadow-[0_0_0_3px_rgba(45,212,167,0.15)]"
      >
        <span className="flex items-center gap-2">
          {selected?.dot && (
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: selected.dot }} />
          )}
          {selected?.label ?? ""}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`h-3 w-3 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={label}
            aria-activedescendant={`${listboxId}-${activeIndex}`}
            tabIndex={-1}
            onKeyDown={onListKeyDown}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -6, scale: shouldReduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -6, scale: shouldReduceMotion ? 1 : 0.98 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 z-50 mt-2 min-w-full overflow-hidden rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] p-1 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.85)] focus:outline-none"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;
              return (
                <li
                  key={option.value}
                  id={`${listboxId}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commit(index)}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors duration-150 ${
                    isActive
                      ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                      : "text-[var(--color-neutral-700)]"
                  }`}
                >
                  {option.dot && (
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: option.dot }} />
                  )}
                  <span className="flex-1">{option.label}</span>
                  {isSelected && (
                    <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 shrink-0 text-[var(--color-accent)]">
                      <path d="M2.5 6.5L5 9l4.5-5.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
