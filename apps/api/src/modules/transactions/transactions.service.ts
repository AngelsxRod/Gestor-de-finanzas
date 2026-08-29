import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type {
  CreateTransactionRequest,
  CreateTransactionResponse,
  ListTransactionsResponse,
  SetTransactionActiveResponse,
  Transaction as TransactionResponse,
  UpdateTransactionRequest,
  UpdateTransactionResponse,
} from '@gestor-finanzas/contracts';
import type { Account, NewTransaction, Transaction } from '@gestor-finanzas/models';
import { AccountsRepository } from '../accounts/accounts.repository.js';
import { CategoriesRepository } from '../categories/categories.repository.js';
import { TransactionsRepository } from './transactions.repository.js';

type IncomeOrExpenseRequest = Extract<
  CreateTransactionRequest,
  { type: 'income' | 'expense' }
>;
type TransferRequest = Extract<CreateTransactionRequest, { type: 'transfer' }>;

function toResponse(transaction: Transaction): TransactionResponse {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: transaction.amount,
    currency: transaction.currency,
    accountId: transaction.accountId,
    transferAccountId: transaction.transferAccountId,
    categoryId: transaction.categoryId,
    occurredAt: transaction.occurredAt.toISOString(),
    notes: transaction.notes,
    isActive: transaction.isActive,
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  };
}

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly accountsRepository: AccountsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async list(): Promise<ListTransactionsResponse> {
    const transactions = await this.transactionsRepository.findAll();

    return { transactions: transactions.map(toResponse) };
  }

  async create(
    input: CreateTransactionRequest,
  ): Promise<CreateTransactionResponse> {
    const values = await this.buildValues(input);
    const transaction = await this.transactionsRepository.create(values);

    return { transaction: toResponse(transaction) };
  }

  async update(
    id: string,
    input: UpdateTransactionRequest,
  ): Promise<UpdateTransactionResponse> {
    const values = await this.buildValues(input);
    const transaction = await this.transactionsRepository.updateById(
      id,
      values,
    );

    if (!transaction) {
      throw new NotFoundException({
        code: 'TRANSACTION_NOT_FOUND',
        message: 'No se encontró el movimiento solicitado.',
      });
    }

    return { transaction: toResponse(transaction) };
  }

  async setActive(
    id: string,
    isActive: boolean,
  ): Promise<SetTransactionActiveResponse> {
    const transaction = await this.transactionsRepository.setActive(
      id,
      isActive,
    );

    if (!transaction) {
      throw new NotFoundException({
        code: 'TRANSACTION_NOT_FOUND',
        message: 'No se encontró el movimiento solicitado.',
      });
    }

    return { transaction: toResponse(transaction) };
  }

  private async buildValues(
    input: CreateTransactionRequest,
  ): Promise<NewTransaction> {
    const account = await this.requireActiveAccount(
      input.accountId,
      'La cuenta está inactiva.',
      'No se encontró la cuenta solicitada.',
    );

    return input.type === 'transfer'
      ? this.buildTransferValues(input, account)
      : this.buildIncomeExpenseValues(input, account);
  }

  private async requireActiveAccount(
    id: string,
    inactiveMessage: string,
    notFoundMessage: string,
  ): Promise<Account> {
    const account = await this.accountsRepository.findById(id);

    if (!account) {
      throw new NotFoundException({
        code: 'TRANSACTION_ACCOUNT_NOT_FOUND',
        message: notFoundMessage,
      });
    }

    if (!account.isActive) {
      throw new UnprocessableEntityException({
        code: 'TRANSACTION_ACCOUNT_INACTIVE',
        message: inactiveMessage,
      });
    }

    return account;
  }

  private async buildIncomeExpenseValues(
    input: IncomeOrExpenseRequest,
    account: Account,
  ): Promise<NewTransaction> {
    const category = await this.categoriesRepository.findById(
      input.categoryId,
    );

    if (!category) {
      throw new NotFoundException({
        code: 'TRANSACTION_CATEGORY_NOT_FOUND',
        message: 'No se encontró la categoría solicitada.',
      });
    }

    if (!category.isActive) {
      throw new UnprocessableEntityException({
        code: 'TRANSACTION_CATEGORY_INACTIVE',
        message: 'La categoría está inactiva.',
      });
    }

    if (category.type !== input.type) {
      throw new UnprocessableEntityException({
        code: 'TRANSACTION_CATEGORY_TYPE_MISMATCH',
        message: 'El tipo de categoría no coincide con el del movimiento.',
      });
    }

    return {
      type: input.type,
      amount: input.amount,
      currency: account.currency,
      accountId: input.accountId,
      categoryId: input.categoryId,
      occurredAt: new Date(input.occurredAt),
      notes: input.notes ?? null,
    };
  }

  private async buildTransferValues(
    input: TransferRequest,
    account: Account,
  ): Promise<NewTransaction> {
    if (input.transferAccountId === input.accountId) {
      throw new UnprocessableEntityException({
        code: 'TRANSACTION_SAME_ACCOUNT',
        message:
          'La cuenta destino debe ser diferente de la cuenta de origen.',
      });
    }

    const transferAccount = await this.requireActiveAccount(
      input.transferAccountId,
      'La cuenta destino está inactiva.',
      'No se encontró la cuenta destino.',
    );

    if (transferAccount.currency !== account.currency) {
      throw new UnprocessableEntityException({
        code: 'TRANSACTION_CURRENCY_MISMATCH',
        message: 'Las cuentas de la transferencia deben usar la misma moneda.',
      });
    }

    return {
      type: 'transfer',
      amount: input.amount,
      currency: account.currency,
      accountId: input.accountId,
      transferAccountId: input.transferAccountId,
      categoryId: null,
      occurredAt: new Date(input.occurredAt),
      notes: input.notes ?? null,
    };
  }
}
