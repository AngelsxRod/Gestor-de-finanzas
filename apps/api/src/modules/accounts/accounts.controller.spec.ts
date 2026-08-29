import { Test, type TestingModule } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { AccountsController } from './accounts.controller.js';
import { AccountsService } from './accounts.service.js';

describe('AccountsController', () => {
  it('delegates account creation and listing to the service', async () => {
    const account = {
      id: 'f1700f2a-f1c2-4fc2-8432-ffb13bb24e6e',
      name: 'Caja',
      type: 'cash' as const,
      currency: 'GTQ',
      openingBalance: '0.0000',
      isActive: true,
      createdAt: '2026-08-29T12:00:00.000Z',
      updatedAt: '2026-08-29T12:00:00.000Z',
    };
    const service = {
      create: vi.fn().mockResolvedValue({ account }),
      list: vi.fn().mockResolvedValue({ accounts: [account] }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [{ provide: AccountsService, useValue: service }],
    }).compile();
    const controller = module.get(AccountsController);
    const input = {
      name: 'Caja',
      type: 'cash' as const,
      currency: 'GTQ',
      openingBalance: '0.0000',
    };

    await expect(controller.create(input)).resolves.toEqual({ account });
    await expect(controller.list()).resolves.toEqual({ accounts: [account] });
    expect(service.create).toHaveBeenCalledWith(input);
  });
});
