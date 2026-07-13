"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  /** Controlled active tab id. If omitted, Tabs manages its own state. */
  activeId?: string;
  onChange?: (id: string) => void;
  className?: string;
}

/**
 * Accessible tabs with roving tabindex: arrow keys move focus and selection
 * between tabs, Home/End jump to the first/last tab, per the WAI-ARIA
 * authoring practices for the tabs pattern.
 */
export function Tabs({ tabs, activeId, onChange, className }: TabsProps) {
  const baseId = useId();
  const [internalActive, setInternalActive] = useState(tabs[0]?.id);
  const active = activeId ?? internalActive;

  const setActive = (id: string) => {
    setInternalActive(id);
    onChange?.(id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === active);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;

    if (nextIndex !== null) {
      const nextTab = tabs[nextIndex];
      if (!nextTab) return;
      event.preventDefault();
      setActive(nextTab.id);
      document.getElementById(`${baseId}-tab-${nextTab.id}`)?.focus();
    }
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Tabs"
        onKeyDown={handleKeyDown}
        className="flex gap-1 border-b border-[var(--color-neutral-200)]"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              id={`${baseId}-tab-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                isActive
                  ? "border-[var(--color-accent)] text-[var(--color-neutral-800)]"
                  : "border-transparent text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-800)]"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== active}
          tabIndex={0}
          className="pt-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
