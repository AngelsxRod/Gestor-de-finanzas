import { listBudgetsResponseSchema } from "@gestor-finanzas/contracts";
import { httpClient } from "@/src/lib/api/http-client";
import { toBudgetApiError } from "./budget-api-error";

export async function getBudgets(month: string) {
  try {
    const response = await httpClient.get("/budgets", { params: { month } });

    return listBudgetsResponseSchema.parse(response.data);
  } catch (error) {
    throw toBudgetApiError(error);
  }
}
