import { getTableConfig } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';
import { accounts } from './accounts.js';
import { categories } from './categories.js';
import { transactions } from './transactions.js';

describe('finance schema', () => {
  it('defines the three tables required by the first vertical flow', () => {
    expect(
      [accounts, categories, transactions].map(
        (table) => getTableConfig(table).name,
      ),
    ).toEqual(['accounts', 'categories', 'transactions']);
  });

  it('keeps database constraints close to the model', () => {
    expect(getTableConfig(accounts).checks).toHaveLength(2);
    expect(getTableConfig(categories).checks).toHaveLength(1);
    expect(getTableConfig(transactions).checks).toHaveLength(3);
  });
});
