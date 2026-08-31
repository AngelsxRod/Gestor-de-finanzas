import {
  createBudgetResponseSchema,
  type CreateBudgetRequest,
} from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toBudgetApiError } from "./budget-api-error";

export async function createBudget(input: CreateBudgetRequest) {
  try {
    const response = await httpClient.post("/budgets", input);

    return createBudgetResponseSchema.parse(response.data);
  } catch (error) {
    throw toBudgetApiError(error);
  }
}
