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

  it('finds a transaction by id, updates it and toggles the active flag', async () => {
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
    const created = await repository.create({
      type: 'income',
      amount: '100.0000',
      currency: 'GTQ',
      accountId: account.id,
      categoryId: category.id,
      occurredAt: new Date('2026-08-01T10:00:00.000Z'),
    });

    await expect(repository.findById(created.id)).resolves.toMatchObject({
      id: created.id,
      amount: '100.0000',
    });
    await expect(
      repository.findById('00000000-0000-0000-0000-000000000000'),
    ).resolves.toBeUndefined();

    const updated = await repository.updateById(created.id, {
      type: 'income',
      amount: '150.0000',
      currency: 'GTQ',
      accountId: account.id,
      categoryId: category.id,
      occurredAt: new Date('2026-08-02T10:00:00.000Z'),
    });
    expect(updated).toMatchObject({ amount: '150.0000' });
    expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
      created.updatedAt.getTime(),
    );

    const deactivated = await repository.setActive(created.id, false);
    expect(deactivated).toMatchObject({ isActive: false });

    const reactivated = await repository.setActive(created.id, true);
    expect(reactivated).toMatchObject({ isActive: true });
  });

  it('returns undefined when updating or setting active state on an unknown transaction', async () => {
    await expect(
      repository.updateById('00000000-0000-0000-0000-000000000000', {
        type: 'transfer',
        amount: '10.0000',
        currency: 'GTQ',
        accountId: '00000000-0000-0000-0000-000000000001',
        transferAccountId: '00000000-0000-0000-0000-000000000002',
        categoryId: null,
        occurredAt: new Date('2026-08-20T10:00:00.000Z'),
      }),
    ).resolves.toBeUndefined();
    await expect(
      repository.setActive('00000000-0000-0000-0000-000000000000', false),
    ).resolves.toBeUndefined();
  });

  it('filters transactions by account (as origin or transfer destination), category, type, date range and active state', async () => {
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
    const other = await accountsRepository.create({
      name: 'Otra cuenta',
      type: 'cash',
      currency: 'GTQ',
      openingBalance: '0.0000',
    });
    const incomeCategory = await categoriesRepository.create({
      name: 'Salario',
      type: 'income',
    });
    const expenseCategory = await categoriesRepository.create({
      name: 'Comida',
      type: 'expense',
    });

    const income = await repository.create({
      type: 'income',
      amount: '100.0000',
      currency: 'GTQ',
      accountId: origin.id,
      categoryId: incomeCategory.id,
      occurredAt: new Date('2026-08-05T10:00:00.000Z'),
    });
    const expense = await repository.create({
      type: 'expense',
      amount: '20.0000',
      currency: 'GTQ',
      accountId: origin.id,
      categoryId: expenseCategory.id,
      occurredAt: new Date('2026-08-10T10:00:00.000Z'),
    });
    const transfer = await repository.create({
      type: 'transfer',
      amount: '30.0000',
      currency: 'GTQ',
      accountId: origin.id,
      transferAccountId: destination.id,
      categoryId: null,
      occurredAt: new Date('2026-08-15T10:00:00.000Z'),
    });
    const unrelated = await repository.create({
      type: 'income',
      amount: '5.0000',
      currency: 'GTQ',
      accountId: other.id,
      categoryId: incomeCategory.id,
      occurredAt: new Date('2026-08-20T10:00:00.000Z'),
    });
    await repository.setActive(expense.id, false);

    await expect(
      repository
        .findAll({ accountId: origin.id })
        .then((rows) => rows.map((row) => row.id)),
    ).resolves.toEqual([transfer.id, expense.id, income.id]);

    await expect(
      repository
        .findAll({ accountId: destination.id })
        .then((rows) => rows.map((row) => row.id)),
    ).resolves.toEqual([transfer.id]);

    await expect(
      repository
        .findAll({ categoryId: expenseCategory.id })
        .then((rows) => rows.map((row) => row.id)),
    ).resolves.toEqual([expense.id]);

    await expect(
      repository
        .findAll({ type: 'transfer' })
        .then((rows) => rows.map((row) => row.id)),
    ).resolves.toEqual([transfer.id]);

    await expect(
      repository
        .findAll({ occurredFrom: '2026-08-10', occurredTo: '2026-08-15' })
        .then((rows) => rows.map((row) => row.id)),
    ).resolves.toEqual([transfer.id, expense.id]);

    await expect(
      repository
        .findAll({ isActive: false })
        .then((rows) => rows.map((row) => row.id)),
    ).resolves.toEqual([expense.id]);

    await expect(
      repository
        .findAll({ accountId: origin.id, isActive: true })
        .then((rows) => rows.map((row) => row.id)),
    ).resolves.toEqual([transfer.id, income.id]);

    expect(unrelated.accountId).toBe(other.id);
  });

  it('returns the opening balance for an account without transactions', async () => {
    const account = await accountsRepository.create({
      name: 'Sin movimientos',
      type: 'cash',
      currency: 'GTQ',
      openingBalance: '50.0000',
    });

    const balances = await repository.findBalances();

    expect(balances).toEqual([
      {
        accountId: account.id,
        accountName: account.name,
        currency: 'GTQ',
        balance: '50.0000',
      },
    ]);
  });

  it('adds income, subtracts expense and moves transfers between accounts', async () => {
    const origin = await accountsRepository.create({
      name: 'Origen',
      type: 'checking',
      currency: 'GTQ',
      openingBalance: '100.0000',
    });
    const destination = await accountsRepository.create({
      name: 'Zeta destino',
      type: 'savings',
      currency: 'GTQ',
      openingBalance: '0.0000',
    });
    const category = await categoriesRepository.create({
      name: 'Salario',
      type: 'income',
    });
    const expenseCategory = await categoriesRepository.create({
      name: 'Comida',
      type: 'expense',
    });

    await repository.create({
      type: 'income',
      amount: '300.0000',
      currency: 'GTQ',
      accountId: origin.id,
      categoryId: category.id,
      occurredAt: new Date('2026-08-01T10:00:00.000Z'),
    });
    await repository.create({
      type: 'expense',
      amount: '40.0000',
      currency: 'GTQ',
      accountId: origin.id,
      categoryId: expenseCategory.id,
      occurredAt: new Date('2026-08-02T10:00:00.000Z'),
    });
    await repository.create({
      type: 'transfer',
      amount: '60.0000',
      currency: 'GTQ',
      accountId: origin.id,
      transferAccountId: destination.id,
      categoryId: null,
      occurredAt: new Date('2026-08-03T10:00:00.000Z'),
    });
    const inactive = await repository.create({
      type: 'expense',
      amount: '1000.0000',
      currency: 'GTQ',
      accountId: origin.id,
      categoryId: expenseCategory.id,
      occurredAt: new Date('2026-08-04T10:00:00.000Z'),
    });
    await repository.setActive(inactive.id, false);

    const balances = await repository.findBalances();

    expect(balances).toEqual([
      {
        accountId: origin.id,
        accountName: origin.name,
        currency: 'GTQ',
        // 100 opening + 300 income - 40 expense - 60 transferred out
        balance: '300.0000',
      },
      {
        accountId: destination.id,
        accountName: destination.name,
        currency: 'GTQ',
        balance: '60.0000',
      },
    ]);
  });
});
