import type { ListTransactionsQuery } from "@gestor-finanzas/contracts";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../api/get-transactions";

export const transactionsQueryKey = ["transactions"] as const;

export function useTransactionsQuery(query: ListTransactionsQuery = {}) {
  return useQuery({
    queryKey: [...transactionsQueryKey, query],
    queryFn: () => getTransactions(query),
  });
}
