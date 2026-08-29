import { z } from 'zod';

export const categoryTypeSchema = z.enum(['income', 'expense'], {
  error: 'Selecciona un tipo de categoría válido.',
});

export const createCategoryRequestSchema = z.strictObject({
  name: z
    .string({ error: 'El nombre es obligatorio.' })
    .trim()
    .min(1, 'El nombre es obligatorio.')
    .max(100, 'El nombre no puede superar 100 caracteres.'),
  type: categoryTypeSchema,
});

export const categorySchema = z.strictObject({
  id: z.uuid(),
  name: z.string().min(1).max(100),
  type: categoryTypeSchema,
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

export const createCategoryResponseSchema = z.strictObject({
  category: categorySchema,
});

export const listCategoriesResponseSchema = z.strictObject({
  categories: z.array(categorySchema),
});

export const categoryErrorCodeSchema = z.enum([
  'VALIDATION_ERROR',
  'CATEGORY_NAME_CONFLICT',
]);

export const categoryErrorResponseSchema = z.strictObject({
  code: categoryErrorCodeSchema,
  message: z.string().min(1),
  details: z.array(z.string()).optional(),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryErrorResponse = z.infer<typeof categoryErrorResponseSchema>;
export type CategoryType = z.infer<typeof categoryTypeSchema>;
export type CreateCategoryRequest = z.infer<typeof createCategoryRequestSchema>;
export type CreateCategoryResponse = z.infer<
  typeof createCategoryResponseSchema
>;
export type ListCategoriesResponse = z.infer<
  typeof listCategoriesResponseSchema
>;
