import { listAccountBalancesResponseSchema } from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toTransactionApiError } from "./transaction-api-error";

export async function getAccountBalances() {
  try {
    const response = await httpClient.get("/transactions/balances");

    return listAccountBalancesResponseSchema.parse(response.data);
  } catch (error) {
    throw toTransactionApiError(error);
  }
}
