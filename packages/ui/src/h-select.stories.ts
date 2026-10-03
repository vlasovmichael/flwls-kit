import { html } from 'lit';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import './h-select.ts';
import type { HSelect } from './h-select.ts';

type Args = { label: string; value: string; onChange: (e: Event) => void };

const OPTIONS = [
  { label: 'Auto', value: 'auto' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export default {
  title: 'Components/Form Controls/Select',
  component: 'h-select',
  args: { label: 'Theme', value: 'auto', onChange: fn() },
  argTypes: {
    label: { control: 'text', description: 'Accessible label for screen readers' },
    value: { control: 'inline-radio', options: OPTIONS.map((o) => o.value), description: 'Selected value' },
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
    .options=${OPTIONS}
    .value=${a.value}
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
