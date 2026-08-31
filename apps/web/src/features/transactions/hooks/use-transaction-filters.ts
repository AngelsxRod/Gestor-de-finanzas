import type {
  ListTransactionsQuery,
  TransactionType,
} from "@gestor-finanzas/contracts";
import { useState } from "react";

export type TransactionFiltersValues = {
  accountId: string;
  categoryId: string;
  type: TransactionType | "";
  occurredFrom: string;
  occurredTo: string;
  isActive: "" | "true" | "false";
};

export const emptyTransactionFilters: TransactionFiltersValues = {
  accountId: "",
  categoryId: "",
  type: "",
  occurredFrom: "",
  occurredTo: "",
  isActive: "",
};

export function toListTransactionsQuery(
  values: TransactionFiltersValues,
): ListTransactionsQuery {
  return {
    accountId: values.accountId || undefined,
    categoryId: values.categoryId || undefined,
    type: values.type || undefined,
    occurredFrom: values.occurredFrom || undefined,
    occurredTo: values.occurredTo || undefined,
    isActive: values.isActive || undefined,
  };
}

export function useTransactionFilters() {
  const [values, setValues] = useState(emptyTransactionFilters);

  function setField<Field extends keyof TransactionFiltersValues>(
    field: Field,
    value: TransactionFiltersValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function clear() {
    setValues(emptyTransactionFilters);
  }

  return { values, setField, clear };
}
