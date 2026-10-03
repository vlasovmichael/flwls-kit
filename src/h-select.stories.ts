import { html } from 'lit';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import './h-select.ts';
import type { HSelect } from './h-select.ts';

type Args = {
  options: typeof OPTIONS;
  label: string;
  value: string;
  name: string;
  placeholder: string;
  disabled: boolean;
  onChange: (e: Event) => void;
};

const OPTIONS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export default {
  title: 'Components/Form Controls/Select',
  component: 'h-select',
  args: {
    options: OPTIONS,
    label: 'Theme',
    value: 'auto',
    name: 'theme',
    placeholder: 'Choose a theme',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    options: {
      control: 'object',
      description: 'Options as objects with label and value.',
    },
    label: { control: 'text', description: 'Accessible label for screen readers' },
    value: { control: 'inline-radio', options: OPTIONS.map((o) => o.value), description: 'Selected value' },
    name: { control: 'text', description: 'Name submitted with the enclosing form.' },
    placeholder: { control: 'text', description: 'Text shown before a selection.' },
    disabled: { control: 'boolean', description: 'Prevents opening and selecting.' },
    onChange: { table: { category: 'Events' }, description: '`change` — `detail` is the new value' },
  },
  parameters: {
    docs: {
      description: {
        component: `A dropdown with keyboard support: arrows, Enter, Escape. \`options\` is a property
(\`{ label, value }[]\`), not an attribute.

**Use** when there are more than five options or space is tight.
**Don't use** for 2–5 options worth seeing at once — use a segmented control.`,
      },
      story: { inline: false, height: '240px' },
    },
  },
};

export const Playground = {
  render: (a: Args) => html`<h-select
    label=${a.label}
    .options=${a.options}
    .value=${a.value}
    name=${a.name}
    placeholder=${a.placeholder}
    ?disabled=${a.disabled}
    @change=${a.onChange}
  ></h-select>`,
};

export const KeyboardSelect = {
  name: 'Keyboard',
  render: Playground.render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: Args }) => {
    const select = canvasElement.querySelector('h-select') as HSelect;
    await select.updateComplete;
    const trigger = select.querySelector('button') as HTMLButtonElement;
    trigger.focus();
    await userEvent.keyboard('{Enter}{ArrowDown}{Enter}');
    await waitFor(() => expect(args.onChange).toHaveBeenCalled());
    await expect(select.value).toBe('light');
  },
};

export const Placeholder = {
  args: { value: '' },
  render: Playground.render,
};

export const Disabled = {
  args: { disabled: true },
  render: Playground.render,
};
