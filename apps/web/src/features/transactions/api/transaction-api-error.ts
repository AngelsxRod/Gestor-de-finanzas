import { transactionErrorResponseSchema } from "@gestor-finanzas/contracts";
import axios from "axios";

export class TransactionApiError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "TransactionApiError";
  }
}

export function toTransactionApiError(error: unknown): TransactionApiError {
  if (axios.isAxiosError(error)) {
    const parsed = transactionErrorResponseSchema.safeParse(
      error.response?.data,
    );

    if (parsed.success) {
      return new TransactionApiError(parsed.data.message, parsed.data.code);
    }
  }

  return new TransactionApiError(
    "No fue posible completar la operación. Inténtalo nuevamente.",
  );
}
