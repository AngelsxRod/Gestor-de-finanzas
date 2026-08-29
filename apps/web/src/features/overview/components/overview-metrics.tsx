"use client";

import { useAccountsQuery } from "../../accounts/hooks/use-accounts-query";
import { useCategoriesQuery } from "../../categories/hooks/use-categories-query";
import { OverviewSummary, type MetricState } from "./overview-summary";

export function OverviewMetrics() {
  const accountsQuery = useAccountsQuery();
  const categoriesQuery = useCategoriesQuery();

  const accounts: MetricState = accountsQuery.isPending
    ? { state: "loading" }
    : accountsQuery.isError
      ? {
          state: "error",
          isRetrying: accountsQuery.isFetching,
          onRetry: () => void accountsQuery.refetch(),
        }
      : { state: "success", count: accountsQuery.data.accounts.length };

  const categories: MetricState = categoriesQuery.isPending
    ? { state: "loading" }
    : categoriesQuery.isError
      ? {
          state: "error",
          isRetrying: categoriesQuery.isFetching,
          onRetry: () => void categoriesQuery.refetch(),
        }
      : { state: "success", count: categoriesQuery.data.categories.length };

  return <OverviewSummary accounts={accounts} categories={categories} />;
}
