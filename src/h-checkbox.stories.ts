import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import './h-checkbox.ts';

type CheckboxArgs = {
  checked: boolean;
  value: string;
  name: string;
  label: string;
  description: string;
  error: string;
  disabled: boolean;
  required: boolean;
  indeterminate: boolean;
  size: 'sm' | 'md' | 'lg';
  onChange: () => void;
};

const description = `An independent form option built on a native checkbox.

**Use** for a binary choice that does not change other choices. **Don't use** for an
immediate settings toggle; use HSwitch, or for one choice from a set; use HRadioGroup.
Anatomy: native checkbox, visible label, optional description, then optional error.
The indeterminate property represents a partial selection and is cleared by user input.`;

export default {
  title: 'Components/Form Controls/Checkbox',
  component: 'h-checkbox',
  args: {
    checked: false,
    value: 'reports',
    name: 'notifications',
    label: 'Send weekly reports',
    description: 'A summary arrives every Monday.',
    error: '',
    disabled: false,
    required: false,
    indeterminate: false,
    size: 'md',
    onChange: fn(),
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the option is selected.',
    },
    value: {
      control: 'text',
      description: 'Submitted value when the option is selected.',
    },
    name: {
      control: 'text',
      description: 'Form field name.',
    },
    label: {
      control: 'text',
      description: 'Visible label for the checkbox.',
    },
    description: {
      control: 'text',
      description: 'Helpful text below the option.',
    },
    error: {
      control: 'text',
      description: 'Validation error below the option.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents the option from changing.',
    },
    required: {
      control: 'boolean',
      description: 'Requires the option before form submission.',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Shows a partial-selection state until the user changes it.',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Control and label size.',
    },
    onChange: {
      table: { category: 'Events' },
      description: 'Composed native change event after selection changes.',
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

const render = (args: CheckboxArgs) => html`
  <h-checkbox
    ?checked=${args.checked}
    value=${args.value}
    name=${args.name}
    label=${args.label}
    description=${args.description}
    error=${args.error}
    size=${args.size}
    ?disabled=${args.disabled}
    ?required=${args.required}
    ?indeterminate=${args.indeterminate}
    @change=${args.onChange}
  ></h-checkbox>
`;

export const PlaygroundTest = {
  name: 'Test: Playground',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: CheckboxArgs }) => {
    const checkbox = canvasElement.querySelector('h-checkbox') as HTMLElement & {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<void>;
    };
    await checkbox.updateComplete;
    const input = checkbox.shadowRoot.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await expect(input.checked).toBe(true);
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

export const Playground = {
  render: PlaygroundTest.render,
};

export const Checked = {
  args: { checked: true },
  render,
};

export const Indeterminate = {
  args: { indeterminate: true },
  render,
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

export const Required = {
  args: { required: true },
  render,
};

export const Error = {
  args: { error: 'Choose whether to receive reports.' },
  render,
};

export const Disabled = {
  args: { disabled: true },
  render,
};
