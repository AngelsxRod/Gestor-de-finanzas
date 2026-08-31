import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setBudgetActive } from "../api/set-budget-active";
import { budgetsQueryKey } from "./use-budgets-query";

export function useSetBudgetActiveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setBudgetActive,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: budgetsQueryKey }),
  });
}
