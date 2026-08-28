import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { HealthStatusPanel } from "./health-status-panel";

const meta = { title: "Organisms/Health status panel", component: HealthStatusPanel } satisfies Meta<typeof HealthStatusPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Loading: Story = { args: { state: "loading" } };
export const Success: Story = { args: { state: "success", service: "API" } };
export const Error: Story = { args: { state: "error", isRetrying: false, onRetry: fn() } };
export const Retrying: Story = { args: { state: "error", isRetrying: true, onRetry: fn() } };
export const RetryInteraction: Story = {
  args: { state: "error", isRetrying: false, onRetry: fn() },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Reintentar" }));
    if (args.state === "error") await expect(args.onRetry).toHaveBeenCalledOnce();
  },
};
