import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import './h-checkbox.ts';

type SwitchArgs = {
  checked: boolean;
  value: string;
  name: string;
  label: string;
  description: string;
  error: string;
  disabled: boolean;
  required: boolean;
  size: 'sm' | 'md' | 'lg';
  onChange: () => void;
};

const description = `A binary setting with native checkbox behavior and switch semantics.

**Use** when changing the control takes effect immediately. **Don't use** when a form
needs an explicit submit action; use HCheckbox. Anatomy: switch track, label, optional
description, then optional error. It is form-associated and reports role=switch.`;

export default {
  title: 'Components/Form Controls/Switch',
  component: 'h-switch',
  args: {
    checked: false,
    value: 'enabled',
    name: 'alerts',
    label: 'Price alerts',
    description: 'Notify when an asset reaches its target price.',
    error: '',
    disabled: false,
    required: false,
    size: 'md',
    onChange: fn(),
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the switch is on.',
    },
    value: {
      control: 'text',
      description: 'Submitted value when the switch is on.',
    },
    name: {
      control: 'text',
      description: 'Form field name.',
    },
    label: {
      control: 'text',
      description: 'Visible label for the switch.',
    },
    description: {
      control: 'text',
      description: 'Helpful text below the switch.',
    },
    error: {
      control: 'text',
      description: 'Validation error below the switch.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents the switch from changing.',
    },
    required: {
      control: 'boolean',
      description: 'Requires the switch before form submission.',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Track and label size.',
    },
    onChange: {
      table: { category: 'Events' },
      description: 'Composed native change event after the switch changes.',
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

const render = (args: SwitchArgs) => html`
  <h-switch
    ?checked=${args.checked}
    value=${args.value}
    name=${args.name}
    label=${args.label}
    description=${args.description}
    error=${args.error}
    size=${args.size}
    ?disabled=${args.disabled}
    ?required=${args.required}
    @change=${args.onChange}
  ></h-switch>
`;

export const PlaygroundTest = {
  name: 'Test: Playground',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: SwitchArgs }) => {
    const control = canvasElement.querySelector('h-switch') as HTMLElement & {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<void>;
    };
    await control.updateComplete;
    const input = control.shadowRoot.querySelector('input') as HTMLInputElement;
    input.focus();
    await userEvent.keyboard(' ');
    await expect(input.checked).toBe(true);
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

export const Playground = {
  render: PlaygroundTest.render,
};

export const On = {
  args: { checked: true },
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
  args: { error: 'Enable alerts to continue.' },
  render,
};

export const Disabled = {
  args: { disabled: true },
  render,
};
