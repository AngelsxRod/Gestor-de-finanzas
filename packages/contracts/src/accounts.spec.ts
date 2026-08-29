import { describe, expect, it } from 'vitest';
import {
  accountErrorResponseSchema,
  accountSchema,
  createAccountRequestSchema,
  createAccountResponseSchema,
  listAccountsResponseSchema,
  setAccountActiveRequestSchema,
  updateAccountRequestSchema,
} from './accounts.js';

const account = {
  id: 'f1700f2a-f1c2-4fc2-8432-ffb13bb24e6e',
  name: 'Cuenta principal',
  type: 'checking',
  currency: 'GTQ',
  openingBalance: '1250.5000',
  isActive: true,
  createdAt: '2026-08-29T12:00:00.000Z',
  updatedAt: '2026-08-29T12:00:00.000Z',
} as const;

describe('account contracts', () => {
  it('normalizes a valid create request without losing decimal precision', () => {
    expect(
      createAccountRequestSchema.parse({
        name: '  Cuenta principal  ',
        type: 'checking',
        currency: 'gtq',
        openingBalance: '001250.5',
      }),
    ).toEqual({
      name: 'Cuenta principal',
      type: 'checking',
      currency: 'GTQ',
      openingBalance: '1250.5000',
    });
  });

  it.each([
    { name: '', type: 'cash', currency: 'GTQ', openingBalance: '0' },
    { name: 'Cuenta', type: 'wallet', currency: 'GTQ', openingBalance: '0' },
    { name: 'Cuenta', type: 'cash', currency: 'GT', openingBalance: '0' },
    { name: 'Cuenta', type: 'cash', currency: 'GTQ', openingBalance: '1.23456' },
    { name: 'Cuenta', type: 'cash', currency: 'GTQ', openingBalance: '1234567890123456' },
  ])('rejects an invalid create request: %o', (request) => {
    expect(createAccountRequestSchema.safeParse(request).success).toBe(false);
  });

  it('accepts create and list responses with canonical account values', () => {
    expect(createAccountResponseSchema.parse({ account })).toEqual({ account });
    expect(listAccountsResponseSchema.parse({ accounts: [account] })).toEqual({
      accounts: [account],
    });
    expect(accountSchema.parse(account)).toEqual(account);
  });

  it('accepts the public duplicate-name error without database details', () => {
    expect(
      accountErrorResponseSchema.parse({
        code: 'ACCOUNT_NAME_CONFLICT',
        message: 'Ya existe una cuenta con ese nombre.',
      }),
    ).toEqual({
      code: 'ACCOUNT_NAME_CONFLICT',
      message: 'Ya existe una cuenta con ese nombre.',
    });
  });

  it('accepts the public not-found error', () => {
    expect(
      accountErrorResponseSchema.parse({
        code: 'ACCOUNT_NOT_FOUND',
        message: 'No se encontró la cuenta solicitada.',
      }),
    ).toEqual({
      code: 'ACCOUNT_NOT_FOUND',
      message: 'No se encontró la cuenta solicitada.',
    });
  });

  it('normalizes a valid update request the same way as create', () => {
    expect(
      updateAccountRequestSchema.parse({
        name: 'Cuenta principal',
        type: 'checking',
        currency: 'gtq',
        openingBalance: '1250.5',
      }),
    ).toEqual({
      name: 'Cuenta principal',
      type: 'checking',
      currency: 'GTQ',
      openingBalance: '1250.5000',
    });
  });

  it('accepts a valid set-active request and rejects a non-boolean value', () => {
    expect(setAccountActiveRequestSchema.parse({ isActive: false })).toEqual({
      isActive: false,
    });
    expect(
      setAccountActiveRequestSchema.safeParse({ isActive: 'no' }).success,
    ).toBe(false);
  });
});
