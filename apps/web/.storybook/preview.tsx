import type { Preview } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import "../app/globals.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Tema visual",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "light", title: "Claro" },
          { value: "dark", title: "Oscuro" },
        ],
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => (
      <div
        data-theme={context.globals.theme}
        className="min-h-screen bg-[var(--ui-color-canvas)] p-[var(--ui-space-6)] text-[var(--ui-color-text)]"
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    a11y: { test: "error" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
  },
};

export default preview;

export type StoryContent = ReactNode;
