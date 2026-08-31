import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  date,
  numeric,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { categories } from './categories.js';

export const budgets = pgTable(
  'budgets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    month: date('month', { mode: 'string' }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull(),
    limitAmount: numeric('limit_amount', { precision: 19, scale: 4 }).notNull(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('budgets_category_month_unique').on(
      table.categoryId,
      table.month,
    ),
    check('budgets_limit_amount_positive', sql`${table.limitAmount} > 0`),
    check(
      'budgets_currency_iso_format',
      sql`${table.currency} ~ '^[A-Z]{3}$'`,
    ),
    check(
      'budgets_month_is_first_of_month',
      sql`date_trunc('month', ${table.month}) = ${table.month}`,
    ),
  ],
);

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;
