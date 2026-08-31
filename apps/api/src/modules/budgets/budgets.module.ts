import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module.js';
import { BudgetsController } from './budgets.controller.js';
import { BudgetsRepository } from './budgets.repository.js';
import { BudgetsService } from './budgets.service.js';

@Module({
  imports: [CategoriesModule],
  controllers: [BudgetsController],
  providers: [BudgetsRepository, BudgetsService],
})
export class BudgetsModule {}
