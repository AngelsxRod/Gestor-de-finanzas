"use client";

import {
  Button,
  Field,
  Heading,
  Input,
  Panel,
  PanelContent,
  PanelHeader,
  Text,
} from "@gestor-finanzas/ui";
import { useState } from "react";
import { useArchitectureDemoForm } from "../hooks/use-architecture-demo-form";
import type { DemoFormValues } from "../schemas/demo-form-schema";

export function DemoFormPanel() {
  const form = useArchitectureDemoForm();
  const [preview, setPreview] = useState<DemoFormValues | null>(null);
  const conceptError = form.formState.errors.concept?.message;
  const amountError = form.formState.errors.amount?.message;

  return (
    <Panel aria-labelledby="demo-form-title">
      <PanelHeader className="grid gap-[var(--ui-space-2)]">
        <Heading id="demo-form-title" level={2} variant="section">
          Formulario de validación
        </Heading>
        <Text variant="small" tone="muted">
          Ejemplo local con React Hook Form y Zod. No guarda información.
        </Text>
      </PanelHeader>

      <PanelContent>
        <form
          className="grid gap-[var(--ui-space-5)]"
          noValidate
          onSubmit={form.handleSubmit((values) => setPreview(values))}
        >
          <Field
            htmlFor="concept"
            label="Concepto"
            description="Una descripción breve para el movimiento de ejemplo."
            error={conceptError}
            required
          >
            <Input
              id="concept"
              autoComplete="off"
              aria-invalid={Boolean(conceptError)}
              aria-describedby={
                conceptError ? "concept-error" : "concept-description"
              }
              {...form.register("concept")}
            />
          </Field>

          <Field
            htmlFor="amount"
            label="Monto"
            description="Debe ser un número mayor que cero."
            error={amountError}
            required
          >
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              aria-invalid={Boolean(amountError)}
              aria-describedby={
                amountError ? "amount-error" : "amount-description"
              }
              {...form.register("amount", { valueAsNumber: true })}
            />
          </Field>

          <Button type="submit">Validar formulario</Button>
        </form>

        {preview ? (
          <div
            className="mt-[var(--ui-space-5)] rounded-[var(--ui-radius-control)] bg-[var(--ui-color-surface-subtle)] p-[var(--ui-space-4)]"
            aria-live="polite"
          >
            <Text variant="small" className="font-medium">
              Datos válidos
            </Text>
            <Text variant="small" className="mt-[var(--ui-space-1)]">
              {preview.concept}: {preview.amount.toLocaleString("es-GT", {
                style: "currency",
                currency: "GTQ",
              })}
            </Text>
          </div>
        ) : null}
      </PanelContent>
    </Panel>
  );
}
