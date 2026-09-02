import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
}

/**
 * Labeled select built on the native <select> element, which gives full
 * keyboard support (arrow keys, type-ahead, Escape) for free across browsers
 * and screen readers, rather than reimplementing a custom listbox.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, id, className, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const messageId = `${selectId}-message`;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={selectId} className="text-sm font-medium text-[var(--color-neutral-800)]">
          {label}
        </label>
        {/*
          The chevron is ours, drawn over an appearance-none select.

          Left to itself the native control draws its own arrow, at a size and
          position the OS decides, jammed against the border with no padding
          reserved for it — which is what it was doing. appearance-none removes
          it, pr-10 reserves the space, and the svg below sits in that space
          with pointer-events-none so clicks still reach the select.

          The option list is still the browser's, and that is the trade: a
          native select keeps arrow keys, type-ahead and screen-reader support
          that a custom listbox has to reimplement. Where the popup itself has
          to be themed — a dark surface, say — that is the point to reach for a
          real listbox instead.
        */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? messageId : undefined}
            className={cn(
              "h-11 w-full appearance-none rounded-md border bg-[var(--color-neutral-0)] pl-3 pr-10 text-base text-[var(--color-neutral-800)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
              error ? "border-red-500" : "border-[var(--color-neutral-200)]",
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            className="pointer-events-none absolute right-3.5 top-1/2 h-3 w-3 -translate-y-1/2 text-[var(--color-neutral-600)]"
          >
            <path d="M2.5 4.5L6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {error && (
          <p id={messageId} className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
