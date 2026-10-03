import { html } from 'lit';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import type { HSearch } from './h-search.ts';
import './h-search.ts';

type Args = {
  value: string;
  label: string;
  placeholder: string;
  size: 'sm' | 'md';
  disabled: boolean;
  onInput: () => void;
  onSearch: () => void;
};

export default {
  title: 'Components/Form Controls/Search',
  component: 'h-search',
  args: {
    value: '',
    label: 'Search coins',
    placeholder: 'Search coins',
    size: 'md',
    disabled: false,
    onInput: fn(),
    onSearch: fn(),
  },
  argTypes: {
    value: { control: 'text', description: 'Current query' },
    label: { control: 'text', description: 'Accessible name of the field' },
    placeholder: { control: 'text', description: 'Hint while empty' },
    size: { control: 'inline-radio', options: ['sm', 'md'], description: 'Field height' },
    disabled: { control: 'boolean', description: 'Disables the field' },
    onInput: {
      table: { category: 'Events' },
      description: '`input` on every change, including clear; read `value`',
    },
    onSearch: { table: { category: 'Events' }, description: '`search` on Enter' },
  },
  parameters: {
    docs: {
      description: {
        component: `A field that filters a list or a table as people type. The clear button appears
with text; Escape clears too.

**Use** to narrow down what is already on the page, or to run a search on Enter.
**Don't use** for picking one value from a known list — use Select.`,
      },
    },
  },
};

const render = (a: Args) => html`
  <h-search
    value=${a.value}
    label=${a.label}
    placeholder=${a.placeholder}
    size=${a.size}
    ?disabled=${a.disabled}
    @input=${a.onInput}
    @search=${a.onSearch}
  ></h-search>
`;

export const TypeAndClearTest = {
  name: 'Test: Type and clear',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: Args }) => {
    const search = canvasElement.querySelector('h-search') as HSearch;
    await search.updateComplete;
    const input = search.shadowRoot?.querySelector('input') as HTMLInputElement;

    await userEvent.type(input, 'btc{Enter}');
    await expect(search.value).toBe('btc');
    await expect(args.onSearch).toHaveBeenCalledTimes(1);

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(search.value).toBe(''));
    await expect(input.value).toBe('');
    await expect(args.onInput).toHaveBeenCalledTimes(4);
  },
};

export const Playground = { render };

export const States = {
  render: () => html`
    <div class="demo-stack">
      <h-search label="Empty search"></h-search>
      <h-search label="Filled search" value="hype"></h-search>
      <h-search label="Small search" size="sm" value="sol"></h-search>
      <h-search label="Disabled search" disabled></h-search>
    </div>
  `,
};
