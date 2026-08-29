import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CategoryList } from "./category-list";

const categories = [
  {
    id: "14b203a4-b6c4-4d2c-94e4-98d20e87d436",
    name: "Alimentación",
    type: "expense" as const,
    createdAt: "2026-08-29T12:00:00.000Z",
    updatedAt: "2026-08-29T12:00:00.000Z",
  },
  {
    id: "a7536616-4dd5-45c9-8a95-b94e21936a96",
    name: "Salario",
    type: "income" as const,
    createdAt: "2026-08-29T12:00:00.000Z",
    updatedAt: "2026-08-29T12:00:00.000Z",
  },
];

const meta = {
  title: "Organisms/Category list",
  component: CategoryList,
} satisfies Meta<typeof CategoryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { state: "loading" } };
export const Empty: Story = { args: { state: "success", categories: [] } };
export const Success: Story = {
  args: { state: "success", categories },
};
export const Error: Story = {
  args: { state: "error", isRetrying: false, onRetry: fn() },
};
export const Retrying: Story = {
  args: { state: "error", isRetrying: true, onRetry: fn() },
};
export const RetryInteraction: Story = {
  args: { state: "error", isRetrying: false, onRetry: fn() },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Reintentar" }),
    );
    if (args.state === "error") {
      await expect(args.onRetry).toHaveBeenCalledOnce();
    }
  },
};
