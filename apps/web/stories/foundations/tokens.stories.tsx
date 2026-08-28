import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const colors = [
  ["Canvas", "--ui-color-canvas"],
  ["Surface", "--ui-color-surface"],
  ["Surface subtle", "--ui-color-surface-subtle"],
  ["Text", "--ui-color-text"],
  ["Text muted", "--ui-color-text-muted"],
  ["Border", "--ui-color-border"],
  ["Primary", "--ui-color-primary"],
  ["Danger", "--ui-color-danger"],
  ["Success", "--ui-color-success"],
] as const;

function ColorTokens() {
  return (
    <div className="grid max-w-5xl gap-[var(--ui-space-4)] sm:grid-cols-2 lg:grid-cols-3">
      {colors.map(([name, token]) => (
        <div key={token} className="overflow-hidden rounded-[var(--ui-radius-panel)] border border-[var(--ui-color-border)] bg-[var(--ui-color-surface)]">
          <div className="h-24 border-b border-[var(--ui-color-border)]" style={{ background: `var(${token})` }} />
          <div className="p-[var(--ui-space-4)]">
            <p className="font-medium">{name}</p>
            <code className="text-sm text-[var(--ui-color-text-muted)]">{token}</code>
          </div>
        </div>
      ))}
    </div>
  );
}

const meta = { title: "Foundations/Color tokens", component: ColorTokens } satisfies Meta<typeof ColorTokens>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SemanticPalette: Story = {};
