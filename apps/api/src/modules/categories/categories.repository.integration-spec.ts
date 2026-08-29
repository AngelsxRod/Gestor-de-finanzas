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
});
