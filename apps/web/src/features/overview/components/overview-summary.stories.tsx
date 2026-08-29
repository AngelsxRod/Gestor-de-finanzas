import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { OverviewSummary } from "./overview-summary";

const meta = {
  title: "Organisms/OverviewSummary",
  component: OverviewSummary,
} satisfies Meta<typeof OverviewSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    accounts: { state: "loading" },
    categories: { state: "loading" },
  },
};

export const Error: Story = {
  args: {
    accounts: { state: "error", isRetrying: false, onRetry: fn() },
    categories: { state: "error", isRetrying: false, onRetry: fn() },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const retryButtons = canvas.getAllByRole("button", { name: "Reintentar" });
    await userEvent.click(retryButtons[0]);
    if (args.accounts.state === "error") {
      await expect(args.accounts.onRetry).toHaveBeenCalledOnce();
    }
  },
};

export const Success: Story = {
  args: {
    accounts: { state: "success", count: 3 },
    categories: { state: "success", count: 5 },
  },
};
