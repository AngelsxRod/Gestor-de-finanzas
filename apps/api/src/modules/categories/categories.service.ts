import { ConflictException, Injectable } from '@nestjs/common';
import type {
  Category as CategoryResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  ListCategoriesResponse,
} from '@gestor-finanzas/contracts';
import type { Category } from '@gestor-finanzas/models';
import { CategoriesRepository } from './categories.repository.js';

type DatabaseError = Error & {
  cause?: unknown;
  code?: string;
  constraint_name?: string;
};

function isCategoryNameConflict(error: unknown): error is DatabaseError {
  if (!(error instanceof Error)) return false;

  if (
    'code' in error &&
    error.code === '23505' &&
    'constraint_name' in error &&
    error.constraint_name === 'categories_name_type_unique'
  ) {
    return true;
  }

  return 'cause' in error && isCategoryNameConflict(error.cause);
}

function toResponse(category: Category): CategoryResponse {
  return {
    id: category.id,
    name: category.name,
    type: category.type,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async list(): Promise<ListCategoriesResponse> {
    const categories = await this.categoriesRepository.findAll();
    return { categories: categories.map(toResponse) };
  }

  async create(input: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    try {
      const category = await this.categoriesRepository.create(input);
      return { category: toResponse(category) };
    } catch (error) {
      if (isCategoryNameConflict(error)) {
        throw new ConflictException({
          code: 'CATEGORY_NAME_CONFLICT',
          message: 'Ya existe una categoría con ese nombre y tipo.',
        });
      }
      throw error;
    }
  }
}
