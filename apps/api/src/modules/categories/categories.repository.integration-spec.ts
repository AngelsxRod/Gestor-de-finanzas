import { ConfigService } from '@nestjs/config';
import { categories } from '@gestor-finanzas/models';
import { describe, expect, it } from 'vitest';
import type { Environment } from '../../config/environment.js';
import { DatabaseService } from '../database/database.service.js';
import { CategoriesRepository } from './categories.repository.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith('_test')) {
  throw new Error('Integration tests require an isolated *_test database');
}

describe('CategoriesRepository integration', () => {
  const database = new DatabaseService(
    new ConfigService<Environment, true>({ DATABASE_URL: databaseUrl }),
  );
  const repository = new CategoriesRepository(database);

  beforeEach(async () => {
    await database.db.delete(categories);
  });

  afterAll(async () => {
    await database.db.delete(categories);
    await database.onApplicationShutdown();
  });

  it('persists categories and orders by type, name and id', async () => {
    await repository.create({ name: 'Vivienda', type: 'expense' });
    await repository.create({ name: 'Alimentación', type: 'expense' });
    await repository.create({ name: 'Salario', type: 'income' });

    const result = await repository.findAll();

    expect(result.map(({ type, name }) => `${type}:${name}`)).toEqual([
      'income:Salario',
      'expense:Alimentación',
      'expense:Vivienda',
    ]);
  });

  it('enforces case-insensitive uniqueness within a type only', async () => {
    await repository.create({ name: 'Comida', type: 'expense' });
    await repository.create({ name: 'comida', type: 'income' });

    await expect(
      repository.create({ name: 'COMIDA', type: 'expense' }),
    ).rejects.toMatchObject({
      cause: { code: '23505', constraint_name: 'categories_name_type_unique' },
    });
  });

  it('updates an existing category and refreshes updatedAt', async () => {
    const created = await repository.create({
      name: 'Transporte',
      type: 'expense',
    });

    const updated = await repository.updateById(created.id, {
      name: 'Transporte público',
      type: 'expense',
    });

    expect(updated).toMatchObject({ name: 'Transporte público' });
    expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
      created.updatedAt.getTime(),
    );
  });

  it('returns undefined when updating a category that does not exist', async () => {
    await expect(
      repository.updateById('00000000-0000-0000-0000-000000000000', {
        name: 'Comida',
        type: 'expense',
      }),
    ).resolves.toBeUndefined();
  });

  it('toggles the active flag', async () => {
    const created = await repository.create({
      name: 'Salud',
      type: 'expense',
    });

    const deactivated = await repository.setActive(created.id, false);
    expect(deactivated).toMatchObject({ isActive: false });

    const reactivated = await repository.setActive(created.id, true);
    expect(reactivated).toMatchObject({ isActive: true });
  });

  it('returns undefined when setting active state on an unknown category', async () => {
    await expect(
      repository.setActive('00000000-0000-0000-0000-000000000000', false),
    ).resolves.toBeUndefined();
  });

  it('finds a category by id and returns undefined when it does not exist', async () => {
    const created = await repository.create({
      name: 'Salud',
      type: 'expense',
    });

    await expect(repository.findById(created.id)).resolves.toMatchObject({
      id: created.id,
      name: 'Salud',
    });
    await expect(
      repository.findById('00000000-0000-0000-0000-000000000000'),
    ).resolves.toBeUndefined();
  });
});
