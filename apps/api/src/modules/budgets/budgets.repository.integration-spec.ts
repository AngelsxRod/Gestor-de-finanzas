import { ConfigService } from '@nestjs/config';
import { accounts, budgets, categories, transactions } from '@gestor-finanzas/models';
import { describe, expect, it } from 'vitest';
import type { Environment } from '../../config/environment.js';
import { DatabaseService } from '../database/database.service.js';
import { AccountsRepository } from '../accounts/accounts.repository.js';
import { CategoriesRepository } from '../categories/categories.repository.js';
import { TransactionsRepository } from '../transactions/transactions.repository.js';
import { BudgetsRepository } from './budgets.repository.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith('_test')) {
  throw new Error('Integration tests require an isolated *_test database');
}

function monthRange(month: string): { start: Date; end: Date } {
  const [year, monthNumber] = month.split('-').map(Number);

  return {
    start: new Date(year, monthNumber - 1, 1),
    end: new Date(year, monthNumber, 1),
  };
}

describe('BudgetsRepository integration', () => {
  const database = new DatabaseService(
    new ConfigService<Environment, true>({ DATABASE_URL: databaseUrl }),
  );
  const repository = new BudgetsRepository(database);
  const accountsRepository = new AccountsRepository(database);
  const categoriesRepository = new CategoriesRepository(database);
  const transactionsRepository = new TransactionsRepository(database);

  beforeEach(async () => {
    await database.db.delete(budgets);
    await database.db.delete(transactions);
    await database.db.delete(categories);
    await database.db.delete(accounts);
  });

  afterAll(async () => {
    await database.db.delete(budgets);
    await database.db.delete(transactions);
    await database.db.delete(categories);
    await database.db.delete(accounts);
    await database.onApplicationShutdown();
  });

  it('enforces one budget per category and month', async () => {
    const category = await categoriesRepository.create({
      name: 'Alimentación',
      type: 'expense',
    });
    await repository.create({
      categoryId: category.id,
      month: '2026-08-01',
      currency: 'GTQ',
      limitAmount: '1000.0000',
    });

    await expect(
      repository.create({
        categoryId: category.id,
        month: '2026-08-01',
        currency: 'GTQ',
        limitAmount: '500.0000',
      }),
    ).rejects.toMatchObject({
      cause: {
        code: '23505',
        constraint_name: 'budgets_category_month_unique',
      },
    });
  });

  it('updates an existing budget and toggles the active flag', async () => {
    const category = await categoriesRepository.create({
      name: 'Alimentación',
      type: 'expense',
    });
    const created = await repository.create({
      categoryId: category.id,
      month: '2026-08-01',
      currency: 'GTQ',
      limitAmount: '1000.0000',
    });

    const updated = await repository.updateById(created.id, {
      categoryId: category.id,
      month: '2026-08-01',
      currency: 'GTQ',
      limitAmount: '1500.0000',
    });
    expect(updated).toMatchObject({ limitAmount: '1500.0000' });

    const deactivated = await repository.setActive(created.id, false);
    expect(deactivated).toMatchObject({ isActive: false });

    const reactivated = await repository.setActive(created.id, true);
    expect(reactivated).toMatchObject({ isActive: true });
  });

  it('returns undefined when updating or setting active state on an unknown budget', async () => {
    await expect(
      repository.updateById('00000000-0000-0000-0000-000000000000', {
        categoryId: '00000000-0000-0000-0000-000000000001',
        month: '2026-08-01',
        currency: 'GTQ',
        limitAmount: '10.0000',
      }),
    ).resolves.toBeUndefined();
    await expect(
      repository.setActive('00000000-0000-0000-0000-000000000000', false),
    ).resolves.toBeUndefined();
  });

  it('computes spend only from active expense movements of the same category, currency and month', async () => {
    const account = await accountsRepository.create({
      name: 'Cuenta principal',
      type: 'checking',
      currency: 'GTQ',
      openingBalance: '0.0000',
    });
    const otherCurrencyAccount = await accountsRepository.create({
      name: 'Cuenta en dólares',
      type: 'checking',
      currency: 'USD',
      openingBalance: '0.0000',
    });
    const foodCategory = await categoriesRepository.create({
      name: 'Alimentación',
      type: 'expense',
    });
    const otherCategory = await categoriesRepository.create({
      name: 'Transporte',
      type: 'expense',
    });
    const incomeCategory = await categoriesRepository.create({
      name: 'Salario',
      type: 'income',
    });

    const budget = await repository.create({
      categoryId: foodCategory.id,
      month: '2026-08-01',
      currency: 'GTQ',
      limitAmount: '1000.0000',
    });

    // Counts: within month, same category and currency, active.
    await transactionsRepository.create({
      type: 'expense',
      amount: '150.0000',
      currency: 'GTQ',
      accountId: account.id,
      categoryId: foodCategory.id,
      occurredAt: new Date('2026-08-10T12:00:00.000Z'),
    });
    await transactionsRepository.create({
      type: 'expense',
      amount: '50.0000',
      currency: 'GTQ',
      accountId: account.id,
      categoryId: foodCategory.id,
      occurredAt: new Date('2026-08-20T12:00:00.000Z'),
    });

    // Excluded: inactive.
    const inactive = await transactionsRepository.create({
      type: 'expense',
      amount: '900.0000',
      currency: 'GTQ',
      accountId: account.id,
      categoryId: foodCategory.id,
      occurredAt: new Date('2026-08-05T12:00:00.000Z'),
    });
    await transactionsRepository.setActive(inactive.id, false);

    // Excluded: different category.
    await transactionsRepository.create({
      type: 'expense',
      amount: '80.0000',
      currency: 'GTQ',
      accountId: account.id,
      categoryId: otherCategory.id,
      occurredAt: new Date('2026-08-11T12:00:00.000Z'),
    });

    // Excluded: different currency.
    await transactionsRepository.create({
      type: 'expense',
      amount: '20.0000',
      currency: 'USD',
      accountId: otherCurrencyAccount.id,
      categoryId: foodCategory.id,
      occurredAt: new Date('2026-08-12T12:00:00.000Z'),
    });

    // Excluded: outside the month.
    await transactionsRepository.create({
      type: 'expense',
      amount: '999.0000',
      currency: 'GTQ',
      accountId: account.id,
      categoryId: foodCategory.id,
      occurredAt: new Date('2026-07-31T12:00:00.000Z'),
    });

    // Excluded: income, not expense.
    await transactionsRepository.create({
      type: 'income',
      amount: '500.0000',
      currency: 'GTQ',
      accountId: account.id,
      categoryId: incomeCategory.id,
      occurredAt: new Date('2026-08-13T12:00:00.000Z'),
    });

    const { start, end } = monthRange('2026-08');
    const result = await repository.findAllWithSpend(
      '2026-08-01',
      start,
      end,
    );

    expect(result).toEqual([
      {
        ...budget,
        spent: '200.0000',
        remaining: '800.0000',
      },
    ]);
  });

  it('returns the full limit as remaining for a month without matching movements', async () => {
    const category = await categoriesRepository.create({
      name: 'Alimentación',
      type: 'expense',
    });
    const budget = await repository.create({
      categoryId: category.id,
      month: '2026-09-01',
      currency: 'GTQ',
      limitAmount: '400.0000',
    });

    const { start, end } = monthRange('2026-09');
    const result = await repository.findAllWithSpend(
      '2026-09-01',
      start,
      end,
    );

    expect(result).toEqual([{ ...budget, spent: '0.0000', remaining: '400.0000' }]);
  });
});
