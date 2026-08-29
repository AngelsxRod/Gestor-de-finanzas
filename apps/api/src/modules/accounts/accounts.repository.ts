import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { accounts, type Account, type NewAccount } from '@gestor-finanzas/models';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class AccountsRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<Account[]> {
    return this.database.db
      .select()
      .from(accounts)
      .orderBy(accounts.name, accounts.id);
  }

  async findById(id: string): Promise<Account | undefined> {
    const [account] = await this.database.db
      .select()
      .from(accounts)
      .where(eq(accounts.id, id));

    return account;
  }

  async create(values: NewAccount): Promise<Account> {
    const [account] = await this.database.db
      .insert(accounts)
      .values(values)
      .returning();

    if (!account) {
      throw new Error('Account insert did not return a record');
    }

    return account;
  }

  async updateById(
    id: string,
    values: NewAccount,
  ): Promise<Account | undefined> {
    const [account] = await this.database.db
      .update(accounts)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(accounts.id, id))
      .returning();

    return account;
  }

  async setActive(id: string, isActive: boolean): Promise<Account | undefined> {
    const [account] = await this.database.db
      .update(accounts)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(accounts.id, id))
      .returning();

    return account;
  }
}
