import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary";

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--ui-color-primary)] text-[var(--ui-color-on-primary)] hover:bg-[var(--ui-color-primary-hover)]",
  secondary:
    "border border-[var(--ui-color-border)] bg-[var(--ui-color-surface)] text-[var(--ui-color-text)] hover:bg-[var(--ui-color-surface-subtle)]",
};

export function Button({
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center rounded-[var(--ui-radius-control)] px-[var(--ui-space-4)] py-[var(--ui-space-2)] text-[length:var(--ui-font-size-small)] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-color-focus)] disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
