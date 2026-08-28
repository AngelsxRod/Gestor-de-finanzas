import type { HTMLAttributes } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingVariant =
  | "display"
  | "title"
  | "section"
  | "subsection";

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level: HeadingLevel;
  variant?: HeadingVariant;
};

const variantClasses: Record<HeadingVariant, string> = {
  display:
    "text-[length:var(--ui-font-size-display)] leading-[var(--ui-line-height-tight)] tracking-[var(--ui-letter-spacing-tight)]",
  title:
    "text-[length:var(--ui-font-size-title)] leading-[var(--ui-line-height-tight)] tracking-[var(--ui-letter-spacing-tight)]",
  section:
    "text-[length:var(--ui-font-size-section)] leading-[var(--ui-line-height-tight)]",
  subsection:
    "text-[length:var(--ui-font-size-subsection)] leading-[var(--ui-line-height-tight)]",
};

export function Heading({
  className = "",
  level,
  variant = "section",
  ...props
}: HeadingProps) {
  const Component = `h${level}` as const;

  return (
    <Component
      className={`font-semibold text-[var(--ui-color-text)] ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
