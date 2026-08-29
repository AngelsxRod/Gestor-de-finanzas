"use client";

import type {
  CreateTransactionRequest,
  Transaction,
} from "@gestor-finanzas/contracts";
import { Modal } from "@gestor-finanzas/ui";
import { useAccountsQuery } from "../../accounts/hooks/use-accounts-query";
import { useCategoriesQuery } from "../../categories/hooks/use-categories-query";
import { TransactionApiError } from "../api/transaction-api-error";
import { useTransactionModal } from "../context/transaction-modal-context";
import { useCreateTransactionMutation } from "../hooks/use-create-transaction-mutation";
import { useSetTransactionActiveMutation } from "../hooks/use-set-transaction-active-mutation";
import {
  toDatetimeLocalInputValue,
  type TransactionFormValues,
} from "../hooks/use-transaction-form";
import { useTransactionsQuery } from "../hooks/use-transactions-query";
import { useUpdateTransactionMutation } from "../hooks/use-update-transaction-mutation";
import { TransactionForm } from "./transaction-form";
import { TransactionsTable } from "./transactions-table";

function toFormValues(transaction: Transaction): TransactionFormValues {
  return {
    type: transaction.type,
    amount: transaction.amount,
    accountId: transaction.accountId,
    categoryId: transaction.categoryId ?? "",
    transferAccountId: transaction.transferAccountId ?? "",
    occurredAt: toDatetimeLocalInputValue(new Date(transaction.occurredAt)),
    notes: transaction.notes ?? "",
  };
}

export function TransactionsDashboard() {
  const transactionsQuery = useTransactionsQuery();
  const accountsQuery = useAccountsQuery();
  const categoriesQuery = useCategoriesQuery();
  const { state, close, openEdit } = useTransactionModal();
  const createTransaction = useCreateTransactionMutation();
  const updateTransaction = useUpdateTransactionMutation();
  const setActive = useSetTransactionActiveMutation();

  const saveMutation =
    state?.mode === "edit" ? updateTransaction : createTransaction;

  async function submit(values: CreateTransactionRequest) {
    if (state?.mode === "edit") {
      await updateTransaction.mutateAsync({ id: state.item.id, input: values });
    } else {
      await createTransaction.mutateAsync(values);
    }
    close();
  }

  const formError =
    saveMutation.error instanceof TransactionApiError
      ? saveMutation.error.message
      : undefined;

  const accountsById = new Map(
    (accountsQuery.data?.accounts ?? []).map((account) => [
      account.id,
      account,
    ]),
  );
  const categoriesById = new Map(
    (categoriesQuery.data?.categories ?? []).map((category) => [
      category.id,
      category,
    ]),
  );

  return (
    <div className="grid gap-[var(--ui-space-6)]">
      {transactionsQuery.isPending ? (
        <TransactionsTable state="loading" />
      ) : null}
      {transactionsQuery.isError ? (
        <TransactionsTable
          state="error"
          isRetrying={transactionsQuery.isFetching}
          onRetry={() => void transactionsQuery.refetch()}
        />
      ) : null}
      {transactionsQuery.isSuccess ? (
        <TransactionsTable
          state="success"
          transactions={transactionsQuery.data.transactions}
          accountsById={accountsById}
          categoriesById={categoriesById}
          onEdit={openEdit}
          onToggleActive={(transaction) =>
            setActive.mutate({
              id: transaction.id,
              isActive: !transaction.isActive,
            })
          }
          togglingTransactionId={
            setActive.isPending ? setActive.variables?.id : undefined
          }
        />
      ) : null}

      <Modal
        open={state !== null}
        onClose={close}
        labelledBy="transaction-form-title"
      >
        {state !== null && accountsQuery.isSuccess && categoriesQuery.isSuccess ? (
          <TransactionForm
            mode={state.mode}
            accounts={accountsQuery.data.accounts}
            categories={categoriesQuery.data.categories}
            initialValues={
              state.mode === "edit" ? toFormValues(state.item) : undefined
            }
            isSubmitting={saveMutation.isPending}
            errorMessage={formError}
            onSubmit={submit}
          />
        ) : null}
      </Modal>
    </div>
  );
}
