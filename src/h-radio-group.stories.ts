import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import './h-radio-group.ts';

type RadioGroupArgs = {
  value: string;
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  name: string;
  label: string;
  description: string;
  error: string;
  disabled: boolean;
  required: boolean;
  size: 'sm' | 'md' | 'lg';
  onChange: () => void;
};

const options = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

const description = `A labelled group for one mutually exclusive selection.

**Use** for a short list where every option should be visible. **Don't use** for
independent choices or a long option list; use checkboxes or HSelect. Anatomy: group
label, ARIA radios, optional description, then optional error. Arrow keys change and
focus the selected radio; the group is form-associated.`;

export default {
  title: 'Components/Form Controls/Radio Group',
  component: 'h-radio-group',
  args: {
    value: 'weekly',
    options,
    name: 'frequency',
    label: 'Report frequency',
    description: 'Choose when to receive the account summary.',
    error: '',
    disabled: false,
    required: false,
    size: 'md',
    onChange: fn(),
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Value of the selected radio option.',
    },
    options: {
      control: 'object',
      description: 'Radio options with label, value, and optional disabled state.',
    },
    name: {
      control: 'text',
      description: 'Form field name.',
    },
    label: {
      control: 'text',
      description: 'Visible and accessible group label.',
    },
    description: {
      control: 'text',
      description: 'Helpful text below the options.',
    },
    error: {
      control: 'text',
      description: 'Validation error below the options.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents choosing every option.',
    },
    required: {
      control: 'boolean',
      description: 'Requires one option before form submission.',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Radio indicator and label size.',
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

const render = (args: RadioGroupArgs) => html`
  <h-radio-group
    .value=${args.value}
    .options=${args.options}
    name=${args.name}
    label=${args.label}
    description=${args.description}
    error=${args.error}
    size=${args.size}
    ?disabled=${args.disabled}
    ?required=${args.required}
    @change=${args.onChange}
  ></h-radio-group>
`;

export const Playground = {
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: RadioGroupArgs }) => {
    const group = canvasElement.querySelector('h-radio-group') as HTMLElement & {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<void>;
    };
    await group.updateComplete;
    const radios = group.shadowRoot.querySelectorAll<HTMLButtonElement>('[role="radio"]');
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

export const Required = {
  args: { required: true, value: '' },
  render,
};

export const Error = {
  args: { error: 'Choose a report frequency.' },
  render,
};

export const Disabled = {
  args: { disabled: true },
  render,
};

export const DisabledOption = {
  args: {
    options: [options[0], { label: 'Weekly', value: 'weekly', disabled: true }, options[2]],
  },
  render,
};
