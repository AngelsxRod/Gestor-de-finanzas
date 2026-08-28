import type { HTMLAttributes } from "react";

export type TextElement = "p" | "span" | "div";
export type TextVariant = "lead" | "body" | "small" | "caption";
export type TextTone = "default" | "muted" | "success" | "danger";

export type TextProps = HTMLAttributes<HTMLElement> & {
  as?: TextElement;
  tone?: TextTone;
  variant?: TextVariant;
};

const variantClasses: Record<TextVariant, string> = {
  lead:
    "text-[length:var(--ui-font-size-lead)] leading-[var(--ui-line-height-body)]",
  body:
    "text-[length:var(--ui-font-size-body)] leading-[var(--ui-line-height-body)]",
  small:
    "text-[length:var(--ui-font-size-small)] leading-[var(--ui-line-height-body)]",
  caption:
    "text-[length:var(--ui-font-size-caption)] leading-[var(--ui-line-height-body)]",
};

const toneClasses: Record<TextTone, string> = {
  default: "text-[var(--ui-color-text)]",
  muted: "text-[var(--ui-color-text-muted)]",
  success: "text-[var(--ui-color-success)]",
  danger: "text-[var(--ui-color-danger)]",
};

export function Text({
  as: Component = "p",
  className = "",
  tone = "default",
  variant = "body",
  ...props
}: TextProps) {
  return (
    <Component
      className={`${variantClasses[variant]} ${toneClasses[tone]} ${className}`}
      {...props}
    />
  );
}
