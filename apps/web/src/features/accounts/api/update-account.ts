import {
  updateAccountResponseSchema,
  type UpdateAccountRequest,
} from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toAccountApiError } from "./account-api-error";

export type UpdateAccountInput = {
  id: string;
  input: UpdateAccountRequest;
};

export async function updateAccount({ id, input }: UpdateAccountInput) {
  try {
    const response = await httpClient.patch(`/accounts/${id}`, input);

    return updateAccountResponseSchema.parse(response.data);
  } catch (error) {
    throw toAccountApiError(error);
  }
}
