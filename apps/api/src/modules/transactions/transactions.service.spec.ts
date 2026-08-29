import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import type { Account, Category, Transaction } from '@gestor-finanzas/models';
import { describe, expect, it, vi } from 'vitest';
import type { AccountsRepository } from '../accounts/accounts.repository.js';
import type { CategoriesRepository } from '../categories/categories.repository.js';
import type { TransactionsRepository } from './transactions.repository.js';
import { TransactionsService } from './transactions.service.js';

const account: Account = {
  id: 'a7536616-4dd5-45c9-8a95-b94e21936a96',
  name: 'Cuenta principal',
  type: 'checking',
  currency: 'GTQ',
  openingBalance: '0.0000',
  isActive: true,
  createdAt: new Date('2026-08-29T12:00:00.000Z'),
  updatedAt: new Date('2026-08-29T12:00:00.000Z'),
};

const transferAccount: Account = {
  ...account,
  id: 'a7536616-4dd5-45c9-8a95-b94e21936a97',
  name: 'Cuenta destino',
};

const category: Category = {
  id: 'c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f10',
  name: 'Salario',
  type: 'income',
  isActive: true,
  createdAt: new Date('2026-08-29T12:00:00.000Z'),
  updatedAt: new Date('2026-08-29T12:00:00.000Z'),
};

const persistedTransaction: Transaction = {
  id: 'f1700f2a-f1c2-4fc2-8432-ffb13bb24e6e',
  type: 'income',
  amount: '1250.5000',
  currency: 'GTQ',
  accountId: account.id,
  transferAccountId: null,
  categoryId: category.id,
  occurredAt: new Date('2026-08-29T10:30:00.000Z'),
  notes: null,
  createdAt: new Date('2026-08-29T12:00:00.000Z'),
  updatedAt: new Date('2026-08-29T12:00:00.000Z'),
};

function createRepositories() {
  const transactionsRepository = {
    findAll: vi.fn(),
    create: vi.fn(),
  };
  const accountsRepository = { findById: vi.fn() };
  const categoriesRepository = { findById: vi.fn() };

  return { transactionsRepository, accountsRepository, categoriesRepository };
}

function createService(
  repositories: ReturnType<typeof createRepositories>,
): TransactionsService {
  return new TransactionsService(
    repositories.transactionsRepository as unknown as TransactionsRepository,
    repositories.accountsRepository as unknown as AccountsRepository,
    repositories.categoriesRepository as unknown as CategoriesRepository,
  );
}

const incomeInput = {
  type: 'income' as const,
  amount: '1250.5000',
  accountId: account.id,
  categoryId: category.id,
  occurredAt: '2026-08-29T10:30:00.000Z',
  notes: undefined,
};

