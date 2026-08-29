import { z } from 'zod';

export const accountTypeSchema = z.enum([
  'cash',
  'checking',
  'savings',
  'credit',
  'investment',
]);

const decimalInputPattern = /^-?\d{1,15}(?:\.\d{1,4})?$/;
const decimalPattern = /^-?\d{1,15}\.\d{4}$/;

function normalizeDecimal(value: string): string {
  const negative = value.startsWith('-');
  const unsigned = negative ? value.slice(1) : value;
  const [rawInteger, rawFraction = ''] = unsigned.split('.');
  const integer = rawInteger.replace(/^0+(?=\d)/, '');
  const fraction = rawFraction.padEnd(4, '0');
  const normalized = `${integer}.${fraction}`;

  return negative && normalized !== '0.0000' ? `-${normalized}` : normalized;
}

export const decimalAmountSchema = z.string().regex(decimalPattern);

export const createAccountRequestSchema = z
  .strictObject({
    name: z.string().trim().min(1).max(100),
    type: accountTypeSchema,
    currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/),
    openingBalance: z
      .string()
      .trim()
      .regex(decimalInputPattern)
      .transform(normalizeDecimal),
  });

export const accountSchema = z.strictObject({
  id: z.uuid(),
  name: z.string().min(1).max(100),
  type: accountTypeSchema,
  currency: z.string().regex(/^[A-Z]{3}$/),
  openingBalance: decimalAmountSchema,
  isActive: z.boolean(),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

export const updateAccountRequestSchema = createAccountRequestSchema;

export const setAccountActiveRequestSchema = z.strictObject({
  isActive: z.boolean(),
});

export const createAccountResponseSchema = z.strictObject({
  account: accountSchema,
});

export const updateAccountResponseSchema = createAccountResponseSchema;

export const setAccountActiveResponseSchema = createAccountResponseSchema;

export const listAccountsResponseSchema = z.strictObject({
  accounts: z.array(accountSchema),
});

export const accountErrorCodeSchema = z.enum([
  'VALIDATION_ERROR',
  'ACCOUNT_NAME_CONFLICT',
  'ACCOUNT_NOT_FOUND',
]);

export const accountErrorResponseSchema = z.strictObject({
  code: accountErrorCodeSchema,
  message: z.string().min(1),
  details: z.array(z.string()).optional(),
});

export type Account = z.infer<typeof accountSchema>;
export type AccountErrorResponse = z.infer<typeof accountErrorResponseSchema>;
export type AccountType = z.infer<typeof accountTypeSchema>;
export type CreateAccountRequest = z.infer<typeof createAccountRequestSchema>;
export type CreateAccountResponse = z.infer<typeof createAccountResponseSchema>;
export type ListAccountsResponse = z.infer<typeof listAccountsResponseSchema>;
export type UpdateAccountRequest = z.infer<typeof updateAccountRequestSchema>;
export type UpdateAccountResponse = z.infer<typeof updateAccountResponseSchema>;
export type SetAccountActiveRequest = z.infer<
  typeof setAccountActiveRequestSchema
>;
export type SetAccountActiveResponse = z.infer<
  typeof setAccountActiveResponseSchema
>;
