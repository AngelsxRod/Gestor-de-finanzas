import { z } from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  HOST: z.string().min(1).default('127.0.0.1'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3211),
  DATABASE_URL: z
    .url()
    .refine(
      (value) => ['postgres:', 'postgresql:'].includes(new URL(value).protocol),
      {
        message: 'DATABASE_URL must use the postgres or postgresql protocol',
      },
    ),
  ADMIN_USERNAME: z.string().min(1),
  ADMIN_PASSWORD_HASH: z
    .string()
    .regex(
      /^scrypt:\d+:\d+:\d+:[0-9a-f]+:[0-9a-f]+$/,
      'ADMIN_PASSWORD_HASH must be generated with scripts/hash-password.ts',
    ),
  SESSION_SECRET: z.string().min(32),
});

export type Environment = z.infer<typeof environmentSchema>;

export function validateEnvironment(
  values: Record<string, unknown>,
): Environment {
  return environmentSchema.parse(values);
}
