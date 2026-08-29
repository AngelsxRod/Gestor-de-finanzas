import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SectionHeader } from "../components/section-header";
import { ShellProvider } from "../context/shell-context";
import { SectionTemplate } from "./section-template";

function SectionTemplatePreview() {
  return (
    <ShellProvider>
      <SectionTemplate
        header={
          <SectionHeader
            title="Cuentas"
            description="Administra dónde guardas tu dinero."
            breadcrumbItems={[
              { label: "Resumen", href: "/" },
              { label: "Cuentas" },
            ]}
          />
        }
        content={
          <div className="grid gap-[var(--ui-space-6)]">
            <p>Contenido de ejemplo.</p>
          </div>
        }
      />
    </ShellProvider>
  );
}

const meta = {
  title: "Templates/Section",
  component: SectionTemplatePreview,
} satisfies Meta<typeof SectionTemplatePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
