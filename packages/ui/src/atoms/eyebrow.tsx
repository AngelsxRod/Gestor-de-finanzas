import type { HTMLAttributes } from "react";

export type EyebrowProps = HTMLAttributes<HTMLElement> & {
  as?: "p" | "span";
};

export function Eyebrow({
  as: Component = "p",
  className = "",
  ...props
}: EyebrowProps) {
  return (
    <Component
      className={`text-[length:var(--ui-font-size-small)] font-semibold uppercase tracking-[var(--ui-letter-spacing-eyebrow)] text-[var(--ui-color-text-muted)] ${className}`}
      {...props}
    />
  );
}
