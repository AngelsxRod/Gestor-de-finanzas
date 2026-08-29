import type { ComponentProps } from "react";

export type PanelVariant = "default" | "flat";

export type PanelProps = ComponentProps<"section"> & {
  variant?: PanelVariant;
};
export type PanelHeaderProps = ComponentProps<"header">;
export type PanelContentProps = ComponentProps<"div">;

const variantClasses: Record<PanelVariant, string> = {
  default:
    "border border-[var(--ui-color-border)] shadow-[var(--ui-shadow-panel)]",
  flat: "",
};

export function Panel({
  className = "",
  variant = "default",
  ...props
}: PanelProps) {
  return (
    <section
      className={`rounded-[var(--ui-radius-panel)] bg-[var(--ui-color-surface)] p-[var(--ui-space-6)] ${variantClasses[variant]} ${className}`}
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
