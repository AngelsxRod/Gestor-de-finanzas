import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { accounts } from './accounts.js';
import { categories } from './categories.js';

export const transactionType = pgEnum('transaction_type', [
  'income',
  'expense',
  'transfer',
]);

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    type: transactionType('type').notNull(),
    amount: numeric('amount', { precision: 19, scale: 4 }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull(),
    accountId: uuid('account_id')
      .notNull()
      .references(() => accounts.id, { onDelete: 'restrict' }),
    transferAccountId: uuid('transfer_account_id').references(
      () => accounts.id,
      { onDelete: 'restrict' },
    ),
    categoryId: uuid('category_id').references(() => categories.id, {
      onDelete: 'restrict',
    }),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
    notes: text('notes'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('transactions_account_occurred_at_idx').on(
      table.accountId,
      table.occurredAt,
    ),
    index('transactions_transfer_account_idx').on(table.transferAccountId),
    index('transactions_category_idx').on(table.categoryId),
    check('transactions_amount_positive', sql`${table.amount} > 0`),
    check(
      'transactions_currency_iso_format',
      sql`${table.currency} ~ '^[A-Z]{3}$'`,
    ),
    check(
      'transactions_shape_by_type',
      sql`(
        (${table.type} = 'transfer' AND ${table.transferAccountId} IS NOT NULL AND ${table.categoryId} IS NULL AND ${table.transferAccountId} <> ${table.accountId})
        OR
        (${table.type} IN ('income', 'expense') AND ${table.transferAccountId} IS NULL AND ${table.categoryId} IS NOT NULL)
      )`,
    ),
  ],
);

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
