import { Test, type TestingModule } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { TransactionsController } from './transactions.controller.js';
import { TransactionsService } from './transactions.service.js';

describe('TransactionsController', () => {
  it('delegates transaction creation and listing to the service', async () => {
    const transaction = {
      id: 'f1700f2a-f1c2-4fc2-8432-ffb13bb24e6e',
      type: 'income' as const,
      amount: '1250.5000',
      currency: 'GTQ',
      accountId: 'a7536616-4dd5-45c9-8a95-b94e21936a96',
      transferAccountId: null,
      categoryId: 'c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f10',
      occurredAt: '2026-08-29T12:00:00.000Z',
      notes: null,
      isActive: true,
      createdAt: '2026-08-29T12:00:00.000Z',
      updatedAt: '2026-08-29T12:00:00.000Z',
    };
    const service = {
      create: vi.fn().mockResolvedValue({ transaction }),
      list: vi.fn().mockResolvedValue({ transactions: [transaction] }),
      update: vi.fn().mockResolvedValue({ transaction }),
      setActive: vi.fn().mockResolvedValue({ transaction }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [{ provide: TransactionsService, useValue: service }],
    }).compile();
    const controller = module.get(TransactionsController);
    const input = {
      type: 'income' as const,
      amount: '1250.5000',
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      occurredAt: transaction.occurredAt,
      notes: undefined,
    };

    await expect(controller.create(input)).resolves.toEqual({ transaction });
    await expect(controller.list()).resolves.toEqual({
      transactions: [transaction],
    });
    expect(service.create).toHaveBeenCalledWith(input);

    await expect(controller.update(transaction.id, input)).resolves.toEqual({
      transaction,
    });
    expect(service.update).toHaveBeenCalledWith(transaction.id, input);

    await expect(
      controller.setActive(transaction.id, { isActive: false }),
    ).resolves.toEqual({ transaction });
    expect(service.setActive).toHaveBeenCalledWith(transaction.id, false);
  });
});
