import { accountErrorResponseSchema } from "@gestor-finanzas/contracts";
import axios from "axios";

export class AccountApiError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "AccountApiError";
  }
}

export function toAccountApiError(error: unknown): AccountApiError {
  if (axios.isAxiosError(error)) {
    const parsed = accountErrorResponseSchema.safeParse(error.response?.data);

    if (parsed.success) {
      return new AccountApiError(parsed.data.message, parsed.data.code);
    }
  }

  return new AccountApiError(
    "No fue posible completar la operación. Inténtalo nuevamente.",
  );
}
