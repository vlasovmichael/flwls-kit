import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import './h-segmented-control.ts';

type Args = {
  value: string;
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  label: string;
  disabled: boolean;
  size: 'sm' | 'md' | 'lg';
  stretch: boolean;
  onChange: () => void;
};

const options = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];

const description = `A compact single-choice control using the radio group pattern.

**Use** for two to five mutually exclusive, immediately visible choices.
**Don't use** for long option lists or multiple selections; use a select or checkboxes.
Anatomy: a labelled radiogroup containing one radio button per option.`;

export default {
  title: 'Components/Form Controls/Segmented Control',
  component: 'h-segmented-control',
  args: {
    value: 'week',
    options,
    label: 'Period',
    disabled: false,
    size: 'md',
    stretch: false,
    onChange: fn(),
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Value of the selected option.',
    },
    options: {
      control: 'object',
      description: 'Radio options with label, value, and optional disabled state.',
    },
    label: {
      control: 'text',
      description: 'Accessible name announced for the radio group.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents choosing any option.',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Segment height, padding, and text size.',
    },
    stretch: {
      control: 'boolean',
      description: 'Makes all segments share the available width.',
    },
    onChange: {
      table: { category: 'Events' },
      description: 'Composed change event with value and selected option in detail.',
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

const render = (args: Args) => html`
  <h-segmented-control
    .value=${args.value}
    .options=${args.options}
    label=${args.label}
    size=${args.size}
    ?disabled=${args.disabled}
    ?stretch=${args.stretch}
    @change=${args.onChange}
  ></h-segmented-control>
`;

export const Playground = {
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: Args }) => {
    const control = canvasElement.querySelector('h-segmented-control') as HTMLElement & {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<void>;
    };
    await control.updateComplete;
    const radios = control.shadowRoot.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    radios[1].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(radios[2]).toHaveAttribute('aria-checked', 'true');
    await expect(args.onChange).toHaveBeenCalledTimes(1);
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

export const Stretch = {
  args: { stretch: true },
  render,
};

export const Disabled = {
  args: { disabled: true },
  render,
};

export const DisabledOption = {
  args: {
    options: [options[0], { label: 'Week', value: 'week', disabled: true }, options[2]],
  },
  render,
};
