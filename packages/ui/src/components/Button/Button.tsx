import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ElementType, type Ref } from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface SharedProps {
  /** Visual style. Defaults to "primary". */
  variant?: ButtonVariant;
  /** Size affects padding and font size. Defaults to "md". */
  size?: ButtonSize;
  /** Shows a loading spinner and disables the button. Ignored when `href` is set. */
  isLoading?: boolean;
  /** Render as a link instead of a <button> — same look, navigates instead of firing an onClick. */
  href?: string;
  /** Adds a small arrow after the label that slides right on hover. */
  arrow?: boolean;
}

export type ButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedProps> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedProps>;

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-base",
  lg: "h-12 px-6 text-lg",
};

// Primary gets a hand-drawn offset "shadow" block the button presses into on
// hover/click — deliberately not a flat, default-Tailwind filled button.
// Secondary is a plain underlined text link (never a gray fill — a filled
// gray button reads as disabled). Ghost is unstyled text, no underline
// until hover.
const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-[var(--color-accent)] text-[var(--color-neutral-0)]",
    "before:absolute before:inset-0 before:-z-10 before:content-[''] before:translate-x-[4px] before:translate-y-[4px] before:bg-[var(--color-neutral-800)] before:transition-transform before:duration-150 before:ease-out",
    "hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[1px] active:translate-y-[1px]",
    "transition-transform duration-150 ease-out"
  ),
  secondary: cn(
    "!h-auto !px-0 bg-transparent text-[var(--color-neutral-800)]",
    "underline decoration-1 underline-offset-4 decoration-[var(--color-neutral-400)]",
    "hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)]"
  ),
  ghost: "bg-transparent text-[var(--color-neutral-800)] underline-offset-4 hover:underline",
};

/**
 * Base button. Renders a native <button> by default, keyboard accessible
 * with a visible focus ring; pass `href` to render the same look as an <a>
 * for navigation instead of an action.
 */
export const Button = forwardRef<HTMLElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading = false, disabled, children, href, arrow = false, ...props },
    ref
  ) => {
    const classes = cn(
      "group relative inline-flex items-center justify-center gap-2 rounded-md font-medium",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-neutral-0)]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      variantClasses[variant],
      variant === "secondary" ? "" : sizeClasses[size],
      className
    );

    const spinner = isLoading && (
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      />
    );

    const arrowSpan = arrow && (
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-150 ease-out group-hover:translate-x-1"
      >
        →
      </span>
    );

    if (href) {
      const Anchor = "a" as ElementType;
      return (
        <Anchor ref={ref as Ref<HTMLAnchorElement>} href={href} className={classes} {...props}>
          {spinner}
          {children}
          {arrowSpan}
        </Anchor>
      );
    }

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        aria-busy={isLoading || undefined}
        disabled={disabled || isLoading}
        className={classes}
        {...props}
      >
        {spinner}
        {children}
        {arrowSpan}
      </button>
    );
  }
);

Button.displayName = "Button";
