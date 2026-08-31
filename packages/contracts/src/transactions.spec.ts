import { describe, expect, it } from 'vitest';
import {
  accountBalanceSchema,
  createTransactionRequestSchema,
  createTransactionResponseSchema,
  listAccountBalancesResponseSchema,
  listTransactionsQuerySchema,
  listTransactionsResponseSchema,
  setTransactionActiveRequestSchema,
  transactionErrorResponseSchema,
  transactionOccurredAtFieldSchema,
  transactionSchema,
  updateTransactionRequestSchema,
} from './transactions.js';

const incomeTransaction = {
  id: 'f1700f2a-f1c2-4fc2-8432-ffb13bb24e6e',
  type: 'income',
  amount: '1250.5000',
  currency: 'GTQ',
  accountId: 'a7536616-4dd5-45c9-8a95-b94e21936a96',
  transferAccountId: null,
  categoryId: 'c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f10',
  occurredAt: '2026-08-29T12:00:00.000Z',
  notes: null,
  isActive: true,
  createdAt: '2026-08-29T12:00:00.000Z',
  updatedAt: '2026-08-29T12:00:00.000Z',
} as const;

describe('transaction contracts', () => {
  it('normalizes a valid income create request without losing decimal precision', () => {
    expect(
      createTransactionRequestSchema.parse({
        type: 'income',
        amount: '001250.5',
        accountId: incomeTransaction.accountId,
        categoryId: incomeTransaction.categoryId,
        occurredAt: '2026-08-29T10:30',
        notes: '  Bono  ',
      }),
    ).toEqual({
      type: 'income',
      amount: '1250.5000',
      accountId: incomeTransaction.accountId,
      categoryId: incomeTransaction.categoryId,
      occurredAt: new Date('2026-08-29T10:30').toISOString(),
      notes: 'Bono',
    });
  });

  it('normalizes a valid transfer create request and drops blank notes', () => {
    expect(
      createTransactionRequestSchema.parse({
        type: 'transfer',
        amount: '10',
        accountId: incomeTransaction.accountId,
        transferAccountId: 'a7536616-4dd5-45c9-8a95-b94e21936a97',
        occurredAt: '2026-08-29T10:30',
        notes: '   ',
      }),
    ).toEqual({
      type: 'transfer',
      amount: '10.0000',
      accountId: incomeTransaction.accountId,
      transferAccountId: 'a7536616-4dd5-45c9-8a95-b94e21936a97',
      occurredAt: new Date('2026-08-29T10:30').toISOString(),
      notes: undefined,
    });
  });

  it.each([
    { type: 'income', amount: '0', accountId: incomeTransaction.accountId, categoryId: incomeTransaction.categoryId, occurredAt: '2026-08-29T10:30' },
    { type: 'income', amount: '-1', accountId: incomeTransaction.accountId, categoryId: incomeTransaction.categoryId, occurredAt: '2026-08-29T10:30' },
    { type: 'income', amount: '1.23456', accountId: incomeTransaction.accountId, categoryId: incomeTransaction.categoryId, occurredAt: '2026-08-29T10:30' },
    { type: 'income', amount: '10', accountId: 'not-a-uuid', categoryId: incomeTransaction.categoryId, occurredAt: '2026-08-29T10:30' },
    { type: 'income', amount: '10', accountId: incomeTransaction.accountId, categoryId: incomeTransaction.categoryId, occurredAt: '2026-08-29' },
    { type: 'income', amount: '10', accountId: incomeTransaction.accountId, categoryId: incomeTransaction.categoryId, occurredAt: '29/08/2026 10:30' },
    { type: 'expense', amount: '10', accountId: incomeTransaction.accountId, occurredAt: '2026-08-29T10:30' },
    { type: 'transfer', amount: '10', accountId: incomeTransaction.accountId, categoryId: incomeTransaction.categoryId, occurredAt: '2026-08-29T10:30' },
    { type: 'transfer', amount: '10', accountId: incomeTransaction.accountId, occurredAt: '2026-08-29T10:30' },
    { type: 'unknown', amount: '10', accountId: incomeTransaction.accountId, categoryId: incomeTransaction.categoryId, occurredAt: '2026-08-29T10:30' },
  ])('rejects an invalid create request: %o', (request) => {
    expect(createTransactionRequestSchema.safeParse(request).success).toBe(
      false,
    );
  });

  it('accepts create and list responses with canonical transaction values', () => {
    expect(
      createTransactionResponseSchema.parse({ transaction: incomeTransaction }),
    ).toEqual({ transaction: incomeTransaction });
    expect(
      listTransactionsResponseSchema.parse({
        transactions: [incomeTransaction],
      }),
    ).toEqual({ transactions: [incomeTransaction] });
    expect(transactionSchema.parse(incomeTransaction)).toEqual(
      incomeTransaction,
    );
  });

  it('accepts a transfer response with a null category and a transfer account', () => {
    const transfer = {
      ...incomeTransaction,
      type: 'transfer',
      transferAccountId: 'a7536616-4dd5-45c9-8a95-b94e21936a97',
      categoryId: null,
    };

    expect(transactionSchema.parse(transfer)).toEqual(transfer);
  });

  it('does not transform the datetime-local value, so submitting it unchanged to the wire schema still validates', () => {
    // Regression: a web form must validate occurredAt with the field schema
    // (no transform) and send that raw value as-is. Pre-transforming it on
    // the client, then letting the wire schema below transform it again,
    // double-converts the value and fails the second parse.
    const rawValue = '2026-08-29T10:30';

    expect(transactionOccurredAtFieldSchema.parse(rawValue)).toBe(rawValue);
    expect(
      createTransactionRequestSchema.safeParse({
        type: 'income',
        amount: '10',
        accountId: incomeTransaction.accountId,
        categoryId: incomeTransaction.categoryId,
        occurredAt: rawValue,
      }).success,
    ).toBe(true);
  });

  it('accepts the public error codes for cross-table validation failures', () => {
    expect(
      transactionErrorResponseSchema.parse({
        code: 'TRANSACTION_CATEGORY_TYPE_MISMATCH',
        message: 'El tipo de categoría no coincide con el del movimiento.',
      }),
    ).toEqual({
      code: 'TRANSACTION_CATEGORY_TYPE_MISMATCH',
      message: 'El tipo de categoría no coincide con el del movimiento.',
    });
  });

  it('accepts the public not-found error', () => {
    expect(
      transactionErrorResponseSchema.parse({
        code: 'TRANSACTION_NOT_FOUND',
        message: 'No se encontró el movimiento solicitado.',
      }),
    ).toEqual({
      code: 'TRANSACTION_NOT_FOUND',
      message: 'No se encontró el movimiento solicitado.',
    });
  });

  it('normalizes a valid update request the same way as create', () => {
    expect(
      updateTransactionRequestSchema.parse({
        type: 'expense',
        amount: '10',
        accountId: incomeTransaction.accountId,
        categoryId: incomeTransaction.categoryId,
        occurredAt: '2026-08-29T10:30',
      }),
    ).toEqual({
      type: 'expense',
      amount: '10.0000',
      accountId: incomeTransaction.accountId,
      categoryId: incomeTransaction.categoryId,
      occurredAt: new Date('2026-08-29T10:30').toISOString(),
      notes: undefined,
    });
  });

  it('accepts a valid set-active request and rejects a non-boolean value', () => {
    expect(setTransactionActiveRequestSchema.parse({ isActive: false })).toEqual(
      { isActive: false },
    );
    expect(
      setTransactionActiveRequestSchema.safeParse({ isActive: 'no' }).success,
    ).toBe(false);
  });

  it('accepts an empty query and a fully populated one', () => {
    expect(listTransactionsQuerySchema.parse({})).toEqual({});
    expect(
      listTransactionsQuerySchema.parse({
        accountId: incomeTransaction.accountId,
        categoryId: incomeTransaction.categoryId,
        type: 'income',
        occurredFrom: '2026-08-01',
        occurredTo: '2026-08-31',
        isActive: 'true',
      }),
    ).toEqual({
      accountId: incomeTransaction.accountId,
      categoryId: incomeTransaction.categoryId,
      type: 'income',
      occurredFrom: '2026-08-01',
      occurredTo: '2026-08-31',
      isActive: 'true',
    });
  });

  it('rejects a query where "desde" is later than "hasta"', () => {
    expect(
      listTransactionsQuerySchema.safeParse({
        occurredFrom: '2026-08-31',
        occurredTo: '2026-08-01',
      }).success,
    ).toBe(false);
  });

  it('accepts account balance responses, including a negative balance', () => {
    const balance = {
      accountId: incomeTransaction.accountId,
      accountName: 'Cuenta principal',
      currency: 'GTQ',
      balance: '-125.5000',
    };

    expect(accountBalanceSchema.parse(balance)).toEqual(balance);
    expect(
      listAccountBalancesResponseSchema.parse({ balances: [balance] }),
    ).toEqual({ balances: [balance] });
  });
});
