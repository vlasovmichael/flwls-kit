import { html } from 'lit';
import { expect } from 'storybook/test';
import './h-badge.ts';

type BadgeArgs = {
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'error';
  size: 'sm' | 'md' | 'lg';
};

const badgeDescription = `A compact, non-interactive status label.

**Use** it for a short state, category, or count.
**Don't use** it as an action or a removable filter.
Anatomy: one default text slot; tone conveys status and size changes density.`;

export default {
  title: 'Components/Display/Badge',
  component: 'h-badge',
  args: {
    tone: 'neutral',
    size: 'md',
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'error'],
      description: 'Semantic status tone.',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Badge height, padding, and text size.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: badgeDescription,
      },
    },
  },
};

const renderBadge = (args: BadgeArgs) => html`
  <h-badge tone=${args.tone} size=${args.size}>Active</h-badge>
`;

export const PlaygroundTest = {
  name: 'Test: Playground',
  tags: ['!dev', '!autodocs'],
  render: renderBadge,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const badge = canvasElement.querySelector('h-badge');
    await expect(badge).toHaveTextContent('Active');
  },
};

export const Playground = {
  render: PlaygroundTest.render,
};

export const Neutral = {
  args: { tone: 'neutral' },
  render: renderBadge,
};

export const Info = {
  args: { tone: 'info' },
  render: renderBadge,
};

export const Success = {
  args: { tone: 'success' },
  render: renderBadge,
};

export const Warning = {
  args: { tone: 'warning' },
  render: renderBadge,
};

export const Error = {
  args: { tone: 'error' },
  render: renderBadge,
};

export const Small = {
  args: { size: 'sm' },
  render: renderBadge,
};

export const Medium = {
  args: { size: 'md' },
  render: renderBadge,
};

export const Large = {
  args: { size: 'lg' },
  render: renderBadge,
};
