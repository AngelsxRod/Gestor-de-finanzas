import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setTransactionActive } from "../api/set-transaction-active";
import { accountBalancesQueryKey } from "./use-account-balances-query";
import { transactionsQueryKey } from "./use-transactions-query";

export function useSetTransactionActiveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setTransactionActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
      queryClient.invalidateQueries({ queryKey: accountBalancesQueryKey });
    },
  });
}
