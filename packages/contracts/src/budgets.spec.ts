import { describe, expect, it } from 'vitest';
import {
  budgetErrorResponseSchema,
  budgetSchema,
  budgetSummarySchema,
  createBudgetRequestSchema,
  createBudgetResponseSchema,
  listBudgetsQuerySchema,
  listBudgetsResponseSchema,
  setBudgetActiveRequestSchema,
  updateBudgetRequestSchema,
} from './budgets.js';

const budget = {
  id: 'f1700f2a-f1c2-4fc2-8432-ffb13bb24e6e',
  categoryId: 'c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f10',
  month: '2026-08',
  currency: 'GTQ',
  limitAmount: '1500.0000',
  isActive: true,
  createdAt: '2026-08-29T12:00:00.000Z',
  updatedAt: '2026-08-29T12:00:00.000Z',
} as const;

describe('budget contracts', () => {
  it('normalizes a valid create request without losing decimal precision', () => {
    expect(
      createBudgetRequestSchema.parse({
        categoryId: budget.categoryId,
        month: '2026-08',
        currency: 'gtq',
        limitAmount: '001500.5',
      }),
    ).toEqual({
      categoryId: budget.categoryId,
      month: '2026-08',
      currency: 'GTQ',
      limitAmount: '1500.5000',
    });
  });

  it.each([
    { categoryId: 'not-a-uuid', month: '2026-08', currency: 'GTQ', limitAmount: '10' },
    { categoryId: budget.categoryId, month: '2026-13', currency: 'GTQ', limitAmount: '10' },
    { categoryId: budget.categoryId, month: '26-08', currency: 'GTQ', limitAmount: '10' },
    { categoryId: budget.categoryId, month: '2026-08', currency: 'GT', limitAmount: '10' },
    { categoryId: budget.categoryId, month: '2026-08', currency: 'GTQ', limitAmount: '0' },
    { categoryId: budget.categoryId, month: '2026-08', currency: 'GTQ', limitAmount: '-1' },
  ])('rejects an invalid create request: %o', (request) => {
    expect(createBudgetRequestSchema.safeParse(request).success).toBe(false);
  });

  it('accepts create and list responses with canonical budget values', () => {
    expect(createBudgetResponseSchema.parse({ budget })).toEqual({ budget });
    expect(budgetSchema.parse(budget)).toEqual(budget);
  });

  it('accepts a budget summary with spent and a negative remaining', () => {
    const summary = { ...budget, spent: '1800.0000', remaining: '-300.0000' };

    expect(budgetSummarySchema.parse(summary)).toEqual(summary);
    expect(listBudgetsResponseSchema.parse({ budgets: [summary] })).toEqual({
      budgets: [summary],
    });
  });

  it('accepts a valid month query and rejects a malformed one', () => {
    expect(listBudgetsQuerySchema.parse({ month: '2026-08' })).toEqual({
      month: '2026-08',
    });
    expect(
      listBudgetsQuerySchema.safeParse({ month: '2026-8' }).success,
    ).toBe(false);
    expect(listBudgetsQuerySchema.safeParse({}).success).toBe(false);
  });

  it('normalizes a valid update request the same way as create', () => {
    expect(
      updateBudgetRequestSchema.parse({
        categoryId: budget.categoryId,
        month: '2026-09',
        currency: 'gtq',
        limitAmount: '2000',
      }),
    ).toEqual({
      categoryId: budget.categoryId,
      month: '2026-09',
      currency: 'GTQ',
      limitAmount: '2000.0000',
    });
  });

  it('accepts a valid set-active request and rejects a non-boolean value', () => {
    expect(setBudgetActiveRequestSchema.parse({ isActive: false })).toEqual({
      isActive: false,
    });
    expect(
      setBudgetActiveRequestSchema.safeParse({ isActive: 'no' }).success,
    ).toBe(false);
  });

  it('accepts the public error codes for cross-table validation failures', () => {
    expect(
      budgetErrorResponseSchema.parse({
        code: 'BUDGET_CATEGORY_NOT_EXPENSE',
        message: 'Solo las categorías de gasto pueden tener presupuesto.',
      }),
    ).toEqual({
      code: 'BUDGET_CATEGORY_NOT_EXPENSE',
      message: 'Solo las categorías de gasto pueden tener presupuesto.',
    });
  });
});
