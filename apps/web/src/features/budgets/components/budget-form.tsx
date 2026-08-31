"use client";

import type { Category, CreateBudgetRequest } from "@gestor-finanzas/contracts";
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
import { useBudgetForm } from "../hooks/use-budget-form";

function categoryOptionLabel(category: Category): string {
  return category.isActive ? category.name : `${category.name} — inactiva`;
}

export type BudgetFormMode = "create" | "edit";

export type BudgetFormProps = {
  categories: Category[];
  defaultValues: CreateBudgetRequest;
  errorMessage?: string;
  isSubmitting: boolean;
  mode?: BudgetFormMode;
  onSubmit: (values: CreateBudgetRequest) => Promise<void>;
  successMessage?: string;
};

export function BudgetForm({
  categories,
  defaultValues,
  errorMessage,
  isSubmitting,
  mode = "create",
  onSubmit,
  successMessage,
}: BudgetFormProps) {
  const form = useBudgetForm(defaultValues);
  const errors = form.formState.errors;
  const categoryId = form.watch("categoryId");

  const availableCategories = categories.filter(
    (category) =>
      category.type === "expense" &&
      (category.isActive || category.id === categoryId),
  );

  async function submit(values: CreateBudgetRequest) {
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
        <Heading id="budget-form-title" level={2} variant="section">
          {mode === "edit" ? "Editar presupuesto" : "Nuevo presupuesto"}
        </Heading>
        <Text variant="small" tone="muted">
          Define un límite mensual de gasto para una categoría.
        </Text>
      </ModalHeader>

      <ModalContent className="grid gap-[var(--ui-space-5)]">
        <Field
          htmlFor="budget-category"
          label="Categoría"
          description="Solo categorías de gasto."
          error={errors.categoryId?.message}
          required
        >
          <Select
            id="budget-category"
            aria-invalid={Boolean(errors.categoryId)}
            {...form.register("categoryId")}
          >
            <option value="">Selecciona una categoría</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {categoryOptionLabel(category)}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          htmlFor="budget-month"
          label="Mes"
          error={errors.month?.message}
          required
        >
          <Input
            id="budget-month"
            type="month"
            aria-invalid={Boolean(errors.month)}
            {...form.register("month")}
          />
        </Field>

        <div className="grid gap-[var(--ui-space-5)] sm:grid-cols-2">
          <Field
            htmlFor="budget-currency"
            label="Moneda"
            description="Código ISO de tres letras, como GTQ o USD."
            error={errors.currency?.message}
            required
          >
            <Input
              id="budget-currency"
              autoComplete="off"
              maxLength={3}
              aria-invalid={Boolean(errors.currency)}
              {...form.register("currency")}
            />
          </Field>

          <Field
            htmlFor="budget-limit-amount"
            label="Monto límite"
            description="Siempre positivo, hasta cuatro decimales."
            error={errors.limitAmount?.message}
            required
          >
            <Input
              id="budget-limit-amount"
              autoComplete="off"
              inputMode="decimal"
              aria-invalid={Boolean(errors.limitAmount)}
              {...form.register("limitAmount")}
            />
          </Field>
        </div>

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
              : "Guardar presupuesto"}
        </Button>
      </ModalFooter>
    </form>
  );
}
