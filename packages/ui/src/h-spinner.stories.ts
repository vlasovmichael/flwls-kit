import { html } from 'lit';
import { expect } from 'storybook/test';
import './h-spinner.ts';

type SpinnerArgs = {
  size: 'sm' | 'md' | 'lg';
  label: string;
};

const description = `An indeterminate loading indicator with a visible status label.

**Use** while an operation is active and its completion percentage is not known.
**Don't use** when a known amount of work can be shown; use HProgress instead.
Anatomy: a decorative rotating indicator and an accessible status label. Size changes both
the indicator and its label.`;

export default {
  title: 'Components/Display/Spinner',
  component: 'h-spinner',
  args: {
    size: 'md',
    label: 'Loading',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Indicator and label size.',
    },
    label: {
      control: 'text',
      description: 'Visible and accessible description of the active operation.',
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

const render = (args: SpinnerArgs) => html`
  <h-spinner size=${args.size} label=${args.label}></h-spinner>
`;

export const Playground = {
  render,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const spinner = canvasElement.querySelector('h-spinner') as HSpinnerElement;
    await spinner.updateComplete;
    const status = spinner.shadowRoot.querySelector('.status');

    await expect(status).toHaveAttribute('role', 'status');
    await expect(status).toHaveAttribute('aria-label', 'Loading');
  },
};

export const Small = {
  args: { size: 'sm' },
  render,
};

export const Medium = {
  args: { size: 'md' },
  render,
};

export const Large = {
  args: { size: 'lg' },
  render,
};

export const Saving = {
  args: { label: 'Saving changes' },
  render,
};

type HSpinnerElement = HTMLElement & {
  shadowRoot: ShadowRoot;
  updateComplete: Promise<void>;
};
