import type { ComponentProps } from "react";

export type LabelProps = ComponentProps<"label">;

export function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={`text-[length:var(--ui-font-size-small)] font-medium text-[var(--ui-color-text)] ${className}`}
      {...props}
    />
  );
}
