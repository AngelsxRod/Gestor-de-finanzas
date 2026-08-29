import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  createCategoryRequestSchema,
  setCategoryActiveRequestSchema,
  updateCategoryRequestSchema,
  type CreateCategoryRequest,
  type CreateCategoryResponse,
  type ListCategoriesResponse,
  type SetCategoryActiveRequest,
  type SetCategoryActiveResponse,
  type UpdateCategoryRequest,
  type UpdateCategoryResponse,
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

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body({ schema: updateCategoryRequestSchema })
    input: UpdateCategoryRequest,
  ): Promise<UpdateCategoryResponse> {
    return this.categoriesService.update(id, input);
  }

  @Patch(':id/active')
  setActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body({ schema: setCategoryActiveRequestSchema })
    input: SetCategoryActiveRequest,
  ): Promise<SetCategoryActiveResponse> {
    return this.categoriesService.setActive(id, input.isActive);
  }
}
