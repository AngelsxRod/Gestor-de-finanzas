import { Test, type TestingModule } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';

describe('CategoriesController', () => {
  it('delegates category creation and listing to the service', async () => {
    const category = {
      id: '14b203a4-b6c4-4d2c-94e4-98d20e87d436',
      name: 'Alimentación',
      type: 'expense' as const,
      createdAt: '2026-08-29T12:00:00.000Z',
      updatedAt: '2026-08-29T12:00:00.000Z',
    };
    const service = {
      create: vi.fn().mockResolvedValue({ category }),
      list: vi.fn().mockResolvedValue({ categories: [category] }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: service }],
    }).compile();
    const controller = module.get(CategoriesController);
    const input = { name: 'Alimentación', type: 'expense' as const };

    await expect(controller.create(input)).resolves.toEqual({ category });
    await expect(controller.list()).resolves.toEqual({
      categories: [category],
    });
    expect(service.create).toHaveBeenCalledWith(input);
  });
});
