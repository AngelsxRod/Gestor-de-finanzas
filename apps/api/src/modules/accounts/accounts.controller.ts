import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  createAccountRequestSchema,
  type CreateAccountRequest,
  type CreateAccountResponse,
  type ListAccountsResponse,
} from '@gestor-finanzas/contracts';
import { AccountsService } from './accounts.service.js';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  list(): Promise<ListAccountsResponse> {
    return this.accountsService.list();
  }

  @Post()
  create(
    @Body({ schema: createAccountRequestSchema }) input: CreateAccountRequest,
  ): Promise<CreateAccountResponse> {
    return this.accountsService.create(input);
  }
}
