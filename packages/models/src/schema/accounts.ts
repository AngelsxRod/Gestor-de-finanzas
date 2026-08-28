import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const accountType = pgEnum('account_type', [
  'cash',
  'checking',
  'savings',
  'credit',
  'investment',
]);

export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    type: accountType('type').notNull(),
    currency: varchar('currency', { length: 3 }).notNull(),
    openingBalance: numeric('opening_balance', {
      precision: 19,
      scale: 4,
    })
      .notNull()
      .default('0'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('accounts_name_unique').on(sql`lower(${table.name})`),
    check('accounts_name_not_blank', sql`length(trim(${table.name})) > 0`),
    check(
      'accounts_currency_iso_format',
      sql`${table.currency} ~ '^[A-Z]{3}$'`,
    ),
  ],
);

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
