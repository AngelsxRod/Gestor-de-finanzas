import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../api/get-transactions";

export const transactionsQueryKey = ["transactions"] as const;

export function useTransactionsQuery() {
  return useQuery({
    queryKey: transactionsQueryKey,
    queryFn: getTransactions,
  });
}
