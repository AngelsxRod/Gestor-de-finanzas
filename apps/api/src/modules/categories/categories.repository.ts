import { Injectable } from '@nestjs/common';
import {
  categories,
  type Category,
  type NewCategory,
} from '@gestor-finanzas/models';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly database: DatabaseService) {}

  async findAll(): Promise<Category[]> {
    return this.database.db
      .select()
      .from(categories)
      .orderBy(categories.type, categories.name, categories.id);
  }

  async create(values: NewCategory): Promise<Category> {
    const [category] = await this.database.db
      .insert(categories)
      .values(values)
      .returning();

    if (!category) {
      throw new Error('Category insert did not return a record');
    }

    return category;
  }
}
