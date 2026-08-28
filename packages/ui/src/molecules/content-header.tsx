import type { ReactNode } from "react";
import { Eyebrow } from "../atoms/eyebrow.js";
import {
  Heading,
  type HeadingLevel,
  type HeadingVariant,
} from "../atoms/heading.js";
import { Text } from "../atoms/text.js";

export type ContentHeaderProps = {
  description?: ReactNode;
  eyebrow?: ReactNode;
  level: HeadingLevel;
  title: ReactNode;
  titleId?: string;
  variant?: HeadingVariant;
};

export function ContentHeader({
  description,
  eyebrow,
  level,
  title,
  titleId,
  variant = "section",
}: ContentHeaderProps) {
  return (
    <header className="grid gap-[var(--ui-space-2)]">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading id={titleId} level={level} variant={variant}>
        {title}
      </Heading>
      {description ? (
        <Text variant={variant === "display" ? "lead" : "small"} tone="muted">
          {description}
        </Text>
      ) : null}
    </header>
  );
}
