"use client";

import type {
  Account,
  CreateAccountRequest,
} from "@gestor-finanzas/contracts";
import { Modal } from "@gestor-finanzas/ui";
import { AccountApiError } from "../api/account-api-error";
import { useAccountModal } from "../context/account-modal-context";
import { useAccountsQuery } from "../hooks/use-accounts-query";
import { useCreateAccountMutation } from "../hooks/use-create-account-mutation";
import { useSetAccountActiveMutation } from "../hooks/use-set-account-active-mutation";
import { useUpdateAccountMutation } from "../hooks/use-update-account-mutation";
import { AccountForm } from "./account-form";
import { AccountsTable } from "./accounts-table";

function toFormValues(account: Account): CreateAccountRequest {
  return {
    name: account.name,
    type: account.type,
    currency: account.currency,
    openingBalance: account.openingBalance,
  };
}

export function AccountsDashboard() {
  const accountsQuery = useAccountsQuery();
  const { state, close, openEdit } = useAccountModal();
  const createAccount = useCreateAccountMutation();
  const updateAccount = useUpdateAccountMutation();
  const setActive = useSetAccountActiveMutation();

  const saveMutation = state?.mode === "edit" ? updateAccount : createAccount;

  async function submit(values: CreateAccountRequest) {
    if (state?.mode === "edit") {
      await updateAccount.mutateAsync({ id: state.item.id, input: values });
    } else {
      await createAccount.mutateAsync(values);
    }
    close();
  }

  const formError =
    saveMutation.error instanceof AccountApiError
      ? saveMutation.error.message
      : undefined;

  return (
    <div className="grid gap-[var(--ui-space-6)]">
      {accountsQuery.isPending ? <AccountsTable state="loading" /> : null}
      {accountsQuery.isError ? (
        <AccountsTable
          state="error"
          isRetrying={accountsQuery.isFetching}
          onRetry={() => void accountsQuery.refetch()}
        />
      ) : null}
      {accountsQuery.isSuccess ? (
        <AccountsTable
          state="success"
          accounts={accountsQuery.data.accounts}
          onEdit={openEdit}
          onToggleActive={(account) =>
            setActive.mutate({ id: account.id, isActive: !account.isActive })
          }
          togglingAccountId={
            setActive.isPending ? setActive.variables?.id : undefined
          }
        />
      ) : null}

      <Modal
        open={state !== null}
        onClose={close}
        labelledBy="account-form-title"
      >
        {state !== null ? (
          <AccountForm
            mode={state.mode}
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
