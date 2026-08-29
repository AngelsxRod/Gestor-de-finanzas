import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AccountList } from "./account-list";

const account = {
  id: "f1700f2a-f1c2-4fc2-8432-ffb13bb24e6e",
  name: "Cuenta principal",
  type: "checking" as const,
  currency: "GTQ",
  openingBalance: "1250.5000",
  isActive: true,
  createdAt: "2026-08-29T12:00:00.000Z",
  updatedAt: "2026-08-29T12:00:00.000Z",
};

const meta = {
  title: "Organisms/Account list",
  component: AccountList,
} satisfies Meta<typeof AccountList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { state: "loading" } };
export const Empty: Story = { args: { state: "success", accounts: [] } };
export const WithAccounts: Story = {
  args: { state: "success", accounts: [account] },
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
