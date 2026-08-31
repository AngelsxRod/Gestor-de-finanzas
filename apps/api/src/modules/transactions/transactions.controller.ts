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
  createTransactionRequestSchema,
  setTransactionActiveRequestSchema,
  updateTransactionRequestSchema,
  type CreateTransactionRequest,
  type CreateTransactionResponse,
  type ListAccountBalancesResponse,
  type ListTransactionsResponse,
  type SetTransactionActiveRequest,
  type SetTransactionActiveResponse,
  type UpdateTransactionRequest,
  type UpdateTransactionResponse,
} from '@gestor-finanzas/contracts';
import { TransactionsService } from './transactions.service.js';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('balances')
  listBalances(): Promise<ListAccountBalancesResponse> {
    return this.transactionsService.listBalances();
  }

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

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body({ schema: updateTransactionRequestSchema })
    input: UpdateTransactionRequest,
  ): Promise<UpdateTransactionResponse> {
    return this.transactionsService.update(id, input);
  }

  @Patch(':id/active')
  setActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body({ schema: setTransactionActiveRequestSchema })
    input: SetTransactionActiveRequest,
  ): Promise<SetTransactionActiveResponse> {
    return this.transactionsService.setActive(id, input.isActive);
  }
}
