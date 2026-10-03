import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import './h-field.ts';

type Args = {
  value: string;
  name: string;
  label: string;
  description: string;
  error: string;
  placeholder: string;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  size: 'sm' | 'md' | 'lg';
  type: string;
  inputmode: string;
  onInput: () => void;
  onChange: () => void;
};

const description = `A labelled text input with help and validation text.

**Use** for one line of editable form data. **Don't use** for long prose; use HTextarea.
Anatomy: label, optional prefix and suffix, native input, description, then error.`;

export default {
  title: 'Components/Form Controls/Field',
  component: 'h-field',
  args: {
    value: '',
    name: 'account-name',
    label: 'Account name',
    description: 'Shown in reports.',
    error: '',
    placeholder: 'Enter a name',
    disabled: false,
    readonly: false,
    required: false,
    size: 'md',
    type: 'text',
    inputmode: 'text',
    onInput: fn(),
    onChange: fn(),
  },
  argTypes: {
    value: { control: 'text', description: 'Current native input value.' },
    name: { control: 'text', description: 'Form field name.' },
    label: { control: 'text', description: 'Visible field label.' },
    description: { control: 'text', description: 'Helpful text below the control.' },
    error: { control: 'text', description: 'Validation error below the control.' },
    placeholder: { control: 'text', description: 'Hint shown for an empty field.' },
    disabled: { control: 'boolean', description: 'Prevents editing and submission.' },
    readonly: { control: 'boolean', description: 'Keeps the value visible but uneditable.' },
    required: { control: 'boolean', description: 'Marks the native control as required.' },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Control spacing and type size.',
    },
    type: { control: 'text', description: 'Native input type.' },
    inputmode: { control: 'text', description: 'Preferred virtual keyboard mode.' },
    onInput: { table: { category: 'Events' }, description: 'Composed native input event.' },
    onChange: { table: { category: 'Events' }, description: 'Composed native change event.' },
  },
  parameters: { docs: { description: { component: description } } },
};

const render = (args: Args) => html`
  <h-field
    .value=${args.value}
    name=${args.name}
    label=${args.label}
    description=${args.description}
    error=${args.error}
    placeholder=${args.placeholder}
    size=${args.size}
    type=${args.type}
    inputmode=${args.inputmode}
    ?disabled=${args.disabled}
    ?readonly=${args.readonly}
    ?required=${args.required}
    @input=${args.onInput}
    @change=${args.onChange}
  >
    <span slot="prefix" aria-hidden="true">@</span>
    <span slot="suffix" aria-hidden="true">USD</span>
  </h-field>
`;

export const Playground = {
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: Args }) => {
    const field = canvasElement.querySelector('h-field') as HTMLElement & {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<void>;
    };
    await field.updateComplete;
    const input = field.shadowRoot.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, 'Main');
    await expect(input.value).toBe('Main');
    await expect(args.onInput).toHaveBeenCalled();
  },
};

export const Small = { args: { size: 'sm' }, render };

export const Medium = { args: { size: 'md' }, render };

export const Large = { args: { size: 'lg' }, render };

export const Required = { args: { required: true }, render };

export const Disabled = { args: { disabled: true }, render };

export const Readonly = { args: { readonly: true, value: 'Locked name' }, render };

export const Error = { args: { error: 'Choose a unique name.' }, render };

export const Textarea = {
  render: (args: Args) => html`
    <h-textarea
      .value=${args.value}
      name=${args.name}
      label="Notes"
      description=${args.description}
      placeholder="Write a note"
      size=${args.size}
      ?disabled=${args.disabled}
      ?readonly=${args.readonly}
      ?required=${args.required}
      @input=${args.onInput}
      @change=${args.onChange}
    ></h-textarea>
  `,
};
