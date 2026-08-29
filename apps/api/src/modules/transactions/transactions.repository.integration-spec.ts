import { ConfigService } from '@nestjs/config';
import { accounts, categories, transactions } from '@gestor-finanzas/models';
import { describe, expect, it } from 'vitest';
import type { Environment } from '../../config/environment.js';
import { DatabaseService } from '../database/database.service.js';
import { AccountsRepository } from '../accounts/accounts.repository.js';
import { CategoriesRepository } from '../categories/categories.repository.js';
import { TransactionsRepository } from './transactions.repository.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith('_test')) {
  throw new Error('Integration tests require an isolated *_test database');
}

describe('TransactionsRepository integration', () => {
  const database = new DatabaseService(
    new ConfigService<Environment, true>({ DATABASE_URL: databaseUrl }),
  );
  const repository = new TransactionsRepository(database);
  const accountsRepository = new AccountsRepository(database);
  const categoriesRepository = new CategoriesRepository(database);

  beforeEach(async () => {
    await database.db.delete(transactions);
    await database.db.delete(categories);
    await database.db.delete(accounts);
  });

  afterAll(async () => {
    await database.db.delete(transactions);
    await database.db.delete(categories);
    await database.db.delete(accounts);
    await database.onApplicationShutdown();
  });

  it('persists transactions and lists them by occurred date, most recent first', async () => {
    const account = await accountsRepository.create({
      name: 'Cuenta principal',
      type: 'checking',
      currency: 'GTQ',
      openingBalance: '0.0000',
    });
    const category = await categoriesRepository.create({
      name: 'Salario',
      type: 'income',
    });

    const older = await repository.create({
      type: 'income',
      amount: '100.0000',
      currency: 'GTQ',
      accountId: account.id,
      categoryId: category.id,
      occurredAt: new Date('2026-08-01T10:00:00.000Z'),
    });
    const newer = await repository.create({
      type: 'income',
      amount: '200.0000',
      currency: 'GTQ',
      accountId: account.id,
      categoryId: category.id,
      occurredAt: new Date('2026-08-15T10:00:00.000Z'),
    });

    const result = await repository.findAll();

    expect(result.map((transaction) => transaction.id)).toEqual([
      newer.id,
      older.id,
    ]);
  });

  it('persists a transfer between two accounts without a category', async () => {
    const origin = await accountsRepository.create({
      name: 'Origen',
      type: 'checking',
      currency: 'GTQ',
      openingBalance: '0.0000',
    });
    const destination = await accountsRepository.create({
      name: 'Destino',
      type: 'savings',
      currency: 'GTQ',
      openingBalance: '0.0000',
    });

    const transfer = await repository.create({
      type: 'transfer',
      amount: '50.0000',
      currency: 'GTQ',
      accountId: origin.id,
      transferAccountId: destination.id,
      categoryId: null,
      occurredAt: new Date('2026-08-20T10:00:00.000Z'),
    });

    expect(transfer).toMatchObject({
      type: 'transfer',
      accountId: origin.id,
      transferAccountId: destination.id,
      categoryId: null,
    });
  });

  it('rejects an income transaction without a category via the shape check constraint', async () => {
    const account = await accountsRepository.create({
      name: 'Cuenta principal',
      type: 'checking',
      currency: 'GTQ',
      openingBalance: '0.0000',
    });

    await expect(
      repository.create({
        type: 'income',
        amount: '10.0000',
        currency: 'GTQ',
        accountId: account.id,
        categoryId: null,
        occurredAt: new Date('2026-08-20T10:00:00.000Z'),
      }),
    ).rejects.toMatchObject({
      cause: {
        code: '23514',
        constraint_name: 'transactions_shape_by_type',
      },
    });
  });

  it('rejects a reference to an account that does not exist', async () => {
    await expect(
      repository.create({
        type: 'transfer',
        amount: '10.0000',
        currency: 'GTQ',
        accountId: '00000000-0000-0000-0000-000000000000',
        transferAccountId: '00000000-0000-0000-0000-000000000001',
        categoryId: null,
        occurredAt: new Date('2026-08-20T10:00:00.000Z'),
      }),
    ).rejects.toMatchObject({ cause: { code: '23503' } });
  });
});
