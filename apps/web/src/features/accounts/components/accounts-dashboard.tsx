"use client";

import type { CreateAccountRequest } from "@gestor-finanzas/contracts";
import { AccountApiError } from "../api/account-api-error";
import { useAccountsQuery } from "../hooks/use-accounts-query";
import { useCreateAccountMutation } from "../hooks/use-create-account-mutation";
import { AccountForm } from "./account-form";
import { AccountList } from "./account-list";

export function AccountsDashboard() {
  const accountsQuery = useAccountsQuery();
  const createAccount = useCreateAccountMutation();

  async function submit(input: CreateAccountRequest) {
    await createAccount.mutateAsync(input);
  }

  const formError =
    createAccount.error instanceof AccountApiError
      ? createAccount.error.message
      : undefined;

  return (
    <div className="grid gap-[var(--ui-space-6)] lg:grid-cols-2 lg:items-start">
      <AccountForm
        errorMessage={formError}
        isSubmitting={createAccount.isPending}
        onSubmit={submit}
        successMessage={
          createAccount.isSuccess ? "La cuenta se guardó correctamente." : undefined
        }
      />

      {accountsQuery.isPending ? <AccountList state="loading" /> : null}
      {accountsQuery.isError ? (
        <AccountList
          state="error"
          isRetrying={accountsQuery.isFetching}
          onRetry={() => void accountsQuery.refetch()}
        />
      ) : null}
      {accountsQuery.isSuccess ? (
        <AccountList state="success" accounts={accountsQuery.data.accounts} />
      ) : null}
    </div>
  );
}
