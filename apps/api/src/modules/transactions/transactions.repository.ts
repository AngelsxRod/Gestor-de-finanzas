import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import {
  transactions,
  type NewTransaction,
  type Transaction,
} from '@gestor-finanzas/models';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<Transaction[]> {
    return this.database.db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.occurredAt), desc(transactions.id));
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
