import {
  createAccountResponseSchema,
  type CreateAccountRequest,
} from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toAccountApiError } from "./account-api-error";

export async function createAccount(input: CreateAccountRequest) {
  try {
    const response = await httpClient.post("/accounts", input);

    return createAccountResponseSchema.parse(response.data);
  } catch (error) {
    throw toAccountApiError(error);
  }
}
