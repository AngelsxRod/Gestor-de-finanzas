import {
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { Budget, Category } from '@gestor-finanzas/models';
import { describe, expect, it, vi } from 'vitest';
import type { CategoriesRepository } from '../categories/categories.repository.js';
import type { BudgetsRepository } from './budgets.repository.js';
import { BudgetsService } from './budgets.service.js';

const expenseCategory: Category = {
  id: 'c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f10',
  name: 'Alimentación',
  type: 'expense',
  isActive: true,
  createdAt: new Date('2026-08-29T12:00:00.000Z'),
  updatedAt: new Date('2026-08-29T12:00:00.000Z'),
};

const persistedBudget: Budget = {
  id: 'f1700f2a-f1c2-4fc2-8432-ffb13bb24e6e',
  categoryId: expenseCategory.id,
  month: '2026-08-01',
  currency: 'GTQ',
  limitAmount: '1000.0000',
  isActive: true,
  createdAt: new Date('2026-08-29T12:00:00.000Z'),
  updatedAt: new Date('2026-08-29T12:00:00.000Z'),
};

const createInput = {
  categoryId: expenseCategory.id,
  month: '2026-08',
  currency: 'GTQ',
  limitAmount: '1000.0000',
};

function createRepositories() {
  const budgetsRepository = {
    findAllWithSpend: vi.fn(),
    create: vi.fn(),
    updateById: vi.fn(),
    setActive: vi.fn(),
  };
  const categoriesRepository = { findById: vi.fn() };

  return { budgetsRepository, categoriesRepository };
}

function createService(repositories: ReturnType<typeof createRepositories>) {
  return new BudgetsService(
    repositories.budgetsRepository as unknown as BudgetsRepository,
    repositories.categoriesRepository as unknown as CategoriesRepository,
  );
}

describe('BudgetsService', () => {
  it('lists budgets for a month with the computed spend and remaining', async () => {
    const repositories = createRepositories();
    repositories.budgetsRepository.findAllWithSpend.mockResolvedValue([
      { ...persistedBudget, spent: '300.0000', remaining: '700.0000' },
    ]);
    const service = createService(repositories);

    await expect(service.list({ month: '2026-08' })).resolves.toEqual({
      budgets: [
        {
          ...persistedBudget,
          month: '2026-08',
          spent: '300.0000',
          remaining: '700.0000',
          createdAt: '2026-08-29T12:00:00.000Z',
          updatedAt: '2026-08-29T12:00:00.000Z',
        },
      ],
    });
    expect(
      repositories.budgetsRepository.findAllWithSpend,
    ).toHaveBeenCalledWith(
      '2026-08-01',
      new Date(2026, 7, 1),
      new Date(2026, 8, 1),
    );
  });

  it('creates a budget for an active expense category', async () => {
    const repositories = createRepositories();
    repositories.categoriesRepository.findById.mockResolvedValue(
      expenseCategory,
    );
    repositories.budgetsRepository.create.mockResolvedValue(persistedBudget);
    const service = createService(repositories);

    await expect(service.create(createInput)).resolves.toEqual({
      budget: {
        ...persistedBudget,
        month: '2026-08',
        createdAt: '2026-08-29T12:00:00.000Z',
        updatedAt: '2026-08-29T12:00:00.000Z',
      },
    });
    expect(repositories.budgetsRepository.create).toHaveBeenCalledWith({
      categoryId: expenseCategory.id,
      month: '2026-08-01',
      currency: 'GTQ',
      limitAmount: '1000.0000',
    });
  });

  it('throws NotFoundException when the category does not exist', async () => {
    const repositories = createRepositories();
    repositories.categoriesRepository.findById.mockResolvedValue(undefined);
    const service = createService(repositories);

    const result = service.create(createInput);

    await expect(result).rejects.toBeInstanceOf(NotFoundException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'BUDGET_CATEGORY_NOT_FOUND' },
    });
  });

  it('throws UnprocessableEntityException when the category is inactive', async () => {
    const repositories = createRepositories();
    repositories.categoriesRepository.findById.mockResolvedValue({
      ...expenseCategory,
      isActive: false,
    });
    const service = createService(repositories);

    const result = service.create(createInput);

    await expect(result).rejects.toBeInstanceOf(UnprocessableEntityException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'BUDGET_CATEGORY_INACTIVE' },
    });
  });

  it('throws UnprocessableEntityException when the category is not an expense category', async () => {
    const repositories = createRepositories();
    repositories.categoriesRepository.findById.mockResolvedValue({
      ...expenseCategory,
      type: 'income',
    });
    const service = createService(repositories);

    const result = service.create(createInput);

    await expect(result).rejects.toBeInstanceOf(UnprocessableEntityException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'BUDGET_CATEGORY_NOT_EXPENSE' },
    });
  });

  it('converts only the budget month unique violation into a public conflict', async () => {
    const repositories = createRepositories();
    repositories.categoriesRepository.findById.mockResolvedValue(
      expenseCategory,
    );
    repositories.budgetsRepository.create.mockRejectedValue(
      Object.assign(new Error('wrapped query detail'), {
        cause: Object.assign(new Error('private database detail'), {
          code: '23505',
          constraint_name: 'budgets_category_month_unique',
        }),
      }),
    );
    const service = createService(repositories);

    const result = service.create(createInput);

    await expect(result).rejects.toBeInstanceOf(ConflictException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'BUDGET_MONTH_CONFLICT' },
    });
  });

  it('does not convert unrelated database errors', async () => {
    const repositories = createRepositories();
    repositories.categoriesRepository.findById.mockResolvedValue(
      expenseCategory,
    );
    const error = Object.assign(new Error('database unavailable'), {
      code: 'ECONNREFUSED',
    });
    repositories.budgetsRepository.create.mockRejectedValue(error);
    const service = createService(repositories);

    await expect(service.create(createInput)).rejects.toBe(error);
  });

  it('updates a budget, re-validating the same business rules as create', async () => {
    const repositories = createRepositories();
    repositories.categoriesRepository.findById.mockResolvedValue(
      expenseCategory,
    );
    const updated = { ...persistedBudget, limitAmount: '1500.0000' };
    repositories.budgetsRepository.updateById.mockResolvedValue(updated);
    const service = createService(repositories);

    await expect(
      service.update(persistedBudget.id, {
        ...createInput,
        limitAmount: '1500.0000',
      }),
    ).resolves.toEqual({
      budget: {
        ...updated,
        month: '2026-08',
        createdAt: '2026-08-29T12:00:00.000Z',
        updatedAt: '2026-08-29T12:00:00.000Z',
      },
    });
  });

  it('throws NotFoundException when updating an unknown budget', async () => {
    const repositories = createRepositories();
    repositories.categoriesRepository.findById.mockResolvedValue(
      expenseCategory,
    );
    repositories.budgetsRepository.updateById.mockResolvedValue(undefined);
    const service = createService(repositories);

    const result = service.update('missing-id', createInput);

    await expect(result).rejects.toBeInstanceOf(NotFoundException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'BUDGET_NOT_FOUND' },
    });
  });

  it('sets the active flag and returns the public contract', async () => {
    const repositories = createRepositories();
    const deactivated = { ...persistedBudget, isActive: false };
    repositories.budgetsRepository.setActive.mockResolvedValue(deactivated);
    const service = createService(repositories);

    await expect(
      service.setActive(persistedBudget.id, false),
    ).resolves.toEqual({
      budget: {
        ...deactivated,
        month: '2026-08',
        createdAt: '2026-08-29T12:00:00.000Z',
        updatedAt: '2026-08-29T12:00:00.000Z',
      },
    });
    expect(repositories.budgetsRepository.setActive).toHaveBeenCalledWith(
      persistedBudget.id,
      false,
    );
  });

  it('throws NotFoundException when deactivating an unknown budget', async () => {
    const repositories = createRepositories();
    repositories.budgetsRepository.setActive.mockResolvedValue(undefined);
    const service = createService(repositories);

    const result = service.setActive('missing-id', false);

    await expect(result).rejects.toBeInstanceOf(NotFoundException);
    await expect(result).rejects.toMatchObject({
      response: { code: 'BUDGET_NOT_FOUND' },
    });
  });
});
