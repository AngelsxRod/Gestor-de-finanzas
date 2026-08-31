import { budgetErrorResponseSchema } from "@gestor-finanzas/contracts";
import axios from "axios";

export class BudgetApiError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "BudgetApiError";
  }
}

export function toBudgetApiError(error: unknown): BudgetApiError {
  if (axios.isAxiosError(error)) {
    const parsed = budgetErrorResponseSchema.safeParse(error.response?.data);

    if (parsed.success) {
      return new BudgetApiError(parsed.data.message, parsed.data.code);
    }
  }

  return new BudgetApiError(
    "No fue posible completar la operación. Inténtalo nuevamente.",
  );
}
