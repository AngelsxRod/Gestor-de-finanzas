import { listAccountsResponseSchema } from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toAccountApiError } from "./account-api-error";

export async function getAccounts() {
  try {
    const response = await httpClient.get("/accounts");

    return listAccountsResponseSchema.parse(response.data);
  } catch (error) {
    throw toAccountApiError(error);
  }
}
