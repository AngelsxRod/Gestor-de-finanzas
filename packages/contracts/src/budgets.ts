import { z } from 'zod';
import { decimalAmountSchema } from './accounts.js';
import {
  positiveDecimalAmountSchema,
  transactionAmountRequestSchema,
} from './transactions.js';

export const budgetMonthSchema = z
  .string({ error: 'El mes es obligatorio.' })
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Ingresa un mes válido (AAAA-MM).');

export const createBudgetRequestSchema = z.strictObject({
  categoryId: z.uuid('Selecciona una categoría.'),
  month: budgetMonthSchema,
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/),
  limitAmount: transactionAmountRequestSchema,
});

export const budgetSchema = z.strictObject({
  id: z.uuid(),
  categoryId: z.uuid(),
  month: budgetMonthSchema,
  currency: z.string().regex(/^[A-Z]{3}$/),
  limitAmount: positiveDecimalAmountSchema,
  isActive: z.boolean(),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

export const updateBudgetRequestSchema = createBudgetRequestSchema;

export const setBudgetActiveRequestSchema = z.strictObject({
  isActive: z.boolean(),
});

export const createBudgetResponseSchema = z.strictObject({
  budget: budgetSchema,
});

export const updateBudgetResponseSchema = createBudgetResponseSchema;

export const setBudgetActiveResponseSchema = createBudgetResponseSchema;

export const budgetSummarySchema = budgetSchema.extend({
  spent: positiveDecimalAmountSchema,
  remaining: decimalAmountSchema,
});

export const listBudgetsResponseSchema = z.strictObject({
  budgets: z.array(budgetSummarySchema),
});

export const listBudgetsQuerySchema = z.strictObject({
  month: budgetMonthSchema,
});

export const budgetErrorCodeSchema = z.enum([
  'VALIDATION_ERROR',
  'BUDGET_NOT_FOUND',
  'BUDGET_CATEGORY_NOT_FOUND',
  'BUDGET_CATEGORY_INACTIVE',
  'BUDGET_CATEGORY_NOT_EXPENSE',
  'BUDGET_MONTH_CONFLICT',
]);

export const budgetErrorResponseSchema = z.strictObject({
  code: budgetErrorCodeSchema,
  message: z.string().min(1),
  details: z.array(z.string()).optional(),
});

export type Budget = z.infer<typeof budgetSchema>;
export type BudgetSummary = z.infer<typeof budgetSummarySchema>;
export type BudgetErrorResponse = z.infer<typeof budgetErrorResponseSchema>;
export type CreateBudgetRequest = z.infer<typeof createBudgetRequestSchema>;
export type CreateBudgetResponse = z.infer<typeof createBudgetResponseSchema>;
export type ListBudgetsResponse = z.infer<typeof listBudgetsResponseSchema>;
export type ListBudgetsQuery = z.infer<typeof listBudgetsQuerySchema>;
export type UpdateBudgetRequest = z.infer<typeof updateBudgetRequestSchema>;
export type UpdateBudgetResponse = z.infer<typeof updateBudgetResponseSchema>;
export type SetBudgetActiveRequest = z.infer<
  typeof setBudgetActiveRequestSchema
>;
export type SetBudgetActiveResponse = z.infer<
  typeof setBudgetActiveResponseSchema
>;
