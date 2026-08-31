import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  createBudgetRequestSchema,
  listBudgetsQuerySchema,
  setBudgetActiveRequestSchema,
  updateBudgetRequestSchema,
  type CreateBudgetRequest,
  type CreateBudgetResponse,
  type ListBudgetsQuery,
  type ListBudgetsResponse,
  type SetBudgetActiveRequest,
  type SetBudgetActiveResponse,
  type UpdateBudgetRequest,
  type UpdateBudgetResponse,
} from '@gestor-finanzas/contracts';
import { BudgetsService } from './budgets.service.js';

@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  list(
    @Query({ schema: listBudgetsQuerySchema }) query: ListBudgetsQuery,
  ): Promise<ListBudgetsResponse> {
    return this.budgetsService.list(query);
  }

  @Post()
  create(
    @Body({ schema: createBudgetRequestSchema }) input: CreateBudgetRequest,
  ): Promise<CreateBudgetResponse> {
    return this.budgetsService.create(input);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body({ schema: updateBudgetRequestSchema })
    input: UpdateBudgetRequest,
  ): Promise<UpdateBudgetResponse> {
    return this.budgetsService.update(id, input);
  }

  @Patch(':id/active')
  setActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body({ schema: setBudgetActiveRequestSchema })
    input: SetBudgetActiveRequest,
  ): Promise<SetBudgetActiveResponse> {
    return this.budgetsService.setActive(id, input.isActive);
  }
}
