import { Injectable } from '@nestjs/common';
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
}
