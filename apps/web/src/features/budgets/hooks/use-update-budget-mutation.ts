import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBudget } from "../api/update-budget";
import { budgetsQueryKey } from "./use-budgets-query";

export function useUpdateBudgetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudget,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: budgetsQueryKey }),
  });
}
