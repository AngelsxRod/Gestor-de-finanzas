import type { ReactNode } from "react";
import { Text } from "../atoms/text.js";
import { Panel } from "./panel.js";

export type MetricCardProps = {
  action?: ReactNode;
  description?: ReactNode;
  label: string;
  value: ReactNode;
};

export function MetricCard({
  action,
  description,
  label,
  value,
}: MetricCardProps) {
  return (
    <Panel className="grid gap-[var(--ui-space-2)]">
      <Text as="p" variant="small" tone="muted">
        {label}
      </Text>
      <Text
        as="p"
        variant="lead"
        className="text-[length:var(--ui-font-size-title)] font-semibold text-[var(--ui-color-text)]"
      >
        {value}
      </Text>
      {description ? (
        <Text as="p" variant="caption" tone="muted">
          {description}
        </Text>
      ) : null}
      {action ? <div>{action}</div> : null}
    </Panel>
  );
}
