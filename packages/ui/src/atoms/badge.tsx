import type { HTMLAttributes } from "react";

export type BadgeTone = "neutral" | "success" | "info";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral:
    "bg-[var(--ui-color-surface-subtle)] text-[var(--ui-color-text-muted)]",
  success:
    "bg-[var(--ui-color-success-indicator)]/15 text-[var(--ui-color-success)]",
  info: "bg-[var(--ui-color-primary)]/10 text-[var(--ui-color-primary)]",
};

export function Badge({
  className = "",
  tone = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-[var(--ui-space-2)] py-[var(--ui-space-1)] text-[length:var(--ui-font-size-caption)] font-medium ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}
