import { ConflictException, NotFoundException } from '@nestjs/common';
import type { Category } from '@gestor-finanzas/models';
import { describe, expect, it, vi } from 'vitest';
import type { CategoriesRepository } from './categories.repository.js';
import { CategoriesService } from './categories.service.js';

const persistedCategory: Category = {
  id: '14b203a4-b6c4-4d2c-94e4-98d20e87d436',
  name: 'Alimentación',
  type: 'expense',
  isActive: true,
  createdAt: new Date('2026-08-29T12:00:00.000Z'),
  updatedAt: new Date('2026-08-29T12:00:00.000Z'),
};

function createRepositoryMock() {
  return {
    create: vi.fn(),
    findAll: vi.fn(),
    updateById: vi.fn(),
    setActive: vi.fn(),
  };
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

  it('updates a category and returns the public contract', async () => {
    const repository = createRepositoryMock();
    const updated = { ...persistedCategory, name: 'Comida' };
    repository.updateById.mockResolvedValue(updated);
    const service = new CategoriesService(
      repository as unknown as CategoriesRepository,
    );
    const input = { name: 'Comida', type: 'expense' as const };

    await expect(
      service.update(persistedCategory.id, input),
    ).resolves.toEqual({
      category: {
        ...updated,
        createdAt: '2026-08-29T12:00:00.000Z',
        updatedAt: '2026-08-29T12:00:00.000Z',
      },
    });
    expect(repository.updateById).toHaveBeenCalledWith(
      persistedCategory.id,
      input,
    );
  });

  it('throws NotFoundException when updating an unknown category', async () => {
    const repository = createRepositoryMock();
    repository.updateById.mockResolvedValue(undefined);
    const service = new CategoriesService(
      repository as unknown as CategoriesRepository,
    );

    const result = service.update('missing-id', {
      name: 'Comida',
      type: 'expense',
    });

    await expect(result).rejects.toBeInstanceOf(NotFoundException);
    await expect(result).rejects.toMatchObject({
      response: {
        code: 'CATEGORY_NOT_FOUND',
        message: 'No se encontró la categoría solicitada.',
      },
    });
  });

  it('converts a name conflict on update into a public conflict', async () => {
    const repository = createRepositoryMock();
    repository.updateById.mockRejectedValue(
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

    const result = service.update(persistedCategory.id, {
      name: 'Alimentación',
      type: 'expense',
    });

    await expect(result).rejects.toBeInstanceOf(ConflictException);
    await expect(result).rejects.toMatchObject({
      response: {
        code: 'CATEGORY_NAME_CONFLICT',
        message: 'Ya existe una categoría con ese nombre y tipo.',
      },
    });
  });

  it('sets the active flag and returns the public contract', async () => {
    const repository = createRepositoryMock();
    const deactivated = { ...persistedCategory, isActive: false };
    repository.setActive.mockResolvedValue(deactivated);
    const service = new CategoriesService(
      repository as unknown as CategoriesRepository,
    );

    await expect(
      service.setActive(persistedCategory.id, false),
    ).resolves.toEqual({
      category: {
        ...deactivated,
        createdAt: '2026-08-29T12:00:00.000Z',
        updatedAt: '2026-08-29T12:00:00.000Z',
      },
    });
    expect(repository.setActive).toHaveBeenCalledWith(
      persistedCategory.id,
      false,
    );
  });

  it('throws NotFoundException when deactivating an unknown category', async () => {
    const repository = createRepositoryMock();
    repository.setActive.mockResolvedValue(undefined);
    const service = new CategoriesService(
      repository as unknown as CategoriesRepository,
    );

    const result = service.setActive('missing-id', false);

    await expect(result).rejects.toBeInstanceOf(NotFoundException);
    await expect(result).rejects.toMatchObject({
      response: {
        code: 'CATEGORY_NOT_FOUND',
        message: 'No se encontró la categoría solicitada.',
      },
    });
  });
});
