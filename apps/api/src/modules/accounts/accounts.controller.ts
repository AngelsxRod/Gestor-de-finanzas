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
  createAccountRequestSchema,
  setAccountActiveRequestSchema,
  updateAccountRequestSchema,
  type CreateAccountRequest,
  type CreateAccountResponse,
  type ListAccountsResponse,
  type SetAccountActiveRequest,
  type SetAccountActiveResponse,
  type UpdateAccountRequest,
  type UpdateAccountResponse,
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

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body({ schema: updateAccountRequestSchema }) input: UpdateAccountRequest,
  ): Promise<UpdateAccountResponse> {
    return this.accountsService.update(id, input);
  }

  @Patch(':id/active')
  setActive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body({ schema: setAccountActiveRequestSchema })
    input: SetAccountActiveRequest,
  ): Promise<SetAccountActiveResponse> {
    return this.accountsService.setActive(id, input.isActive);
  }
}
