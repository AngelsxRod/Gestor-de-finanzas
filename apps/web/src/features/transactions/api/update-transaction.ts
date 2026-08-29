import {
  updateTransactionResponseSchema,
  type UpdateTransactionRequest,
} from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toTransactionApiError } from "./transaction-api-error";

export type UpdateTransactionInput = {
  id: string;
  input: UpdateTransactionRequest;
};

export async function updateTransaction({ id, input }: UpdateTransactionInput) {
  try {
    const response = await httpClient.patch(`/transactions/${id}`, input);

    return updateTransactionResponseSchema.parse(response.data);
  } catch (error) {
    throw toTransactionApiError(error);
  }
}
