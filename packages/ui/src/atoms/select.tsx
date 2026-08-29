import type { ComponentProps } from "react";

export type SelectProps = ComponentProps<"select">;

export function Select({ className = "", ...props }: SelectProps) {
  return (
    <select
      className={`min-h-10 w-full rounded-[var(--ui-radius-control)] border border-[var(--ui-color-border)] bg-[var(--ui-color-surface)] px-[var(--ui-space-3)] py-[var(--ui-space-2)] text-[length:var(--ui-font-size-small)] text-[var(--ui-color-text)] outline-none transition-shadow focus:border-[var(--ui-color-focus)] focus:ring-2 focus:ring-[var(--ui-color-focus)]/15 disabled:cursor-not-allowed disabled:bg-[var(--ui-color-surface-subtle)] disabled:opacity-70 aria-invalid:border-[var(--ui-color-danger)] aria-invalid:ring-[var(--ui-color-danger)]/15 ${className}`}
      {...props}
    />
  );
}
