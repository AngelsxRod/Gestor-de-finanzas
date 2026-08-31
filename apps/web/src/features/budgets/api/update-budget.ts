import {
  updateBudgetResponseSchema,
  type UpdateBudgetRequest,
} from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toBudgetApiError } from "./budget-api-error";

export type UpdateBudgetInput = {
  id: string;
  input: UpdateBudgetRequest;
};

export async function updateBudget({ id, input }: UpdateBudgetInput) {
  try {
    const response = await httpClient.patch(`/budgets/${id}`, input);

    return updateBudgetResponseSchema.parse(response.data);
  } catch (error) {
    throw toBudgetApiError(error);
  }
}
