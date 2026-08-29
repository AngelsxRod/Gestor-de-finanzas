import { listTransactionsResponseSchema } from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toTransactionApiError } from "./transaction-api-error";

export async function getTransactions() {
  try {
    const response = await httpClient.get("/transactions");

    return listTransactionsResponseSchema.parse(response.data);
  } catch (error) {
    throw toTransactionApiError(error);
  }
}
