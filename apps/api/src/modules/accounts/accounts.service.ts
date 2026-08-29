import { ConflictException, Injectable } from '@nestjs/common';
import type {
  Account as AccountResponse,
  CreateAccountRequest,
  CreateAccountResponse,
  ListAccountsResponse,
} from '@gestor-finanzas/contracts';
import type { Account } from '@gestor-finanzas/models';
import { AccountsRepository } from './accounts.repository.js';

type DatabaseError = Error & {
  cause?: unknown;
  code?: string;
  constraint_name?: string;
};

function isAccountNameConflict(error: unknown): error is DatabaseError {
  if (!(error instanceof Error)) {
    return false;
  }

  if (
    'code' in error &&
    error.code === '23505' &&
    'constraint_name' in error &&
    error.constraint_name === 'accounts_name_unique'
  ) {
    return true;
  }

  return 'cause' in error && isAccountNameConflict(error.cause);
}

function toResponse(account: Account): AccountResponse {
  return {
    id: account.id,
    name: account.name,
    type: account.type,
    currency: account.currency,
    openingBalance: account.openingBalance,
    isActive: account.isActive,
    createdAt: account.createdAt.toISOString(),
    updatedAt: account.updatedAt.toISOString(),
  };
}

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async list(): Promise<ListAccountsResponse> {
    const accounts = await this.accountsRepository.findAll();

    return { accounts: accounts.map(toResponse) };
  }

  async create(input: CreateAccountRequest): Promise<CreateAccountResponse> {
    try {
      const account = await this.accountsRepository.create(input);

      return { account: toResponse(account) };
    } catch (error) {
      if (isAccountNameConflict(error)) {
        throw new ConflictException({
          code: 'ACCOUNT_NAME_CONFLICT',
          message: 'Ya existe una cuenta con ese nombre.',
        });
      }

      throw error;
    }
  }
}
