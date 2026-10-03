import { html } from 'lit';
import { expect } from 'storybook/test';
import './h-progress.ts';

type ProgressArgs = {
  value: number;
  min: number;
  max: number;
  label: string;
  indeterminate: boolean;
};

const description = `A labelled progressbar for work with a known or unknown completion amount.

**Use** for uploads, imports, synchronisation, or another task that stays visible.
**Don't use** for a short waiting state without useful task context; use HSpinner instead.
Anatomy: label, optional textual value, track, and completed bar. Value, min, and max define
the determinate range. Indeterminate removes the current value while the task continues.`;

export default {
  title: 'Components/Display/Progress',
  component: 'h-progress',
  args: {
    value: 42,
    min: 0,
    max: 100,
    label: 'Uploading report',
    indeterminate: false,
  },
  argTypes: {
    value: {
      control: { type: 'number' },
      description: 'Current determinate value, constrained to the supplied range.',
    },
    min: {
      control: { type: 'number' },
      description: 'Lowest value in the determinate range.',
    },
    max: {
      control: { type: 'number' },
      description: 'Highest value in the determinate range.',
    },
    label: {
      control: 'text',
      description: 'Visible and accessible name of the task.',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Shows ongoing work without an aria-valuenow value.',
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

const render = (args: ProgressArgs) => html`
  <h-progress
    .value=${args.value}
    .min=${args.min}
    .max=${args.max}
    label=${args.label}
    ?indeterminate=${args.indeterminate}
  ></h-progress>
`;

export const Playground = {
  render,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const progress = canvasElement.querySelector('h-progress') as HProgressElement;
    await progress.updateComplete;
    const track = progress.shadowRoot.querySelector('.track');

    await expect(track).toHaveAttribute('role', 'progressbar');
    await expect(track).toHaveAttribute('aria-valuenow', '42');
    await expect(track).toHaveAttribute('aria-valuemin', '0');
    await expect(track).toHaveAttribute('aria-valuemax', '100');
  },
};

export const Determinate = {
  args: { value: 68, label: 'Importing records' },
  render,
};

export const Complete = {
  args: { value: 100, label: 'Exporting report' },
  render,
};

export const CustomRange = {
  args: { value: 14, min: 10, max: 20, label: 'Processing pages' },
  render,
};

export const Indeterminate = {
  args: { indeterminate: true, label: 'Synchronising account' },
  render,
};

type HProgressElement = HTMLElement & {
  shadowRoot: ShadowRoot;
  updateComplete: Promise<void>;
};
