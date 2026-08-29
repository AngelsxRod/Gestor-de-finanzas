"use client";

import type { CreateCategoryRequest } from "@gestor-finanzas/contracts";
import {
  Button,
  Field,
  Heading,
  Input,
  Panel,
  PanelContent,
  PanelHeader,
  Select,
  Text,
} from "@gestor-finanzas/ui";
import { useCategoryForm } from "../hooks/use-category-form";

export type CategoryFormProps = {
  errorMessage?: string;
  isSubmitting: boolean;
  onSubmit: (values: CreateCategoryRequest) => Promise<void>;
  successMessage?: string;
};

export function CategoryForm({
  errorMessage,
  isSubmitting,
  onSubmit,
  successMessage,
}: CategoryFormProps) {
  const form = useCategoryForm();
  const errors = form.formState.errors;

  async function submit(values: CreateCategoryRequest) {
    try {
      await onSubmit(values);
      form.reset();
    } catch {
      // La mutación conserva el formulario y expone el error público por props.
    }
  }

  return (
    <Panel aria-labelledby="category-form-title">
      <PanelHeader className="grid gap-[var(--ui-space-2)]">
        <Heading id="category-form-title" level={2} variant="section">
          Nueva categoría
        </Heading>
        <Text variant="small" tone="muted">
          Clasifica los ingresos y gastos que registrarás más adelante.
        </Text>
      </PanelHeader>
      <PanelContent>
        <form
          className="grid gap-[var(--ui-space-5)]"
          noValidate
          onSubmit={(event) => void form.handleSubmit(submit)(event)}
        >
          <Field
            htmlFor="category-name"
            label="Nombre"
            description="Puede repetirse solo si pertenece al otro tipo."
            error={errors.name?.message}
            required
          >
            <Input
              id="category-name"
              autoComplete="off"
              maxLength={100}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name
                  ? "category-name-error"
                  : "category-name-description"
              }
              {...form.register("name")}
            />
          </Field>

          <Field htmlFor="category-type" label="Tipo" required>
            <Select id="category-type" {...form.register("type")}>
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
            </Select>
          </Field>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando…" : "Guardar categoría"}
          </Button>
        </form>

        <div className="mt-[var(--ui-space-4)]" aria-live="polite">
          {errorMessage ? (
            <Text role="alert" variant="small" tone="danger">
              {errorMessage}
            </Text>
          ) : null}
          {successMessage ? (
            <Text role="status" variant="small" tone="success">
              {successMessage}
            </Text>
          ) : null}
        </div>
      </PanelContent>
    </Panel>
  );
}
