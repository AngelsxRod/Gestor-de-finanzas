import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BudgetsTable } from "./budgets-table";

const groceriesCategory = {
  id: "c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f10",
  name: "Alimentación",
  type: "expense" as const,
  isActive: true,
  createdAt: "2026-08-29T12:00:00.000Z",
  updatedAt: "2026-08-29T12:00:00.000Z",
};

const transportCategory = {
  ...groceriesCategory,
  id: "c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f11",
  name: "Transporte",
};

const categoriesById = new Map([
  [groceriesCategory.id, groceriesCategory],
  [transportCategory.id, transportCategory],
]);

const withinBudget = {
  id: "f1700f2a-f1c2-4fc2-8432-ffb13bb24e6e",
  categoryId: groceriesCategory.id,
  month: "2026-08",
  currency: "GTQ",
  limitAmount: "1000.0000",
  spent: "600.0000",
  remaining: "400.0000",
  isActive: true,
  createdAt: "2026-08-29T12:00:00.000Z",
  updatedAt: "2026-08-29T12:00:00.000Z",
};

const overBudget = {
  ...withinBudget,
  id: "f1700f2a-f1c2-4fc2-8432-ffb13bb24e6f",
  categoryId: transportCategory.id,
  limitAmount: "200.0000",
  spent: "350.0000",
  remaining: "-150.0000",
  isActive: false,
};

const meta = {
  title: "Organisms/Budgets table",
  component: BudgetsTable,
} satisfies Meta<typeof BudgetsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { state: "loading" } };
export const Empty: Story = {
  args: {
    state: "success",
    budgets: [],
    categoriesById: new Map(),
    onEdit: fn(),
    onToggleActive: fn(),
  },
};
export const WithBudgets: Story = {
  args: {
    state: "success",
    budgets: [withinBudget, overBudget],
    categoriesById,
    onEdit: fn(),
    onToggleActive: fn(),
  },
};
export const Error: Story = {
  args: { state: "error", isRetrying: false, onRetry: fn() },
};
export const Retrying: Story = {
  args: { state: "error", isRetrying: true, onRetry: fn() },
};
export const EditInteraction: Story = {
  args: {
    state: "success",
    budgets: [withinBudget],
    categoriesById,
    onEdit: fn(),
    onToggleActive: fn(),
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Editar" }),
    );
    if (args.state === "success") {
      await expect(args.onEdit).toHaveBeenCalledWith(withinBudget);
    }
  },
};
export const ToggleActiveInteraction: Story = {
  args: {
    state: "success",
    budgets: [withinBudget],
    categoriesById,
    onEdit: fn(),
    onToggleActive: fn(),
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Desactivar" }),
    );
    if (args.state === "success") {
      await expect(args.onToggleActive).toHaveBeenCalledWith(withinBudget);
    }
  },
};
