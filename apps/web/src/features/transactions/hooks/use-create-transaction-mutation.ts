import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "../api/create-transaction";
import { accountBalancesQueryKey } from "./use-account-balances-query";
import { transactionsQueryKey } from "./use-transactions-query";

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
      queryClient.invalidateQueries({ queryKey: accountBalancesQueryKey });
    },
  });
}
