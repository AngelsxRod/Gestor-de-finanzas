import { setBudgetActiveResponseSchema } from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toBudgetApiError } from "./budget-api-error";

export type SetBudgetActiveInput = {
  id: string;
  isActive: boolean;
};

export async function setBudgetActive({ id, isActive }: SetBudgetActiveInput) {
  try {
    const response = await httpClient.patch(`/budgets/${id}/active`, {
      isActive,
    });

    return setBudgetActiveResponseSchema.parse(response.data);
  } catch (error) {
    throw toBudgetApiError(error);
  }
}
