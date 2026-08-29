import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransaction } from "../api/update-transaction";
import { transactionsQueryKey } from "./use-transactions-query";

export function useUpdateTransactionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: transactionsQueryKey }),
  });
}
