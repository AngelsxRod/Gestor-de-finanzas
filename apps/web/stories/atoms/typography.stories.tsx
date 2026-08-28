import { Eyebrow, Heading, Text } from "@gestor-finanzas/ui";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  title: "Atoms/Typography",
  component: Heading,
  args: { children: "Resumen financiero", level: 2, variant: "title" },
  argTypes: {
    level: { control: "select", options: [1, 2, 3, 4, 5, 6] },
    variant: { control: "select", options: ["display", "title", "section", "subsection"] },
  },
} satisfies Meta<typeof Heading>;
export default meta;
type Story = StoryObj<typeof meta>;

export const HeadingPlayground: Story = {};
export const SemanticLevelAndAppearance: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-[var(--ui-space-6)]">
      <Eyebrow>Jerarquía independiente</Eyebrow>
      <Heading level={2} variant="display">Un h2 puede tener apariencia display</Heading>
      <Heading level={3} variant="subsection">Un h3 puede ser visualmente discreto</Heading>
      <Text variant="lead">La semántica del documento se decide con level; la escala visual, con variant.</Text>
      <Text tone="muted">El texto secundario conserva contraste y ritmo sin competir con el título.</Text>
    </div>
  ),
};
