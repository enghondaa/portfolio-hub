import { type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Renders a slightly stronger border/shadow, for emphasis. */
  emphasized?: boolean;
}

/** Plain content container: neutral surface, one border, no drop shadows by default. */
export function Card({ className, emphasized = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-[var(--color-neutral-0)] p-6",
        "border-[var(--color-neutral-200)]",
        emphasized && "shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-[var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--color-neutral-800)]",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-[var(--color-neutral-600)]", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-[var(--color-neutral-800)]", className)} {...props} />;
}
