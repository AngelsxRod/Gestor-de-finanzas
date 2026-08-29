import { ConflictException } from '@nestjs/common';
import type { Category } from '@gestor-finanzas/models';
import { describe, expect, it, vi } from 'vitest';
import type { CategoriesRepository } from './categories.repository.js';
import { CategoriesService } from './categories.service.js';

const persistedCategory: Category = {
  id: '14b203a4-b6c4-4d2c-94e4-98d20e87d436',
  name: 'Alimentación',
  type: 'expense',
  createdAt: new Date('2026-08-29T12:00:00.000Z'),
  updatedAt: new Date('2026-08-29T12:00:00.000Z'),
};

function createRepositoryMock() {
  return { create: vi.fn(), findAll: vi.fn() };
}

describe('CategoriesService', () => {
  it('maps persisted categories to the public list contract', async () => {
    const repository = createRepositoryMock();
    repository.findAll.mockResolvedValue([persistedCategory]);
    const service = new CategoriesService(
      repository as unknown as CategoriesRepository,
    );

    await expect(service.list()).resolves.toEqual({
      categories: [
        {
          ...persistedCategory,
          createdAt: '2026-08-29T12:00:00.000Z',
          updatedAt: '2026-08-29T12:00:00.000Z',
        },
      ],
    });
  });

  it('creates a category and returns the public contract', async () => {
    const repository = createRepositoryMock();
    repository.create.mockResolvedValue(persistedCategory);
    const service = new CategoriesService(
      repository as unknown as CategoriesRepository,
    );
    const input = { name: 'Alimentación', type: 'expense' as const };

    await expect(service.create(input)).resolves.toMatchObject({
      category: { name: 'Alimentación', type: 'expense' },
    });
    expect(repository.create).toHaveBeenCalledWith(input);
  });

  it('converts only the category unique violation into a public conflict', async () => {
    const repository = createRepositoryMock();
    repository.create.mockRejectedValue(
      Object.assign(new Error('wrapped query detail'), {
        cause: Object.assign(new Error('private database detail'), {
          code: '23505',
          constraint_name: 'categories_name_type_unique',
        }),
      }),
    );
    const service = new CategoriesService(
      repository as unknown as CategoriesRepository,
    );
    const result = service.create({ name: 'Alimentación', type: 'expense' });

    await expect(result).rejects.toBeInstanceOf(ConflictException);
    await expect(result).rejects.toMatchObject({
      response: {
        code: 'CATEGORY_NAME_CONFLICT',
        message: 'Ya existe una categoría con ese nombre y tipo.',
      },
    });
  });

  it('does not convert unrelated database errors', async () => {
    const repository = createRepositoryMock();
    const error = Object.assign(new Error('database unavailable'), {
      code: 'ECONNREFUSED',
    });
    repository.create.mockRejectedValue(error);
    const service = new CategoriesService(
      repository as unknown as CategoriesRepository,
    );

    await expect(
      service.create({ name: 'Alimentación', type: 'expense' }),
    ).rejects.toBe(error);
  });
});
