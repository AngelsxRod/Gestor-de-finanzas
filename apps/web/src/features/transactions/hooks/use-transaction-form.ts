import { zodResolver } from "@hookform/resolvers/zod";
import {
  transactionAmountRequestSchema,
  transactionNotesRequestSchema,
  transactionOccurredAtFieldSchema,
  transactionTypeSchema,
  type CreateTransactionRequest,
} from "@gestor-finanzas/contracts";
import { useForm } from "react-hook-form";
import { z } from "zod";

const transactionFormSchema = z
  .object({
    type: transactionTypeSchema,
    amount: transactionAmountRequestSchema,
    accountId: z.uuid({ error: "Selecciona una cuenta." }),
    categoryId: z.string(),
    transferAccountId: z.string(),
    occurredAt: transactionOccurredAtFieldSchema,
    notes: transactionNotesRequestSchema,
  })
  .superRefine((values, ctx) => {
    if (values.type === "transfer") {
      if (!values.transferAccountId) {
        ctx.addIssue({
          code: "custom",
          path: ["transferAccountId"],
          message: "Selecciona la cuenta destino.",
        });
      } else if (values.transferAccountId === values.accountId) {
        ctx.addIssue({
          code: "custom",
          path: ["transferAccountId"],
          message: "Debe ser diferente de la cuenta de origen.",
        });
      }
    } else if (!values.categoryId) {
      ctx.addIssue({
        code: "custom",
        path: ["categoryId"],
        message: "Selecciona una categoría.",
      });
    }
  });

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export function toDatetimeLocalInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function useTransactionForm(defaultValues?: TransactionFormValues) {
  return useForm({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: defaultValues ?? {
      type: "expense",
      amount: "",
      accountId: "",
      categoryId: "",
      transferAccountId: "",
      occurredAt: toDatetimeLocalInputValue(new Date()),
      notes: "",
    },
  });
}

export function toCreateTransactionRequest(
  values: TransactionFormValues,
): CreateTransactionRequest {
  if (values.type === "transfer") {
    return {
      type: "transfer",
      amount: values.amount,
      accountId: values.accountId,
      transferAccountId: values.transferAccountId,
      occurredAt: values.occurredAt,
      notes: values.notes,
    };
  }

  return {
    type: values.type,
    amount: values.amount,
    accountId: values.accountId,
    categoryId: values.categoryId,
    occurredAt: values.occurredAt,
    notes: values.notes,
  };
}
