import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label. Required — inputs without a label are not accessible. */
  label: string;
  /** Error message. When present, the input is marked aria-invalid and the message is associated via aria-describedby. */
  error?: string;
  /** Helper text shown below the input when there is no error. */
  helperText?: string;
}

/** Labeled text input with error and helper-text states. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-neutral-800)]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error || helperText ? messageId : undefined}
          className={cn(
            "h-11 rounded-md border bg-[var(--color-neutral-0)] px-3 text-base text-[var(--color-neutral-800)]",
            "placeholder:text-[var(--color-neutral-400)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
            error ? "border-red-500" : "border-[var(--color-neutral-200)]",
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p
            id={messageId}
            className={cn(
              "text-sm",
              error ? "text-red-600" : "text-[var(--color-neutral-600)]"
            )}
          >
            {error ?? helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
