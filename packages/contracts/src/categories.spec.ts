import { describe, expect, it } from "vitest";
import {
  categoryErrorResponseSchema,
  categorySchema,
  createCategoryRequestSchema,
  createCategoryResponseSchema,
  listCategoriesResponseSchema,
} from "./categories.js";

const category = {
  id: "14b203a4-b6c4-4d2c-94e4-98d20e87d436",
  name: "Alimentación",
  type: "expense",
  createdAt: "2026-08-29T12:00:00.000Z",
  updatedAt: "2026-08-29T12:00:00.000Z",
} as const;

describe("category contracts", () => {
  it("trims a valid create request", () => {
    expect(
      createCategoryRequestSchema.parse({
        name: "  Alimentación  ",
        type: "expense",
      }),
    ).toEqual({ name: "Alimentación", type: "expense" });
  });

  it.each([
    { name: "", type: "income" },
    { name: "   ", type: "expense" },
    { name: "a".repeat(101), type: "income" },
    { name: "Salario", type: "transfer" },
  ])("rejects an invalid create request: %o", (request) => {
    expect(createCategoryRequestSchema.safeParse(request).success).toBe(false);
  });

  it("accepts public category, creation and list responses", () => {
    expect(categorySchema.parse(category)).toEqual(category);
    expect(createCategoryResponseSchema.parse({ category })).toEqual({
      category,
    });
    expect(
      listCategoriesResponseSchema.parse({ categories: [category] }),
    ).toEqual({
      categories: [category],
    });
  });

  it("accepts validation and duplicate-name public errors", () => {
    expect(
      categoryErrorResponseSchema.parse({
        code: "VALIDATION_ERROR",
        message: "La solicitud contiene datos inválidos.",
        details: ["El nombre es obligatorio."],
      }),
    ).toMatchObject({ code: "VALIDATION_ERROR" });
    expect(
      categoryErrorResponseSchema.parse({
        code: "CATEGORY_NAME_CONFLICT",
        message: "Ya existe una categoría con ese nombre y tipo.",
      }),
    ).toMatchObject({ code: "CATEGORY_NAME_CONFLICT" });
  });
});
