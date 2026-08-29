import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  createTransactionRequestSchema,
  type CreateTransactionRequest,
  type CreateTransactionResponse,
  type ListTransactionsResponse,
} from '@gestor-finanzas/contracts';
import { TransactionsService } from './transactions.service.js';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  list(): Promise<ListTransactionsResponse> {
    return this.transactionsService.list();
  }

  @Post()
  create(
    @Body({ schema: createTransactionRequestSchema })
    input: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse> {
    return this.transactionsService.create(input);
  }
}
