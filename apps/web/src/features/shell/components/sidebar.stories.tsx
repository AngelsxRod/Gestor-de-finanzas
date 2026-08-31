import { Button, Text } from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";
import { ShellProvider } from "../context/shell-context";
import { MobileMenuButton } from "./mobile-menu-button";
import { Sidebar, type SidebarProps } from "./sidebar";

function SidebarPreview({ footer }: SidebarProps) {
  return (
    <ShellProvider>
      <div className="relative flex h-screen">
        <div className="p-[var(--ui-space-4)]">
          <MobileMenuButton />
        </div>
        <Sidebar footer={footer} />
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

export const WithFooter: Story = {
  args: {
    footer: (
      <div className="grid gap-[var(--ui-space-2)]">
        <Text variant="caption" tone="muted">
          admin
        </Text>
        <Button type="button" variant="secondary">
          Cerrar sesión
        </Button>
      </div>
    ),
  },
};

export const MobileOpen: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Abrir menú de navegación" }),
    );
  },
};
