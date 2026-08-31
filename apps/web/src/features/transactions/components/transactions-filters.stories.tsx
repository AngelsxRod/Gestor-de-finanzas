import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { emptyTransactionFilters } from "../hooks/use-transaction-filters";
import { TransactionsFilters } from "./transactions-filters";

const account = {
  id: "a7536616-4dd5-45c9-8a95-b94e21936a96",
  name: "Cuenta corriente",
  type: "checking" as const,
  currency: "GTQ",
  openingBalance: "0.0000",
  isActive: true,
  createdAt: "2026-08-29T12:00:00.000Z",
  updatedAt: "2026-08-29T12:00:00.000Z",
};

const category = {
  id: "c9f2a1a0-4e9a-4a2e-9b0a-6a5b4d3c2f10",
  name: "Salario",
  type: "income" as const,
  isActive: true,
  createdAt: "2026-08-29T12:00:00.000Z",
  updatedAt: "2026-08-29T12:00:00.000Z",
};

const meta = {
  title: "Organisms/Transactions filters",
  component: TransactionsFilters,
  args: {
    accounts: [account],
    categories: [category],
    values: emptyTransactionFilters,
    onChange: fn(),
    onClear: fn(),
  },
} satisfies Meta<typeof TransactionsFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSelectedFilters: Story = {
  args: {
    values: {
      ...emptyTransactionFilters,
      accountId: account.id,
      type: "income",
      isActive: "true",
    },
  },
};

export const ChangeAccountInteraction: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.selectOptions(canvas.getByLabelText("Cuenta"), [
      account.id,
    ]);

    await expect(args.onChange).toHaveBeenCalledWith("accountId", account.id);
  },
};

export const ClearFiltersInteraction: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Limpiar filtros" }),
    );

    await expect(args.onClear).toHaveBeenCalled();
  },
};
