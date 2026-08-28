import type { ComponentProps } from "react";

export type PanelProps = ComponentProps<"section">;
export type PanelHeaderProps = ComponentProps<"header">;
export type PanelContentProps = ComponentProps<"div">;

export function Panel({ className = "", ...props }: PanelProps) {
  return (
    <section
      className={`rounded-[var(--ui-radius-panel)] border border-[var(--ui-color-border)] bg-[var(--ui-color-surface)] p-[var(--ui-space-6)] shadow-[var(--ui-shadow-panel)] ${className}`}
      {...props}
    />
  );
}

export function PanelHeader({ className = "", ...props }: PanelHeaderProps) {
  return <header className={`${className}`} {...props} />;
}

export function PanelContent({ className = "", ...props }: PanelContentProps) {
  return (
    <div
      className={`mt-[var(--ui-space-6)] ${className}`}
      {...props}
    />
  );
}
