"use client";

import type { CreateAccountRequest } from "@gestor-finanzas/contracts";
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
import { useAccountForm } from "../hooks/use-account-form";

export type AccountFormMode = "create" | "edit";

export type AccountFormProps = {
  errorMessage?: string;
  initialValues?: CreateAccountRequest;
  isSubmitting: boolean;
  mode?: AccountFormMode;
  onSubmit: (values: CreateAccountRequest) => Promise<void>;
  successMessage?: string;
};

export function AccountForm({
  errorMessage,
  initialValues,
  isSubmitting,
  mode = "create",
  onSubmit,
  successMessage,
}: AccountFormProps) {
  const form = useAccountForm(initialValues);
  const errors = form.formState.errors;

  async function submit(values: CreateAccountRequest) {
    try {
      await onSubmit(values);
      if (mode === "create") form.reset();
    } catch {
      // The mutation exposes its public error message through props.
    }
  }

  return (
    <form
      noValidate
      onSubmit={(event) => void form.handleSubmit(submit)(event)}
    >
      <ModalHeader>
        <Heading id="account-form-title" level={2} variant="section">
          {mode === "edit" ? "Editar cuenta" : "Nueva cuenta"}
        </Heading>
        <Text variant="small" tone="muted">
          Registra dónde administras tu dinero y su saldo de apertura.
        </Text>
      </ModalHeader>

      <ModalContent className="grid gap-[var(--ui-space-5)]">
        <Field
          htmlFor="account-name"
          label="Nombre"
          description="Debe ser único, por ejemplo: Cuenta principal."
          error={errors.name?.message}
          required
        >
          <Input
            id="account-name"
            autoComplete="off"
            autoFocus
            aria-invalid={Boolean(errors.name)}
            aria-describedby={
              errors.name ? "account-name-error" : "account-name-description"
            }
            {...form.register("name")}
          />
        </Field>

        <Field htmlFor="account-type" label="Tipo" required>
          <Select id="account-type" {...form.register("type")}>
            <option value="cash">Efectivo</option>
            <option value="checking">Cuenta corriente</option>
            <option value="savings">Ahorro</option>
            <option value="credit">Crédito</option>
            <option value="investment">Inversión</option>
          </Select>
        </Field>

        <div className="grid gap-[var(--ui-space-5)] sm:grid-cols-2">
          <Field
            htmlFor="account-currency"
            label="Moneda"
            description="Código ISO de tres letras, como GTQ o USD."
            error={errors.currency?.message}
            required
          >
            <Input
              id="account-currency"
              autoComplete="off"
              maxLength={3}
              aria-invalid={Boolean(errors.currency)}
              aria-describedby={
                errors.currency
                  ? "account-currency-error"
                  : "account-currency-description"
              }
              {...form.register("currency")}
            />
          </Field>

          <Field
            htmlFor="account-opening-balance"
            label="Saldo inicial"
            description="Hasta cuatro decimales; puede ser negativo."
            error={errors.openingBalance?.message}
            required
          >
            <Input
              id="account-opening-balance"
              autoComplete="off"
              inputMode="decimal"
              aria-invalid={Boolean(errors.openingBalance)}
              aria-describedby={
                errors.openingBalance
                  ? "account-opening-balance-error"
                  : "account-opening-balance-description"
              }
              {...form.register("openingBalance")}
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
              : "Guardar cuenta"}
        </Button>
      </ModalFooter>
    </form>
  );
}
