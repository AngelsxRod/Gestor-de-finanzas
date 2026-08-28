import type { ReactNode } from "react";
import { Label } from "../atoms/label.js";
import { Text } from "../atoms/text.js";

export type FieldProps = {
  children: ReactNode;
  description?: string;
  error?: string;
  htmlFor: string;
  label: string;
  required?: boolean;
};

export function Field({
  children,
  description,
  error,
  htmlFor,
  label,
  required = false,
}: FieldProps) {
  return (
    <div className="grid gap-[var(--ui-space-2)]">
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </Label>
      {children}
      {description && !error ? (
        <Text id={`${htmlFor}-description`} variant="caption" tone="muted">
          {description}
        </Text>
      ) : null}
      {error ? (
        <Text
          id={`${htmlFor}-error`}
          variant="caption"
          tone="danger"
          role="alert"
        >
          {error}
        </Text>
      ) : null}
    </div>
  );
}
