import {
  listTransactionsResponseSchema,
  type ListTransactionsQuery,
} from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toTransactionApiError } from "./transaction-api-error";

export async function getTransactions(query: ListTransactionsQuery = {}) {
  try {
    const response = await httpClient.get("/transactions", {
      params: query,
    });

    return listTransactionsResponseSchema.parse(response.data);
  } catch (error) {
    throw toTransactionApiError(error);
  }
}
