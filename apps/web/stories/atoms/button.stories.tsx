import { Button } from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const meta = { title: "Atoms/Button", component: Button, args: { children: "Guardar", onClick: fn() } } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Disabled: Story = { args: { disabled: true } };
export const Interaction: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Guardar" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
