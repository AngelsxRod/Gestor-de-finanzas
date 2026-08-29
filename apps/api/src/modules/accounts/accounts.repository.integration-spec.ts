import { ConfigService } from '@nestjs/config';
import { accounts } from '@gestor-finanzas/models';
import { describe, expect, it } from 'vitest';
import type { Environment } from '../../config/environment.js';
import { DatabaseService } from '../database/database.service.js';
import { AccountsRepository } from './accounts.repository.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || !new URL(databaseUrl).pathname.endsWith('_test')) {
  throw new Error('Integration tests require an isolated *_test database');
}

describe('AccountsRepository integration', () => {
  const database = new DatabaseService(
    new ConfigService<Environment, true>({ DATABASE_URL: databaseUrl }),
  );
  const repository = new AccountsRepository(database);

  beforeEach(async () => {
    await database.db.delete(accounts);
  });

  afterAll(async () => {
    await database.db.delete(accounts);
    await database.onApplicationShutdown();
  });

  it('persists accounts and lists them in a deterministic order', async () => {
    await repository.create({
      name: 'Zeta',
      type: 'savings',
      currency: 'GTQ',
      openingBalance: '12.3400',
    });
    await repository.create({
      name: 'Alfa',
      type: 'cash',
      currency: 'USD',
      openingBalance: '-5.0000',
    });

    const result = await repository.findAll();

    expect(result.map((account) => account.name)).toEqual(['Alfa', 'Zeta']);
    expect(result[0]).toMatchObject({
      currency: 'USD',
      openingBalance: '-5.0000',
      isActive: true,
    });
  });

  it('enforces case-insensitive unique account names', async () => {
    await repository.create({
      name: 'Ahorros',
      type: 'savings',
      currency: 'GTQ',
      openingBalance: '0.0000',
    });

    await expect(
      repository.create({
        name: 'ahorros',
        type: 'savings',
        currency: 'GTQ',
        openingBalance: '0.0000',
      }),
    ).rejects.toMatchObject({
      cause: {
        code: '23505',
        constraint_name: 'accounts_name_unique',
      },
    });
  });
});
