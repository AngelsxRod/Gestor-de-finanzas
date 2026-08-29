"use client";

import type { CreateAccountRequest } from "@gestor-finanzas/contracts";
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
import { useAccountForm } from "../hooks/use-account-form";

export type AccountFormProps = {
  errorMessage?: string;
  isSubmitting: boolean;
  onSubmit: (values: CreateAccountRequest) => Promise<void>;
  successMessage?: string;
};

export function AccountForm({
  errorMessage,
  isSubmitting,
  onSubmit,
  successMessage,
}: AccountFormProps) {
  const form = useAccountForm();
  const errors = form.formState.errors;

  async function submit(values: CreateAccountRequest) {
    try {
      await onSubmit(values);
      form.reset();
    } catch {
      // The mutation exposes its public error message through props.
    }
  }

  return (
    <Panel aria-labelledby="account-form-title">
      <PanelHeader className="grid gap-[var(--ui-space-2)]">
        <Heading id="account-form-title" level={2} variant="section">
          Nueva cuenta
        </Heading>
        <Text variant="small" tone="muted">
          Registra dónde administras tu dinero y su saldo de apertura.
        </Text>
      </PanelHeader>

      <PanelContent>
        <form
          className="grid gap-[var(--ui-space-5)]"
          noValidate
          onSubmit={(event) => void form.handleSubmit(submit)(event)}
        >
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
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name
                  ? "account-name-error"
                  : "account-name-description"
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

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando…" : "Guardar cuenta"}
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
