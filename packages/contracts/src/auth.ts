import { z } from 'zod';

export const loginRequestSchema = z.strictObject({
  username: z.string({ error: 'El usuario es obligatorio.' }).min(1, 'El usuario es obligatorio.'),
  password: z
    .string({ error: 'La contraseña es obligatoria.' })
    .min(1, 'La contraseña es obligatoria.'),
});

export const sessionResponseSchema = z.strictObject({
  username: z.string().min(1),
});

export const loginResponseSchema = sessionResponseSchema;

export const logoutResponseSchema = z.strictObject({
  success: z.literal(true),
});

export const authErrorCodeSchema = z.enum([
  'VALIDATION_ERROR',
  'AUTH_INVALID_CREDENTIALS',
  'UNAUTHENTICATED',
  'AUTH_TOO_MANY_ATTEMPTS',
]);

export const authErrorResponseSchema = z.strictObject({
  code: authErrorCodeSchema,
  message: z.string().min(1),
  details: z.array(z.string()).optional(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type AuthErrorResponse = z.infer<typeof authErrorResponseSchema>;
