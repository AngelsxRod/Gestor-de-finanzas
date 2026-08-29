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

  it('updates an existing account and refreshes updatedAt', async () => {
    const created = await repository.create({
      name: 'Cuenta original',
      type: 'cash',
      currency: 'GTQ',
      openingBalance: '0.0000',
    });

    const updated = await repository.updateById(created.id, {
      name: 'Cuenta renombrada',
      type: 'savings',
      currency: 'USD',
      openingBalance: '10.0000',
    });

    expect(updated).toMatchObject({
      name: 'Cuenta renombrada',
      type: 'savings',
      currency: 'USD',
      openingBalance: '10.0000',
    });
    expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(
      created.updatedAt.getTime(),
    );
  });

  it('returns undefined when updating an account that does not exist', async () => {
    await expect(
      repository.updateById('00000000-0000-0000-0000-000000000000', {
        name: 'Cuenta',
        type: 'cash',
        currency: 'GTQ',
        openingBalance: '0.0000',
      }),
    ).resolves.toBeUndefined();
  });

  it('toggles the active flag', async () => {
    const created = await repository.create({
      name: 'Cuenta activa',
      type: 'cash',
      currency: 'GTQ',
      openingBalance: '0.0000',
    });

    const deactivated = await repository.setActive(created.id, false);
    expect(deactivated).toMatchObject({ isActive: false });

    const reactivated = await repository.setActive(created.id, true);
    expect(reactivated).toMatchObject({ isActive: true });
  });

  it('returns undefined when setting active state on an unknown account', async () => {
    await expect(
      repository.setActive('00000000-0000-0000-0000-000000000000', false),
    ).resolves.toBeUndefined();
  });
});
