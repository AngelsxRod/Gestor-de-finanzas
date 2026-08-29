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
      isActive: true,
      createdAt: '2026-08-29T12:00:00.000Z',
      updatedAt: '2026-08-29T12:00:00.000Z',
    };
    const service = {
      create: vi.fn().mockResolvedValue({ category }),
      list: vi.fn().mockResolvedValue({ categories: [category] }),
      update: vi.fn().mockResolvedValue({ category }),
      setActive: vi.fn().mockResolvedValue({ category }),
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

  it('delegates category update and active-state changes to the service', async () => {
    const category = {
      id: '14b203a4-b6c4-4d2c-94e4-98d20e87d436',
      name: 'Comida',
      type: 'expense' as const,
      isActive: false,
      createdAt: '2026-08-29T12:00:00.000Z',
      updatedAt: '2026-08-29T12:00:00.000Z',
    };
    const service = {
      update: vi.fn().mockResolvedValue({ category }),
      setActive: vi.fn().mockResolvedValue({ category }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: service }],
    }).compile();
    const controller = module.get(CategoriesController);
    const input = { name: 'Comida', type: 'expense' as const };

    await expect(controller.update(category.id, input)).resolves.toEqual({
      category,
    });
    expect(service.update).toHaveBeenCalledWith(category.id, input);

    await expect(
      controller.setActive(category.id, { isActive: false }),
    ).resolves.toEqual({ category });
    expect(service.setActive).toHaveBeenCalledWith(category.id, false);
  });
});
