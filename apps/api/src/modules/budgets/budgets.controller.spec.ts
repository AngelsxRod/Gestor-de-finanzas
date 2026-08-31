import { Test, type TestingModule } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { BudgetsController } from './budgets.controller.js';
import { BudgetsService } from './budgets.service.js';

describe('BudgetsController', () => {
  it('delegates budget creation, listing and edition to the service', async () => {
    const budget = {
      id: 'f1700f2a-f1c2-4fc2-8432-ffb13bb24e6e',
      categoryId: 'c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f10',
      month: '2026-08',
      currency: 'GTQ',
      limitAmount: '1000.0000',
      isActive: true,
      createdAt: '2026-08-29T12:00:00.000Z',
      updatedAt: '2026-08-29T12:00:00.000Z',
    };
    const budgetSummary = { ...budget, spent: '300.0000', remaining: '700.0000' };
    const service = {
      create: vi.fn().mockResolvedValue({ budget }),
      list: vi.fn().mockResolvedValue({ budgets: [budgetSummary] }),
      update: vi.fn().mockResolvedValue({ budget }),
      setActive: vi.fn().mockResolvedValue({ budget }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetsController],
      providers: [{ provide: BudgetsService, useValue: service }],
    }).compile();
    const controller = module.get(BudgetsController);
    const input = {
      categoryId: budget.categoryId,
      month: budget.month,
      currency: budget.currency,
      limitAmount: budget.limitAmount,
    };

    await expect(controller.create(input)).resolves.toEqual({ budget });
    expect(service.create).toHaveBeenCalledWith(input);

    await expect(controller.list({ month: '2026-08' })).resolves.toEqual({
      budgets: [budgetSummary],
    });
    expect(service.list).toHaveBeenCalledWith({ month: '2026-08' });

    await expect(controller.update(budget.id, input)).resolves.toEqual({
      budget,
    });
    expect(service.update).toHaveBeenCalledWith(budget.id, input);

    await expect(
      controller.setActive(budget.id, { isActive: false }),
    ).resolves.toEqual({ budget });
    expect(service.setActive).toHaveBeenCalledWith(budget.id, false);
  });
});
