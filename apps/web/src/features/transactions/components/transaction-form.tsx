"use client";

import type {
  Account,
  Category,
  CreateTransactionRequest,
  TransactionType,
} from "@gestor-finanzas/contracts";
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
import {
  toCreateTransactionRequest,
  useTransactionForm,
  type TransactionFormValues,
} from "../hooks/use-transaction-form";

const transactionTypeLabels: Record<TransactionType, string> = {
  expense: "Gasto",
  income: "Ingreso",
  transfer: "Transferencia",
};

export function accountOptionLabel(account: Account): string {
  return account.isActive
    ? `${account.name} (${account.currency})`
    : `${account.name} (${account.currency}) — inactiva`;
}

export function categoryOptionLabel(category: Category): string {
  return category.isActive ? category.name : `${category.name} — inactiva`;
}

export type TransactionFormMode = "create" | "edit";

export type TransactionFormProps = {
  accounts: Account[];
  categories: Category[];
  errorMessage?: string;
  initialValues?: TransactionFormValues;
  isSubmitting: boolean;
  mode?: TransactionFormMode;
  onSubmit: (values: CreateTransactionRequest) => Promise<void>;
  successMessage?: string;
};

export function TransactionForm({
  accounts,
  categories,
  errorMessage,
  initialValues,
  isSubmitting,
  mode = "create",
  onSubmit,
  successMessage,
}: TransactionFormProps) {
  const form = useTransactionForm(initialValues);
  const errors = form.formState.errors;
  const type = form.watch("type");
  const accountId = form.watch("accountId");
  const categoryId = form.watch("categoryId");
  const transferAccountId = form.watch("transferAccountId");

  // An account/category deactivated after this movement was created must
  // stay selectable in its own field (so editing shows and keeps its real
  // value); it just won't appear as an option for anything else.
  const accountOptions = accounts.filter(
    (account) => account.isActive || account.id === accountId,
  );
  const transferCandidates = accounts.filter(
    (account) =>
      account.id !== accountId &&
      (account.isActive || account.id === transferAccountId),
  );
  const availableCategories = categories.filter(
    (category) =>
      category.type === type &&
      (category.isActive || category.id === categoryId),
  );

  async function submit(values: TransactionFormValues) {
    try {
      await onSubmit(toCreateTransactionRequest(values));
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
        <Heading id="transaction-form-title" level={2} variant="section">
          {mode === "edit" ? "Editar movimiento" : "Nuevo movimiento"}
        </Heading>
        <Text variant="small" tone="muted">
          Registra un ingreso, un gasto o una transferencia entre cuentas.
        </Text>
      </ModalHeader>

      <ModalContent className="grid gap-[var(--ui-space-5)]">
        <Field htmlFor="transaction-type" label="Tipo" required>
          <Select
            id="transaction-type"
            {...form.register("type", {
              onChange: () => {
                form.setValue("categoryId", "");
                form.setValue("transferAccountId", "");
              },
            })}
          >
            {(Object.keys(transactionTypeLabels) as TransactionType[]).map(
              (value) => (
                <option key={value} value={value}>
                  {transactionTypeLabels[value]}
                </option>
              ),
            )}
          </Select>
        </Field>

        <Field
          htmlFor="transaction-amount"
          label="Monto"
          description="Siempre positivo, hasta cuatro decimales."
          error={errors.amount?.message}
          required
        >
          <Input
            id="transaction-amount"
            autoComplete="off"
            autoFocus
            inputMode="decimal"
            aria-invalid={Boolean(errors.amount)}
            aria-describedby={
              errors.amount
                ? "transaction-amount-error"
                : "transaction-amount-description"
            }
            {...form.register("amount")}
          />
        </Field>

        <Field
          htmlFor="transaction-account"
          label={type === "transfer" ? "Cuenta de origen" : "Cuenta"}
          error={errors.accountId?.message}
          required
        >
          <Select
            id="transaction-account"
            aria-invalid={Boolean(errors.accountId)}
            {...form.register("accountId", {
              onChange: () => form.setValue("transferAccountId", ""),
            })}
          >
            <option value="">Selecciona una cuenta</option>
            {accountOptions.map((account) => (
              <option key={account.id} value={account.id}>
                {accountOptionLabel(account)}
              </option>
            ))}
          </Select>
        </Field>

        {type === "transfer" ? (
          <Field
            htmlFor="transaction-transfer-account"
            label="Cuenta destino"
            error={errors.transferAccountId?.message}
            required
          >
            <Select
              id="transaction-transfer-account"
              aria-invalid={Boolean(errors.transferAccountId)}
              {...form.register("transferAccountId")}
            >
              <option value="">Selecciona la cuenta destino</option>
              {transferCandidates.map((account) => (
                <option key={account.id} value={account.id}>
                  {accountOptionLabel(account)}
                </option>
              ))}
            </Select>
          </Field>
        ) : (
          <Field
            htmlFor="transaction-category"
            label="Categoría"
            error={errors.categoryId?.message}
            required
          >
            <Select
              id="transaction-category"
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
        )}

        <Field
          htmlFor="transaction-occurred-at"
          label="Fecha y hora"
          error={errors.occurredAt?.message}
          required
        >
          <Input
            id="transaction-occurred-at"
            type="datetime-local"
            aria-invalid={Boolean(errors.occurredAt)}
            {...form.register("occurredAt")}
          />
        </Field>

        <Field
          htmlFor="transaction-notes"
          label="Notas"
          description="Opcional, hasta 280 caracteres."
          error={errors.notes?.message}
        >
          <Input
            id="transaction-notes"
            autoComplete="off"
            maxLength={280}
            {...form.register("notes")}
          />
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
              : "Guardar movimiento"}
        </Button>
      </ModalFooter>
    </form>
  );
}
