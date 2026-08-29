import { setTransactionActiveResponseSchema } from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toTransactionApiError } from "./transaction-api-error";

export type SetTransactionActiveInput = {
  id: string;
  isActive: boolean;
};

export async function setTransactionActive({
  id,
  isActive,
}: SetTransactionActiveInput) {
  try {
    const response = await httpClient.patch(`/transactions/${id}/active`, {
      isActive,
    });

    return setTransactionActiveResponseSchema.parse(response.data);
  } catch (error) {
    throw toTransactionApiError(error);
  }
}