describe('TransactionsService', () => {
  it('maps persisted transactions to the public list contract', async () => {
    const repositories = createRepositories();
    repositories.transactionsRepository.findAll.mockResolvedValue([
      persistedTransaction,
    ]);
    const service = createService(repositories);

    await expect(service.list()).resolves.toEqual({
      transactions: [
        {
          ...persistedTransaction,
          occurredAt: '2026-08-29T10:30:00.000Z',
          createdAt: '2026-08-29T12:00:00.000Z',
          updatedAt: '2026-08-29T12:00:00.000Z',
        },
      ],
    });
  });

  it('creates an income transaction, deriving the currency from the account', async () => {
    const repositories = createRepositories();
    repositories.accountsRepository.findById.mockResolvedValue(account);
    repositories.categoriesRepository.findById.mockResolvedValue(category);
    repositories.transactionsRepository.create.mockResolvedValue(
      persistedTransaction,
    );
    const service = createService(repositories);

    await expect(service.create(incomeInput)).resolves.toEqual({
      transaction: {
        ...persistedTransaction,
        occurredAt: '2026-08-29T10:30:00.000Z',
        createdAt: '2026-08-29T12:00:00.000Z',
        updatedAt: '2026-08-29T12:00:00.000Z',
      },
    });
    expect(repositories.transactionsRepository.create).toHaveBeenCalledWith({
      type: 'income',
      amount: '1250.5000',
      currency: 'GTQ',
      accountId: account.id,
      categoryId: category.id,
      occurredAt: new Date('2026-08-29T10:30:00.000Z'),
      notes: null,
    });
  });

  it('creates a transfer transaction between two active accounts with matching currency', async () => {
    const repositories = createRepositories();
    repositories.accountsRepository.findById.mockImplementation((id: string) =>
      Promise.resolve(id === account.id ? account : transferAccount),
    );
    repositories.transactionsRepository.create.mockResolvedValue({
      ...persistedTransaction,
      type: 'transfer',
      transferAccountId: transferAccount.id,
      categoryId: null,
    });
    const service = createService(repositories);

    const result = await service.create({
      type: 'transfer',
      amount: '100.0000',
      accountId: account.id,
      transferAccountId: transferAccount.id,
      occurredAt: '2026-08-29T10:30:00.000Z',
      notes: undefined,
    });

    expect(result.transaction.transferAccountId).toBe(transferAccount.id);
    expect(repositories.transactionsRepository.create).toHaveBeenCalledWith({
      type: 'transfer',
      amount: '100.0000',
      currency: 'GTQ',
      accountId: account.id,
      transferAccountId: transferAccount.id,
      categoryId: null,
      occurredAt: new Date('2026-08-29T10:30:00.000Z'),
      notes: null,
    });
  });

  it('throws NotFoundException when the account does not exist', async () => {
    const repositories = createRepositories();
    repositories.accountsRepository.findById.mockResolvedValue(undefined);
    const service = createService(repositories);

    const result = service.create(incomeInput);

    await expect(result).rejects.toBeInstanceOf(NotFoundException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'TRANSACTION_ACCOUNT_NOT_FOUND' },
    });
  });

  it('throws UnprocessableEntityException when the account is inactive', async () => {
    const repositories = createRepositories();
    repositories.accountsRepository.findById.mockResolvedValue({
      ...account,
      isActive: false,
    });
    const service = createService(repositories);

    const result = service.create(incomeInput);

    await expect(result).rejects.toBeInstanceOf(UnprocessableEntityException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'TRANSACTION_ACCOUNT_INACTIVE' },
    });
  });

  it('throws NotFoundException when the category does not exist', async () => {
    const repositories = createRepositories();
    repositories.accountsRepository.findById.mockResolvedValue(account);
    repositories.categoriesRepository.findById.mockResolvedValue(undefined);
    const service = createService(repositories);

    const result = service.create(incomeInput);

    await expect(result).rejects.toBeInstanceOf(NotFoundException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'TRANSACTION_CATEGORY_NOT_FOUND' },
    });
  });

  it('throws UnprocessableEntityException when the category is inactive', async () => {
    const repositories = createRepositories();
    repositories.accountsRepository.findById.mockResolvedValue(account);
    repositories.categoriesRepository.findById.mockResolvedValue({
      ...category,
      isActive: false,
    });
    const service = createService(repositories);

    const result = service.create(incomeInput);

    await expect(result).rejects.toBeInstanceOf(UnprocessableEntityException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'TRANSACTION_CATEGORY_INACTIVE' },
    });
  });

  it('throws UnprocessableEntityException when the category type does not match', async () => {
    const repositories = createRepositories();
    repositories.accountsRepository.findById.mockResolvedValue(account);
    repositories.categoriesRepository.findById.mockResolvedValue({
      ...category,
      type: 'expense',
    });
    const service = createService(repositories);

    const result = service.create(incomeInput);

    await expect(result).rejects.toBeInstanceOf(UnprocessableEntityException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'TRANSACTION_CATEGORY_TYPE_MISMATCH' },
    });
  });

  it('throws UnprocessableEntityException when the transfer account is the same as the source', async () => {
    const repositories = createRepositories();
    repositories.accountsRepository.findById.mockResolvedValue(account);
    const service = createService(repositories);

    const result = service.create({
      type: 'transfer',
      amount: '10.0000',
      accountId: account.id,
      transferAccountId: account.id,
      occurredAt: '2026-08-29T10:30:00.000Z',
      notes: undefined,
    });

    await expect(result).rejects.toBeInstanceOf(UnprocessableEntityException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'TRANSACTION_SAME_ACCOUNT' },
    });
  });

  it('throws NotFoundException when the transfer account does not exist', async () => {
    const repositories = createRepositories();
    repositories.accountsRepository.findById.mockImplementation((id: string) =>
      Promise.resolve(id === account.id ? account : undefined),
    );
    const service = createService(repositories);

    const result = service.create({
      type: 'transfer',
      amount: '10.0000',
      accountId: account.id,
      transferAccountId: transferAccount.id,
      occurredAt: '2026-08-29T10:30:00.000Z',
      notes: undefined,
    });

    await expect(result).rejects.toBeInstanceOf(NotFoundException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'TRANSACTION_ACCOUNT_NOT_FOUND' },
    });
  });

  it('throws UnprocessableEntityException when the transfer currencies do not match', async () => {
    const repositories = createRepositories();
    repositories.accountsRepository.findById.mockImplementation((id: string) =>
      Promise.resolve(
        id === account.id ? account : { ...transferAccount, currency: 'USD' },
      ),
    );
    const service = createService(repositories);

    const result = service.create({
      type: 'transfer',
      amount: '10.0000',
      accountId: account.id,
      transferAccountId: transferAccount.id,
      occurredAt: '2026-08-29T10:30:00.000Z',
      notes: undefined,
    });

    await expect(result).rejects.toBeInstanceOf(UnprocessableEntityException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'TRANSACTION_CURRENCY_MISMATCH' },
    });
  });
});
