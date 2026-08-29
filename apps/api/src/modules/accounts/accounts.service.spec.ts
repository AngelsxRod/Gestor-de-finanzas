import { ConflictException, NotFoundException } from '@nestjs/common';
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
    updateById: vi.fn(),
    setActive: vi.fn(),
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

  it('updates an account and returns the public contract', async () => {
    const repository = createRepositoryMock();
    const updated = { ...persistedAccount, name: 'Cuenta renombrada' };
    repository.updateById.mockResolvedValue(updated);
    const service = new AccountsService(
      repository as unknown as AccountsRepository,
    );
    const input = {
      name: 'Cuenta renombrada',
      type: 'checking' as const,
      currency: 'GTQ',
      openingBalance: '1250.5000',
    };

    await expect(service.update(persistedAccount.id, input)).resolves.toEqual(
      {
        account: {
          ...updated,
          createdAt: '2026-08-29T12:00:00.000Z',
          updatedAt: '2026-08-29T12:00:00.000Z',
        },
      },
    );
    expect(repository.updateById).toHaveBeenCalledWith(
      persistedAccount.id,
      input,
    );
  });

  it('throws NotFoundException when updating an unknown account', async () => {
    const repository = createRepositoryMock();
    repository.updateById.mockResolvedValue(undefined);
    const service = new AccountsService(
      repository as unknown as AccountsRepository,
    );

    const result = service.update('missing-id', {
      name: 'Cuenta',
      type: 'cash',
      currency: 'GTQ',
      openingBalance: '0.0000',
    });

    await expect(result).rejects.toBeInstanceOf(NotFoundException);
    await expect(result).rejects.toMatchObject({
      response: {
        code: 'ACCOUNT_NOT_FOUND',
        message: 'No se encontró la cuenta solicitada.',
      },
    });
  });

  it('converts a name conflict on update into a public conflict', async () => {
    const repository = createRepositoryMock();
    repository.updateById.mockRejectedValue(
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

    const result = service.update(persistedAccount.id, {
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

  it('sets the active flag and returns the public contract', async () => {
    const repository = createRepositoryMock();
    const deactivated = { ...persistedAccount, isActive: false };
    repository.setActive.mockResolvedValue(deactivated);
    const service = new AccountsService(
      repository as unknown as AccountsRepository,
    );

    await expect(
      service.setActive(persistedAccount.id, false),
    ).resolves.toEqual({
      account: {
        ...deactivated,
        createdAt: '2026-08-29T12:00:00.000Z',
        updatedAt: '2026-08-29T12:00:00.000Z',
      },
    });
    expect(repository.setActive).toHaveBeenCalledWith(
      persistedAccount.id,
      false,
    );
  });

  it('throws NotFoundException when deactivating an unknown account', async () => {
    const repository = createRepositoryMock();
    repository.setActive.mockResolvedValue(undefined);
    const service = new AccountsService(
      repository as unknown as AccountsRepository,
    );

    const result = service.setActive('missing-id', false);

    await expect(result).rejects.toBeInstanceOf(NotFoundException);
    await expect(result).rejects.toMatchObject({
      response: {
        code: 'ACCOUNT_NOT_FOUND',
        message: 'No se encontró la cuenta solicitada.',
      },
    });
  });
});
