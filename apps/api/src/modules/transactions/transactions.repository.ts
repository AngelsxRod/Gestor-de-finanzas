import { Injectable } from '@nestjs/common';
import { and, desc, eq, gte, lte, or, sql } from 'drizzle-orm';
import {
  accounts,
  transactions,
  type NewTransaction,
  type Transaction,
} from '@gestor-finanzas/models';
import { DatabaseService } from '../database/database.service.js';

export type AccountBalanceRow = {
  accountId: string;
  accountName: string;
  currency: string;
  balance: string;
};

export type TransactionListFilters = {
  accountId?: string;
  categoryId?: string;
  type?: 'income' | 'expense' | 'transfer';
  occurredFrom?: string;
  occurredTo?: string;
  isActive?: boolean;
};

function startOfDay(dateOnly: string): Date {
  return new Date(`${dateOnly}T00:00:00.000`);
}

function endOfDay(dateOnly: string): Date {
  return new Date(`${dateOnly}T23:59:59.999`);
}

@Injectable()
export class TransactionsRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll(filters: TransactionListFilters = {}): Promise<Transaction[]> {
    const conditions = [];

    if (filters.accountId) {
      conditions.push(
        or(
          eq(transactions.accountId, filters.accountId),
          eq(transactions.transferAccountId, filters.accountId),
        ),
      );
    }
    if (filters.categoryId) {
      conditions.push(eq(transactions.categoryId, filters.categoryId));
    }
    if (filters.type) {
      conditions.push(eq(transactions.type, filters.type));
    }
    if (filters.occurredFrom) {
      conditions.push(
        gte(transactions.occurredAt, startOfDay(filters.occurredFrom)),
      );
    }
    if (filters.occurredTo) {
      conditions.push(
        lte(transactions.occurredAt, endOfDay(filters.occurredTo)),
      );
    }
    if (filters.isActive !== undefined) {
      conditions.push(eq(transactions.isActive, filters.isActive));
    }

    const query = this.database.db.select().from(transactions);
    const filtered =
      conditions.length > 0 ? query.where(and(...conditions)) : query;

    return filtered.orderBy(
      desc(transactions.occurredAt),
      desc(transactions.id),
    );
  }

  async findBalances(): Promise<AccountBalanceRow[]> {
    const balance = sql<string>`(${accounts.openingBalance} + COALESCE(SUM(
      CASE
        WHEN ${transactions.isActive} IS NOT TRUE THEN 0
        WHEN ${transactions.type} = 'income' AND ${transactions.accountId} = ${accounts.id} THEN ${transactions.amount}
        WHEN ${transactions.type} = 'expense' AND ${transactions.accountId} = ${accounts.id} THEN -${transactions.amount}
        WHEN ${transactions.type} = 'transfer' AND ${transactions.accountId} = ${accounts.id} THEN -${transactions.amount}
        WHEN ${transactions.type} = 'transfer' AND ${transactions.transferAccountId} = ${accounts.id} THEN ${transactions.amount}
        ELSE 0
      END
    ), 0))`.as('balance');

    const rows = await this.database.db
      .select({
        accountId: accounts.id,
        accountName: accounts.name,
        currency: accounts.currency,
        balance,
      })
      .from(accounts)
      .leftJoin(
        transactions,
        sql`${transactions.accountId} = ${accounts.id} OR ${transactions.transferAccountId} = ${accounts.id}`,
      )
      .groupBy(accounts.id)
      .orderBy(accounts.name, accounts.id);

    return rows;
  }

  async findById(id: string): Promise<Transaction | undefined> {
    const [transaction] = await this.database.db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));

    return transaction;
  }

  async create(values: NewTransaction): Promise<Transaction> {
    const [transaction] = await this.database.db
      .insert(transactions)
      .values(values)
      .returning();

    if (!transaction) {
      throw new Error('Transaction insert did not return a record');
    }

    return transaction;
  }

  async updateById(
    id: string,
    values: NewTransaction,
  ): Promise<Transaction | undefined> {
    const [transaction] = await this.database.db
      .update(transactions)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();

    return transaction;
  }

  async setActive(
    id: string,
    isActive: boolean,
  ): Promise<Transaction | undefined> {
    const [transaction] = await this.database.db
      .update(transactions)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();

    return transaction;
  }
}
