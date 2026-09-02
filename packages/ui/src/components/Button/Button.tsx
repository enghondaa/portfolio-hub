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
    // The offset block is a hard-edged box-shadow, not a ::before at -z-10.
    // A negative z-index only sends the pseudo-element behind the parent's
    // background while the parent creates no stacking context of its own — and
    // any transform, filter or opacity on the button creates one, at which
    // point -10 is clamped inside it and the block paints over the button
    // instead of under it. That is what the loading and disabled stories were
    // showing: a dark rectangle covering the control, offset down and right.
    // box-shadow is always painted behind the background, so there is nothing
    // to get wrong.
    "shadow-[4px_4px_0_0_var(--color-neutral-800)]",
    "transition-[transform,box-shadow] duration-150 ease-out"
  ),
  secondary: cn(
    "!h-auto !px-0 bg-transparent text-[var(--color-neutral-800)]",
    "underline decoration-1 underline-offset-4 decoration-[var(--color-neutral-400)]",
    "hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)]"
  ),
  ghost: "bg-transparent text-[var(--color-neutral-800)] underline-offset-4 hover:underline",
};

/**
 * The press movement, applied only while the button can actually be pressed.
 *
 * This is decided in JS rather than with a `disabled:` variant because CSS
 * `:hover` still matches a disabled button — the pointer events are suppressed
 * but the selector is not — so a `hover:` rule would keep lifting a button
 * nobody can click. Doing it here also covers the `href` form, which renders an
 * anchor and would never match `:disabled` at all.
 */
const pressClasses = cn(
  "hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_0_var(--color-neutral-800)]",
  "active:translate-x-[1px] active:translate-y-[1px] active:shadow-[3px_3px_0_0_var(--color-neutral-800)]"
);

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
    // `href` never renders a <button>, so it is never disabled; isLoading only
    // applies to the button form, which is what the prop doc already says.
    const isInactive = !href && (disabled || isLoading);

    const classes = cn(
      "group relative inline-flex items-center justify-center gap-2 rounded-md font-medium",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-neutral-0)]",
      // A control that cannot be pressed should not carry the affordance that
      // says it can, so the offset block goes flat rather than being faded.
      "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none",
      variantClasses[variant],
      isInactive ? "" : pressClasses,
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
