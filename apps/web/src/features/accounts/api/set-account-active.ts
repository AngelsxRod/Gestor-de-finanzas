import { setAccountActiveResponseSchema } from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toAccountApiError } from "./account-api-error";

export type SetAccountActiveInput = {
  id: string;
  isActive: boolean;
};

export async function setAccountActive({ id, isActive }: SetAccountActiveInput) {
  try {
    const response = await httpClient.patch(`/accounts/${id}/active`, {
      isActive,
    });

    return setAccountActiveResponseSchema.parse(response.data);
  } catch (error) {
    throw toAccountApiError(error);
  }
}
