import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BudgetForm } from "./budget-form";

const groceriesCategory = {
  id: "c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f10",
  name: "Alimentación",
  type: "expense" as const,
  isActive: true,
  createdAt: "2026-08-29T12:00:00.000Z",
  updatedAt: "2026-08-29T12:00:00.000Z",
};

const inactiveCategory = {
  ...groceriesCategory,
  id: "c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f11",
  name: "Entretenimiento",
  isActive: false,
};

const incomeCategory = {
  ...groceriesCategory,
  id: "c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f12",
  name: "Salario",
  type: "income" as const,
};

const meta = {
  title: "Organisms/Budget form",
  component: BudgetForm,
  args: {
    categories: [groceriesCategory, inactiveCategory, incomeCategory],
    defaultValues: {
      categoryId: "",
      month: "2026-08",
      currency: "GTQ",
      limitAmount: "",
    },
    isSubmitting: false,
    onSubmit: fn().mockResolvedValue(undefined),
  },
} satisfies Meta<typeof BudgetForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Submitting: Story = { args: { isSubmitting: true } };
export const MonthConflict: Story = {
  args: {
    errorMessage: "Ya existe un presupuesto para esa categoría en ese mes.",
    onSubmit: fn(async () => {
      throw new Error("conflicto");
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.selectOptions(canvas.getByLabelText(/^Categoría \*/), [
      groceriesCategory.id,
    ]);
    await userEvent.type(canvas.getByLabelText(/Monto límite/), "500");
    await userEvent.click(
      canvas.getByRole("button", { name: "Guardar presupuesto" }),
    );

    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Ya existe un presupuesto para esa categoría en ese mes.",
    );
  },
};
export const Edit: Story = {
  args: {
    mode: "edit",
    defaultValues: {
      categoryId: groceriesCategory.id,
      month: "2026-08",
      currency: "GTQ",
      limitAmount: "1000.0000",
    },
  },
};

export const ValidationAndSubmit: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Guardar presupuesto" }),
    );
    await expect(
      (await canvas.findAllByRole("alert")).length,
    ).toBeGreaterThan(0);

    await userEvent.selectOptions(canvas.getByLabelText(/^Categoría \*/), [
      groceriesCategory.id,
    ]);
    await userEvent.type(canvas.getByLabelText(/Monto límite/), "500");
    await userEvent.click(
      canvas.getByRole("button", { name: "Guardar presupuesto" }),
    );

    await expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        categoryId: groceriesCategory.id,
        currency: "GTQ",
        limitAmount: "500.0000",
      }),
    );
  },
};
