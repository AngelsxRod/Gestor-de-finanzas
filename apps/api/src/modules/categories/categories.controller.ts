import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  createCategoryRequestSchema,
  type CreateCategoryRequest,
  type CreateCategoryResponse,
  type ListCategoriesResponse,
} from '@gestor-finanzas/contracts';
import { CategoriesService } from './categories.service.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  list(): Promise<ListCategoriesResponse> {
    return this.categoriesService.list();
  }

  @Post()
  create(
    @Body({ schema: createCategoryRequestSchema }) input: CreateCategoryRequest,
  ): Promise<CreateCategoryResponse> {
    return this.categoriesService.create(input);
  }
}
