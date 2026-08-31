"use client";

import type {
  BudgetSummary,
  CreateBudgetRequest,
} from "@gestor-finanzas/contracts";
import { Field, Input, Modal } from "@gestor-finanzas/ui";
import { useState } from "react";
import { useCategoriesQuery } from "../../categories/hooks/use-categories-query";
import { BudgetApiError } from "../api/budget-api-error";
import { useBudgetModal } from "../context/budget-modal-context";
import { useBudgetsQuery } from "../hooks/use-budgets-query";
import { useCreateBudgetMutation } from "../hooks/use-create-budget-mutation";
import { useSetBudgetActiveMutation } from "../hooks/use-set-budget-active-mutation";
import { useUpdateBudgetMutation } from "../hooks/use-update-budget-mutation";
import { BudgetForm } from "./budget-form";
import { BudgetsTable } from "./budgets-table";

function getCurrentMonth(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  return `${now.getFullYear()}-${month}`;
}

function toFormValues(budget: BudgetSummary): CreateBudgetRequest {
  return {
    categoryId: budget.categoryId,
    month: budget.month,
    currency: budget.currency,
    limitAmount: budget.limitAmount,
  };
}

export function BudgetsDashboard() {
  const [month, setMonth] = useState(getCurrentMonth);
  const budgetsQuery = useBudgetsQuery(month);
  const categoriesQuery = useCategoriesQuery();
  const { state, close, openEdit } = useBudgetModal();
  const createBudget = useCreateBudgetMutation();
  const updateBudget = useUpdateBudgetMutation();
  const setActive = useSetBudgetActiveMutation();

  const saveMutation = state?.mode === "edit" ? updateBudget : createBudget;

  async function submit(values: CreateBudgetRequest) {
    if (state?.mode === "edit") {
      await updateBudget.mutateAsync({ id: state.item.id, input: values });
    } else {
      await createBudget.mutateAsync(values);
    }
    close();
  }

  const formError =
    saveMutation.error instanceof BudgetApiError
      ? saveMutation.error.message
      : undefined;

  const categoriesById = new Map(
    (categoriesQuery.data?.categories ?? []).map((category) => [
      category.id,
      category,
    ]),
  );

  const defaultValues: CreateBudgetRequest =
    state?.mode === "edit"
      ? toFormValues(state.item)
      : { categoryId: "", month, currency: "GTQ", limitAmount: "" };

  return (
    <div className="grid gap-[var(--ui-space-6)]">
      <div className="max-w-[12rem]">
        <Field htmlFor="budgets-month" label="Mes">
          <Input
            id="budgets-month"
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
          />
        </Field>
      </div>

      {budgetsQuery.isPending ? <BudgetsTable state="loading" /> : null}
      {budgetsQuery.isError ? (
        <BudgetsTable
          state="error"
          isRetrying={budgetsQuery.isFetching}
          onRetry={() => void budgetsQuery.refetch()}
        />
      ) : null}
      {budgetsQuery.isSuccess ? (
        <BudgetsTable
          state="success"
          budgets={budgetsQuery.data.budgets}
          categoriesById={categoriesById}
          onEdit={openEdit}
          onToggleActive={(budget) =>
            setActive.mutate({ id: budget.id, isActive: !budget.isActive })
          }
          togglingBudgetId={
            setActive.isPending ? setActive.variables?.id : undefined
          }
        />
      ) : null}

      <Modal open={state !== null} onClose={close} labelledBy="budget-form-title">
        {state !== null && categoriesQuery.isSuccess ? (
          <BudgetForm
            mode={state.mode}
            categories={categoriesQuery.data.categories}
            defaultValues={defaultValues}
            isSubmitting={saveMutation.isPending}
            errorMessage={formError}
            onSubmit={submit}
          />
        ) : null}
      </Modal>
    </div>
  );
}
