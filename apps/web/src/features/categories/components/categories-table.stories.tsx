import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CategoriesTable } from "./categories-table";

const category = {
  id: "14b203a4-b6c4-4d2c-94e4-98d20e87d436",
  name: "Alimentación",
  type: "expense" as const,
  isActive: true,
  createdAt: "2026-08-29T12:00:00.000Z",
  updatedAt: "2026-08-29T12:00:00.000Z",
};

const incomeCategory = {
  ...category,
  id: "a7536616-4dd5-45c9-8a95-b94e21936a96",
  name: "Salario",
  type: "income" as const,
  isActive: false,
};

const meta = {
  title: "Organisms/Categories table",
  component: CategoriesTable,
} satisfies Meta<typeof CategoriesTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { state: "loading" } };
export const Empty: Story = {
  args: {
    state: "success",
    categories: [],
    onEdit: fn(),
    onToggleActive: fn(),
  },
};
export const Success: Story = {
  args: {
    state: "success",
    categories: [category, incomeCategory],
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
    categories: [category],
    onEdit: fn(),
    onToggleActive: fn(),
  },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Editar" }),
    );
    if (args.state === "success") {
      await expect(args.onEdit).toHaveBeenCalledWith(category);
    }
  },
};
