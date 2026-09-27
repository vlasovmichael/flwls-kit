import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../packages/ui/src/**/*.stories.ts'],
  addons: ['@storybook/addon-a11y'],
  framework: { name: '@storybook/web-components-vite', options: {} },
};

export default config;
