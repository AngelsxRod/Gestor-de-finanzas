import { useQuery } from "@tanstack/react-query";
import { getAccountBalances } from "../api/get-account-balances";

export const accountBalancesQueryKey = ["account-balances"] as const;

export function useAccountBalancesQuery() {
  return useQuery({
    queryKey: accountBalancesQueryKey,
    queryFn: getAccountBalances,
  });
}
