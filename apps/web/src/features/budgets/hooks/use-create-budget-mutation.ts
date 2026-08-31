import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBudget } from "../api/create-budget";
import { budgetsQueryKey } from "./use-budgets-query";

export function useCreateBudgetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBudget,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: budgetsQueryKey }),
  });
}
