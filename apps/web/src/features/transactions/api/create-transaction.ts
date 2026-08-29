import {
  createTransactionResponseSchema,
  type CreateTransactionRequest,
} from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toTransactionApiError } from "./transaction-api-error";

export async function createTransaction(input: CreateTransactionRequest) {
  try {
    const response = await httpClient.post("/transactions", input);

    return createTransactionResponseSchema.parse(response.data);
  } catch (error) {
    throw toTransactionApiError(error);
  }
}
