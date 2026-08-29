"use client";

import type { CreateCategoryRequest } from "@gestor-finanzas/contracts";
import {
  Button,
  Field,
  Heading,
  Input,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Text,
} from "@gestor-finanzas/ui";
import { useCategoryForm } from "../hooks/use-category-form";

export type CategoryFormMode = "create" | "edit";

export type CategoryFormProps = {
  errorMessage?: string;
  initialValues?: CreateCategoryRequest;
  isSubmitting: boolean;
  mode?: CategoryFormMode;
  onSubmit: (values: CreateCategoryRequest) => Promise<void>;
  successMessage?: string;
};

export function CategoryForm({
  errorMessage,
  initialValues,
  isSubmitting,
  mode = "create",
  onSubmit,
  successMessage,
}: CategoryFormProps) {
  const form = useCategoryForm(initialValues);
  const errors = form.formState.errors;

  async function submit(values: CreateCategoryRequest) {
    try {
      await onSubmit(values);
      if (mode === "create") form.reset();
    } catch {
      // La mutación conserva el formulario y expone el error público por props.
    }
  }

  return (
    <form
      noValidate
      onSubmit={(event) => void form.handleSubmit(submit)(event)}
    >
      <ModalHeader>
        <Heading id="category-form-title" level={2} variant="section">
          {mode === "edit" ? "Editar categoría" : "Nueva categoría"}
        </Heading>
        <Text variant="small" tone="muted">
          Clasifica los ingresos y gastos que registrarás más adelante.
        </Text>
      </ModalHeader>

      <ModalContent className="grid gap-[var(--ui-space-5)]">
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
            autoFocus
            maxLength={100}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={
              errors.name ? "category-name-error" : "category-name-description"
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

        <div aria-live="polite">
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
      </ModalContent>

      <ModalFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando…"
            : mode === "edit"
              ? "Guardar cambios"
              : "Guardar categoría"}
        </Button>
      </ModalFooter>
    </form>
  );
}
