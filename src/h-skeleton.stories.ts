import { html } from 'lit';
import { expect } from 'storybook/test';
import './h-skeleton.ts';

type SkeletonArgs = {
  variant: 'text' | 'circle' | 'rect' | 'card';
  width: string;
  height: string;
};

const description = `A decorative placeholder that reserves a content shape while data is loading.

**Use** it to show the expected structure before information arrives.
**Don't use** it as an empty-state message or as progress feedback for a completed action.
Anatomy: one non-semantic shape. Variant selects a common shape, while width and height
allow a composition to match its eventual content. The pulse stops for reduced motion.`;

export default {
  title: 'Components/Display/Skeleton',
  component: 'h-skeleton',
  args: {
    variant: 'text',
    width: '',
    height: '',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['text', 'circle', 'rect', 'card'],
      description: 'Placeholder shape for text, an avatar, a block, or a card.',
    },
    width: {
      control: 'text',
      description: 'Optional CSS width for the placeholder.',
    },
    height: {
      control: 'text',
      description: 'Optional CSS height for the placeholder.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

const render = (args: SkeletonArgs) => html`
  <h-skeleton
    variant=${args.variant}
    width=${args.width}
    height=${args.height}
  ></h-skeleton>
`;

export const PlaygroundTest = {
  name: 'Test: Playground',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const skeleton = canvasElement.querySelector('h-skeleton') as HTMLElement & {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<void>;
    };
    await skeleton.updateComplete;
    const shape = skeleton.shadowRoot.querySelector('.skeleton');
    await expect(shape).toHaveAttribute('aria-hidden', 'true');
  },
};

export const Playground = {
  render: PlaygroundTest.render,
};

export const Text = {
  args: { variant: 'text', width: '60%' },
  render,
};

export const Circle = {
  args: { variant: 'circle' },
  render,
};

export const Rectangle = {
  args: { variant: 'rect' },
  render,
};

export const Card = {
  args: { variant: 'card', height: 'var(--space-10)' },
  render,
};

export const CustomDimensions = {
  args: { variant: 'rect', width: '75%', height: 'var(--space-8)' },
  render,
};
