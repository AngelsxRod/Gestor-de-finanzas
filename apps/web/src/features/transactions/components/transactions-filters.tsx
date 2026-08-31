"use client";

import type {
  Account,
  Category,
  TransactionType,
} from "@gestor-finanzas/contracts";
import {
  Button,
  Field,
  Input,
  Panel,
  PanelContent,
  Select,
} from "@gestor-finanzas/ui";
import type { TransactionFiltersValues } from "../hooks/use-transaction-filters";
import { accountOptionLabel, categoryOptionLabel } from "./transaction-form";

const transactionTypeLabels: Record<TransactionType, string> = {
  income: "Ingreso",
  expense: "Gasto",
  transfer: "Transferencia",
};

export type TransactionsFiltersProps = {
  accounts: Account[];
  categories: Category[];
  values: TransactionFiltersValues;
  onChange: <Field extends keyof TransactionFiltersValues>(
    field: Field,
    value: TransactionFiltersValues[Field],
  ) => void;
  onClear: () => void;
};

export function TransactionsFilters({
  accounts,
  categories,
  values,
  onChange,
  onClear,
}: TransactionsFiltersProps) {
  return (
    <Panel aria-labelledby="transactions-filters-title" variant="flat">
      <PanelContent>
        <h2 id="transactions-filters-title" className="sr-only">
          Filtros de movimientos
        </h2>
        <div className="grid gap-[var(--ui-space-4)] sm:grid-cols-2 lg:grid-cols-6">
          <Field htmlFor="transactions-filter-account" label="Cuenta">
            <Select
              id="transactions-filter-account"
              value={values.accountId}
              onChange={(event) => onChange("accountId", event.target.value)}
            >
              <option value="">Todas las cuentas</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {accountOptionLabel(account)}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="transactions-filter-category" label="Categoría">
            <Select
              id="transactions-filter-category"
              value={values.categoryId}
              onChange={(event) => onChange("categoryId", event.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {categoryOptionLabel(category)}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="transactions-filter-type" label="Tipo">
            <Select
              id="transactions-filter-type"
              value={values.type}
              onChange={(event) =>
                onChange("type", event.target.value as TransactionType | "")
              }
            >
              <option value="">Todos los tipos</option>
              {(Object.keys(transactionTypeLabels) as TransactionType[]).map(
                (type) => (
                  <option key={type} value={type}>
                    {transactionTypeLabels[type]}
                  </option>
                ),
              )}
            </Select>
          </Field>

          <Field htmlFor="transactions-filter-from" label="Desde">
            <Input
              id="transactions-filter-from"
              type="date"
              value={values.occurredFrom}
              max={values.occurredTo || undefined}
              onChange={(event) =>
                onChange("occurredFrom", event.target.value)
              }
            />
          </Field>

          <Field htmlFor="transactions-filter-to" label="Hasta">
            <Input
              id="transactions-filter-to"
              type="date"
              value={values.occurredTo}
              min={values.occurredFrom || undefined}
              onChange={(event) => onChange("occurredTo", event.target.value)}
            />
          </Field>

          <Field htmlFor="transactions-filter-active" label="Estado">
            <Select
              id="transactions-filter-active"
              value={values.isActive}
              onChange={(event) =>
                onChange(
                  "isActive",
                  event.target.value as TransactionFiltersValues["isActive"],
                )
              }
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </Select>
          </Field>
        </div>

        <div className="mt-[var(--ui-space-4)]">
          <Button type="button" variant="secondary" onClick={onClear}>
            Limpiar filtros
          </Button>
        </div>
      </PanelContent>
    </Panel>
  );
}
