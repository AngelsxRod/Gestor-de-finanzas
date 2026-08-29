import type { ReactNode } from "react";
import { Heading, type HeadingLevel } from "../atoms/heading.js";
import { Text } from "../atoms/text.js";
import { Panel } from "./panel.js";

export type EmptyStateProps = {
  action?: ReactNode;
  description?: ReactNode;
  level: HeadingLevel;
  title: string;
};

export function EmptyState({
  action,
  description,
  level,
  title,
}: EmptyStateProps) {
  return (
    <Panel className="grid justify-items-start gap-[var(--ui-space-3)]">
      <Heading level={level} variant="section">
        {title}
      </Heading>
      {description ? (
        <Text tone="muted" variant="small">
          {description}
        </Text>
      ) : null}
      {action ? <div>{action}</div> : null}
    </Panel>
  );
}
