import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.stories.@(ts|tsx)",
    "../src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest",
  ],
  framework: "@storybook/nextjs-vite",
  docs: { autodocs: true },
};

export default config;
