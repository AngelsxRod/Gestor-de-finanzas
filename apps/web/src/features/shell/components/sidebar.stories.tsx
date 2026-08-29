import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";
import { ShellProvider } from "../context/shell-context";
import { MobileMenuButton } from "./mobile-menu-button";
import { Sidebar } from "./sidebar";

function SidebarPreview() {
  return (
    <ShellProvider>
      <div className="relative flex h-screen">
        <div className="p-[var(--ui-space-4)]">
          <MobileMenuButton />
        </div>
        <Sidebar />
      </div>
    </ShellProvider>
  );
}

const meta = {
  title: "Organisms/Sidebar",
  component: SidebarPreview,
} satisfies Meta<typeof SidebarPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {};

export const MobileOpen: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Abrir menú de navegación" }),
    );
  },
};
