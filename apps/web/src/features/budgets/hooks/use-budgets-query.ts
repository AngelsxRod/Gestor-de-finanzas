import { useQuery } from "@tanstack/react-query";
import { getBudgets } from "../api/get-budgets";

export const budgetsQueryKey = ["budgets"] as const;

export function useBudgetsQuery(month: string) {
  return useQuery({
    queryKey: [...budgetsQueryKey, month],
    queryFn: () => getBudgets(month),
  });
}
