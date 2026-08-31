import { z } from 'zod';
import { decimalAmountSchema } from './accounts.js';

export const transactionTypeSchema = z.enum(['income', 'expense', 'transfer'], {
  error: 'Selecciona un tipo de movimiento válido.',
});

const positiveDecimalInputPattern = /^\d{1,15}(?:\.\d{1,4})?$/;
const positiveDecimalPattern = /^\d{1,15}\.\d{4}$/;

function normalizePositiveDecimal(value: string): string {
  const [rawInteger, rawFraction = ''] = value.split('.');
  const integer = rawInteger.replace(/^0+(?=\d)/, '') || '0';
  const fraction = rawFraction.padEnd(4, '0');

  return `${integer}.${fraction}`;
}

export const positiveDecimalAmountSchema = z
  .string()
  .regex(positiveDecimalPattern);

export const transactionAmountRequestSchema = z
  .string({ error: 'El monto es obligatorio.' })
  .trim()
  .regex(positiveDecimalInputPattern, 'Ingresa un monto mayor a cero.')
  .refine((value) => Number(value) > 0, 'Ingresa un monto mayor a cero.')
  .transform(normalizePositiveDecimal);

const occurredAtInputPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function isValidOccurredAtInput(value: string): boolean {
  return (
    occurredAtInputPattern.test(value) &&
    !Number.isNaN(new Date(value).getTime())
  );
}

// Validates the "datetime-local" input shape without converting it, so a
// form can check a field's value without pre-transforming it into the ISO
// shape the wire schema below expects and re-transforms on submit — doing
// both would double-convert the value and fail the second parse.
export const transactionOccurredAtFieldSchema = z
  .string({ error: 'La fecha es obligatoria.' })
  .trim()
  .refine(isValidOccurredAtInput, 'Ingresa una fecha y hora válidas.');

export const transactionOccurredAtRequestSchema =
  transactionOccurredAtFieldSchema.transform((value) =>
    new Date(value).toISOString(),
  );

export const transactionNotesRequestSchema = z
  .string()
  .trim()
  .max(280, 'Las notas no pueden superar 280 caracteres.')
  .optional()
  .transform((value) => (value ? value : undefined));

export const createIncomeRequestSchema = z.strictObject({
  type: z.literal('income'),
  amount: transactionAmountRequestSchema,
  accountId: z.uuid('Selecciona una cuenta.'),
  categoryId: z.uuid('Selecciona una categoría.'),
  occurredAt: transactionOccurredAtRequestSchema,
  notes: transactionNotesRequestSchema,
});

export const createExpenseRequestSchema = z.strictObject({
  type: z.literal('expense'),
  amount: transactionAmountRequestSchema,
  accountId: z.uuid('Selecciona una cuenta.'),
  categoryId: z.uuid('Selecciona una categoría.'),
  occurredAt: transactionOccurredAtRequestSchema,
  notes: transactionNotesRequestSchema,
});

export const createTransferRequestSchema = z.strictObject({
  type: z.literal('transfer'),
  amount: transactionAmountRequestSchema,
  accountId: z.uuid('Selecciona la cuenta de origen.'),
  transferAccountId: z.uuid('Selecciona la cuenta destino.'),
  occurredAt: transactionOccurredAtRequestSchema,
  notes: transactionNotesRequestSchema,
});

export const createTransactionRequestSchema = z.discriminatedUnion('type', [
  createIncomeRequestSchema,
  createExpenseRequestSchema,
  createTransferRequestSchema,
]);

export const updateTransactionRequestSchema = createTransactionRequestSchema;

export const setTransactionActiveRequestSchema = z.strictObject({
  isActive: z.boolean(),
});

export const transactionSchema = z.strictObject({
  id: z.uuid(),
  type: transactionTypeSchema,
  amount: positiveDecimalAmountSchema,
  currency: z.string().regex(/^[A-Z]{3}$/),
  accountId: z.uuid(),
  transferAccountId: z.uuid().nullable(),
  categoryId: z.uuid().nullable(),
  occurredAt: z.iso.datetime({ offset: true }),
  notes: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

export const createTransactionResponseSchema = z.strictObject({
  transaction: transactionSchema,
});

export const updateTransactionResponseSchema = createTransactionResponseSchema;

export const setTransactionActiveResponseSchema = createTransactionResponseSchema;

export const listTransactionsResponseSchema = z.strictObject({
  transactions: z.array(transactionSchema),
});

export const listTransactionsQuerySchema = z
  .strictObject({
    accountId: z.uuid().optional(),
    categoryId: z.uuid().optional(),
    type: transactionTypeSchema.optional(),
    occurredFrom: z.iso.date().optional(),
    occurredTo: z.iso.date().optional(),
    isActive: z.enum(['true', 'false']).optional(),
  })
  .refine(
    (value) =>
      !value.occurredFrom ||
      !value.occurredTo ||
      value.occurredFrom <= value.occurredTo,
    {
      message: 'La fecha "desde" debe ser anterior o igual a "hasta".',
      path: ['occurredTo'],
    },
  );

export const accountBalanceSchema = z.strictObject({
  accountId: z.uuid(),
  accountName: z.string().min(1),
  currency: z.string().regex(/^[A-Z]{3}$/),
  balance: decimalAmountSchema,
});

export const listAccountBalancesResponseSchema = z.strictObject({
  balances: z.array(accountBalanceSchema),
});

export const transactionErrorCodeSchema = z.enum([
  'VALIDATION_ERROR',
  'TRANSACTION_NOT_FOUND',
  'TRANSACTION_ACCOUNT_NOT_FOUND',
  'TRANSACTION_ACCOUNT_INACTIVE',
  'TRANSACTION_CATEGORY_NOT_FOUND',
  'TRANSACTION_CATEGORY_INACTIVE',
  'TRANSACTION_CATEGORY_TYPE_MISMATCH',
  'TRANSACTION_SAME_ACCOUNT',
  'TRANSACTION_CURRENCY_MISMATCH',
]);

export const transactionErrorResponseSchema = z.strictObject({
  code: transactionErrorCodeSchema,
  message: z.string().min(1),
  details: z.array(z.string()).optional(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionType = z.infer<typeof transactionTypeSchema>;
export type TransactionErrorResponse = z.infer<
  typeof transactionErrorResponseSchema
>;
export type CreateTransactionRequest = z.infer<
  typeof createTransactionRequestSchema
>;
export type CreateTransactionResponse = z.infer<
  typeof createTransactionResponseSchema
>;
export type ListTransactionsResponse = z.infer<
  typeof listTransactionsResponseSchema
>;
export type UpdateTransactionRequest = z.infer<
  typeof updateTransactionRequestSchema
>;
export type UpdateTransactionResponse = z.infer<
  typeof updateTransactionResponseSchema
>;
export type SetTransactionActiveRequest = z.infer<
  typeof setTransactionActiveRequestSchema
>;
export type SetTransactionActiveResponse = z.infer<
  typeof setTransactionActiveResponseSchema
>;
export type ListTransactionsQuery = z.infer<typeof listTransactionsQuerySchema>;
export type AccountBalance = z.infer<typeof accountBalanceSchema>;
export type ListAccountBalancesResponse = z.infer<
  typeof listAccountBalancesResponseSchema
>;
