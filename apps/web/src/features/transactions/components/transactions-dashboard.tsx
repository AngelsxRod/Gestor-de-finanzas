"use client";

import type { CreateTransactionRequest } from "@gestor-finanzas/contracts";
import { Modal } from "@gestor-finanzas/ui";
import { useAccountsQuery } from "../../accounts/hooks/use-accounts-query";
import { useCategoriesQuery } from "../../categories/hooks/use-categories-query";
import { TransactionApiError } from "../api/transaction-api-error";
import { useTransactionModal } from "../context/transaction-modal-context";
import { useCreateTransactionMutation } from "../hooks/use-create-transaction-mutation";
import { useTransactionsQuery } from "../hooks/use-transactions-query";
import { TransactionForm } from "./transaction-form";
import { TransactionsTable } from "./transactions-table";

export function TransactionsDashboard() {
  const transactionsQuery = useTransactionsQuery();
  const accountsQuery = useAccountsQuery();
  const categoriesQuery = useCategoriesQuery();
  const { isOpen, close } = useTransactionModal();
  const createTransaction = useCreateTransactionMutation();

  async function submit(values: CreateTransactionRequest) {
    await createTransaction.mutateAsync(values);
    close();
  }

  const formError =
    createTransaction.error instanceof TransactionApiError
      ? createTransaction.error.message
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
        />
      ) : null}

      <Modal open={isOpen} onClose={close} labelledBy="transaction-form-title">
        {isOpen && accountsQuery.isSuccess && categoriesQuery.isSuccess ? (
          <TransactionForm
            accounts={accountsQuery.data.accounts.filter(
              (account) => account.isActive,
            )}
            categories={categoriesQuery.data.categories.filter(
              (category) => category.isActive,
            )}
            isSubmitting={createTransaction.isPending}
            errorMessage={formError}
            onSubmit={submit}
          />
        ) : null}
      </Modal>
    </div>
  );
}
