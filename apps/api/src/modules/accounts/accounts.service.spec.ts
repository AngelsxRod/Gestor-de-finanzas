import { ConflictException } from '@nestjs/common';
import type { Account } from '@gestor-finanzas/models';
import { describe, expect, it, vi } from 'vitest';
import type { AccountsRepository } from './accounts.repository.js';
import { AccountsService } from './accounts.service.js';

const persistedAccount: Account = {
  id: 'f1700f2a-f1c2-4fc2-8432-ffb13bb24e6e',
  name: 'Cuenta principal',
  type: 'checking',
  currency: 'GTQ',
  openingBalance: '1250.5000',
  isActive: true,
  createdAt: new Date('2026-08-29T12:00:00.000Z'),
  updatedAt: new Date('2026-08-29T12:00:00.000Z'),
};

function createRepositoryMock() {
  return {
    create: vi.fn(),
    findAll: vi.fn(),
  };
}

describe('AccountsService', () => {
  it('maps persisted accounts to the public list contract', async () => {
    const repository = createRepositoryMock();
    repository.findAll.mockResolvedValue([persistedAccount]);
    const service = new AccountsService(
      repository as unknown as AccountsRepository,
    );

    await expect(service.list()).resolves.toEqual({
      accounts: [
        {
          ...persistedAccount,
          createdAt: '2026-08-29T12:00:00.000Z',
          updatedAt: '2026-08-29T12:00:00.000Z',
        },
      ],
    });
  });

  it('creates an account and returns the public contract', async () => {
    const repository = createRepositoryMock();
    repository.create.mockResolvedValue(persistedAccount);
    const service = new AccountsService(
      repository as unknown as AccountsRepository,
    );
    const input = {
      name: 'Cuenta principal',
      type: 'checking' as const,
      currency: 'GTQ',
      openingBalance: '1250.5000',
    };

    await expect(service.create(input)).resolves.toEqual({
      account: {
        ...persistedAccount,
        createdAt: '2026-08-29T12:00:00.000Z',
        updatedAt: '2026-08-29T12:00:00.000Z',
      },
    });
    expect(repository.create).toHaveBeenCalledWith(input);
  });

  it('converts only the account-name unique violation into a public conflict', async () => {
    const repository = createRepositoryMock();
    repository.create.mockRejectedValue(
      Object.assign(new Error('wrapped query detail'), {
        cause: Object.assign(new Error('private database detail'), {
          code: '23505',
          constraint_name: 'accounts_name_unique',
        }),
      }),
    );
    const service = new AccountsService(
      repository as unknown as AccountsRepository,
    );

    const result = service.create({
      name: 'Cuenta principal',
      type: 'checking',
      currency: 'GTQ',
      openingBalance: '0.0000',
    });

    await expect(result).rejects.toBeInstanceOf(ConflictException);
    await expect(result).rejects.toMatchObject({
      response: {
        code: 'ACCOUNT_NAME_CONFLICT',
        message: 'Ya existe una cuenta con ese nombre.',
      },
    });
  });

  it('does not convert unrelated database errors into account conflicts', async () => {
    const repository = createRepositoryMock();
    const databaseError = Object.assign(new Error('database unavailable'), {
      code: 'ECONNREFUSED',
    });
    repository.create.mockRejectedValue(databaseError);
    const service = new AccountsService(
      repository as unknown as AccountsRepository,
    );

    await expect(
      service.create({
        name: 'Cuenta principal',
        type: 'checking',
        currency: 'GTQ',
        openingBalance: '0.0000',
      }),
    ).rejects.toBe(databaseError);
  });
});
