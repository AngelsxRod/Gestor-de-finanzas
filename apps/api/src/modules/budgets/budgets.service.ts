import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type {
  Budget as BudgetResponse,
  BudgetSummary,
  CreateBudgetRequest,
  CreateBudgetResponse,
  ListBudgetsQuery,
  ListBudgetsResponse,
  SetBudgetActiveResponse,
  UpdateBudgetRequest,
  UpdateBudgetResponse,
} from '@gestor-finanzas/contracts';
import type { Budget, NewBudget } from '@gestor-finanzas/models';
import { CategoriesRepository } from '../categories/categories.repository.js';
import {
  BudgetsRepository,
  type BudgetSummaryRow,
} from './budgets.repository.js';

type DatabaseError = Error & {
  cause?: unknown;
  code?: string;
  constraint_name?: string;
};

function isBudgetMonthConflict(error: unknown): error is DatabaseError {
  if (!(error instanceof Error)) return false;

  if (
    'code' in error &&
    error.code === '23505' &&
    'constraint_name' in error &&
    error.constraint_name === 'budgets_category_month_unique'
  ) {
    return true;
  }

  return 'cause' in error && isBudgetMonthConflict(error.cause);
}

function toMonthColumn(month: string): string {
  return `${month}-01`;
}

function toMonthWire(month: string): string {
  return month.slice(0, 7);
}

function toMonthRange(month: string): { start: Date; end: Date } {
  const [year, monthNumber] = month.split('-').map(Number);
  const start = new Date(year, monthNumber - 1, 1);
  const end = new Date(year, monthNumber, 1);

  return { start, end };
}

function toResponse(budget: Budget): BudgetResponse {
  return {
    id: budget.id,
    categoryId: budget.categoryId,
    month: toMonthWire(budget.month),
    currency: budget.currency,
    limitAmount: budget.limitAmount,
    isActive: budget.isActive,
    createdAt: budget.createdAt.toISOString(),
    updatedAt: budget.updatedAt.toISOString(),
  };
}

function toSummaryResponse(row: BudgetSummaryRow): BudgetSummary {
  return { ...toResponse(row), spent: row.spent, remaining: row.remaining };
}

@Injectable()
export class BudgetsService {
  constructor(
    private readonly budgetsRepository: BudgetsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async list(query: ListBudgetsQuery): Promise<ListBudgetsResponse> {
    const { start, end } = toMonthRange(query.month);
    const rows = await this.budgetsRepository.findAllWithSpend(
      toMonthColumn(query.month),
      start,
      end,
    );

    return { budgets: rows.map(toSummaryResponse) };
  }

  async create(input: CreateBudgetRequest): Promise<CreateBudgetResponse> {
    const values = await this.buildValues(input);

    try {
      const budget = await this.budgetsRepository.create(values);

      return { budget: toResponse(budget) };
    } catch (error) {
      if (isBudgetMonthConflict(error)) {
        throw new ConflictException({
          code: 'BUDGET_MONTH_CONFLICT',
          message: 'Ya existe un presupuesto para esa categoría en ese mes.',
        });
      }

      throw error;
    }
  }

  async update(
    id: string,
    input: UpdateBudgetRequest,
  ): Promise<UpdateBudgetResponse> {
    const values = await this.buildValues(input);

    try {
      const budget = await this.budgetsRepository.updateById(id, values);

      if (!budget) {
        throw new NotFoundException({
          code: 'BUDGET_NOT_FOUND',
          message: 'No se encontró el presupuesto solicitado.',
        });
      }

      return { budget: toResponse(budget) };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (isBudgetMonthConflict(error)) {
        throw new ConflictException({
          code: 'BUDGET_MONTH_CONFLICT',
          message: 'Ya existe un presupuesto para esa categoría en ese mes.',
        });
      }

      throw error;
    }
  }

  async setActive(
    id: string,
    isActive: boolean,
  ): Promise<SetBudgetActiveResponse> {
    const budget = await this.budgetsRepository.setActive(id, isActive);

    if (!budget) {
      throw new NotFoundException({
        code: 'BUDGET_NOT_FOUND',
        message: 'No se encontró el presupuesto solicitado.',
      });
    }

    return { budget: toResponse(budget) };
  }

  private async buildValues(input: CreateBudgetRequest): Promise<NewBudget> {
    const category = await this.categoriesRepository.findById(
      input.categoryId,
    );

    if (!category) {
      throw new NotFoundException({
        code: 'BUDGET_CATEGORY_NOT_FOUND',
        message: 'No se encontró la categoría solicitada.',
      });
    }

    if (!category.isActive) {
      throw new UnprocessableEntityException({
        code: 'BUDGET_CATEGORY_INACTIVE',
        message: 'La categoría está inactiva.',
      });
    }

    if (category.type !== 'expense') {
      throw new UnprocessableEntityException({
        code: 'BUDGET_CATEGORY_NOT_EXPENSE',
        message: 'Solo las categorías de gasto pueden tener presupuesto.',
      });
    }

    return {
      categoryId: input.categoryId,
      month: toMonthColumn(input.month),
      currency: input.currency,
      limitAmount: input.limitAmount,
    };
  }
}
