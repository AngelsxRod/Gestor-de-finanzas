import { Injectable } from '@nestjs/common';
import { and, asc, eq, gte, lt, sql } from 'drizzle-orm';
import {
  budgets,
  categories,
  transactions,
  type Budget,
  type NewBudget,
} from '@gestor-finanzas/models';
import { DatabaseService } from '../database/database.service.js';

export type BudgetSummaryRow = Budget & { spent: string; remaining: string };

@Injectable()
export class BudgetsRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAllWithSpend(
    month: string,
    monthStart: Date,
    monthEnd: Date,
  ): Promise<BudgetSummaryRow[]> {
    const spent = sql<string>`COALESCE(SUM(${transactions.amount}), 0.0000)`.as(
      'spent',
    );
    const remaining = sql<string>`(${budgets.limitAmount} - COALESCE(SUM(${transactions.amount}), 0.0000))`.as(
      'remaining',
    );

    return this.database.db
      .select({
        id: budgets.id,
        categoryId: budgets.categoryId,
        month: budgets.month,
        currency: budgets.currency,
        limitAmount: budgets.limitAmount,
        isActive: budgets.isActive,
        createdAt: budgets.createdAt,
        updatedAt: budgets.updatedAt,
        spent,
        remaining,
      })
      .from(budgets)
      .leftJoin(categories, eq(categories.id, budgets.categoryId))
      .leftJoin(
        transactions,
        and(
          eq(transactions.categoryId, budgets.categoryId),
          eq(transactions.currency, budgets.currency),
          eq(transactions.type, 'expense'),
          eq(transactions.isActive, true),
          gte(transactions.occurredAt, monthStart),
          lt(transactions.occurredAt, monthEnd),
        ),
      )
      .where(eq(budgets.month, month))
      .groupBy(budgets.id, categories.name)
      .orderBy(asc(categories.name), asc(budgets.id));
  }

  async create(values: NewBudget): Promise<Budget> {
    const [budget] = await this.database.db
      .insert(budgets)
      .values(values)
      .returning();

    if (!budget) {
      throw new Error('Budget insert did not return a record');
    }

    return budget;
  }

  async updateById(
    id: string,
    values: NewBudget,
  ): Promise<Budget | undefined> {
    const [budget] = await this.database.db
      .update(budgets)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(budgets.id, id))
      .returning();

    return budget;
  }

  async setActive(id: string, isActive: boolean): Promise<Budget | undefined> {
    const [budget] = await this.database.db
      .update(budgets)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(budgets.id, id))
      .returning();

    return budget;
  }
}
