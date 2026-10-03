import { html } from 'lit';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import type { DropdownMenuItem, HDropdownMenu } from './h-dropdown-menu.ts';
import './h-dropdown-menu.ts';

type MenuArgs = {
  label: string;
  icon: string;
  iconOnly: boolean;
  size: 'sm' | 'md';
  align: 'start' | 'end';
  disabled: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onClose: () => void;
};

const ITEMS: DropdownMenuItem[] = [
  { label: 'Edit', value: 'edit', icon: 'pencil' },
  { label: 'Duplicate', value: 'duplicate', icon: 'copy' },
  { label: 'Export CSV', value: 'export', icon: 'download' },
  { label: 'Archive', value: 'archive', icon: 'folder', disabled: true },
  { label: 'Delete', value: 'delete', icon: 'trash-2', danger: true, divider: true },
];

const PLAIN: DropdownMenuItem[] = [
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
];

const description = `A button that opens a short list of actions.

**Use** for secondary actions on a row, card or page header, when showing every action
as a button would crowd the layout.
**Don't use** to pick a value that stays visible after the choice — use Select or
Segmented Control. Don't hide the one primary action of a screen inside a menu.
Anatomy: trigger button (label with chevron, or a single icon), popup with menu items.
An item can carry an icon, be disabled, be marked as danger, or start a new group with a divider.

Keyboard: Enter, Space or ↓ open the menu on the first item, ↑ on the last; arrows, Home
and End move; typing a letter jumps to an item; Escape closes and returns focus to the button.
Near the edge of the window the menu opens upward or towards the other side.`;

export default {
  title: 'Components/Navigation/Dropdown Menu',
  component: 'h-dropdown-menu',
  args: {
    label: 'Actions',
    icon: '',
    iconOnly: false,
    size: 'md',
    align: 'start',
    disabled: false,
    onSelect: fn(),
    onOpen: fn(),
    onClose: fn(),
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Button text; with icon-only it becomes the accessible name.',
    },
    icon: {
      control: 'text',
      description: 'Optional leading icon name for the button.',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Shows only an icon (ellipsis by default) — for table rows and cards.',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md'],
      description: 'Button size, matching Button.',
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'end'],
      description: 'Which edge of the button the menu lines up with. Flips near the window edge.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button.',
    },
    onSelect: {
      table: { category: 'Events' },
      description: '`select` with `detail.value` and `detail.item`.',
    },
    onOpen: {
      table: { category: 'Events' },
      description: '`open` after the menu opens.',
    },
    onClose: {
      table: { category: 'Events' },
      description: '`close` with `detail.reason`: select, escape, outside, tab or toggle.',
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

const render = (args: MenuArgs) => html`
  <div class="demo-drop">
    <h-dropdown-menu
      .items=${ITEMS}
      label=${args.label}
      icon=${args.icon}
      ?icon-only=${args.iconOnly}
      size=${args.size}
      align=${args.align}
      ?disabled=${args.disabled}
      @select=${args.onSelect}
      @open=${args.onOpen}
      @close=${args.onClose}
    ></h-dropdown-menu>
  </div>
`;

type Ctx = { canvasElement: HTMLElement; args: MenuArgs };

const parts = async (canvasElement: HTMLElement) => {
  const menu = canvasElement.querySelector('h-dropdown-menu') as HDropdownMenu;
  await menu.updateComplete;
  const root = menu.shadowRoot as ShadowRoot;
  return {
    menu,
    root,
    trigger: root.querySelector('.trigger') as HTMLButtonElement,
    list: root.querySelector('.menu') as HTMLUListElement,
    items: [...root.querySelectorAll<HTMLButtonElement>('.item')],
  };
};

export const PlaygroundTest = {
  name: 'Test: Keyboard',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: Ctx) => {
    const { root, trigger, list, items } = await parts(canvasElement);

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(root.activeElement).toBe(items[0]));
    await expect(args.onOpen).toHaveBeenCalledTimes(1);

    await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
    await expect(root.activeElement).toBe(items[4]);

    await userEvent.keyboard('{Escape}');
    await expect(root.activeElement).toBe(trigger);
    await waitFor(() => expect(list.hidden).toBe(true));
    await expect(args.onSelect).not.toHaveBeenCalled();
  },
};

export const ReopenTest = {
  name: 'Test: Reopen by mouse',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: Ctx) => {
    const { trigger, list, items } = await parts(canvasElement);

    for (let round = 0; round < 3; round += 1) {
      await userEvent.click(trigger);
      await waitFor(() => expect(list.hidden).toBe(false));
      await userEvent.click(items[1]);
      await waitFor(() => expect(list.hidden).toBe(true));
    }

    await expect(args.onSelect).toHaveBeenCalledTimes(3);
  },
};

export const Playground = {
  render,
};

export const Open = {
  render: () => html`
    <div class="demo-drop">
      <h-dropdown-menu open .items=${ITEMS} label="Actions"></h-dropdown-menu>
    </div>
  `,
};

export const RowActions = {
  name: 'Row actions',
  render: () => html`
    <div class="demo-drop">
      <div class="demo-list-row">
        <span>BTC long · 0.25 · +2.4%</span>
        <h-dropdown-menu icon-only align="end" open .items=${ITEMS} label="Position actions">
        </h-dropdown-menu>
      </div>
    </div>
  `,
};

export const Sizes = {
  render: () => html`
    <div class="demo-drop">
      <h-dropdown-menu size="sm" .items=${PLAIN} label="Period"></h-dropdown-menu>
      <h-dropdown-menu .items=${PLAIN} label="Period"></h-dropdown-menu>
      <h-dropdown-menu icon="download" .items=${PLAIN} label="Export"></h-dropdown-menu>
      <h-dropdown-menu icon-only size="sm" .items=${PLAIN} label="More"></h-dropdown-menu>
      <h-dropdown-menu icon-only .items=${PLAIN} label="More"></h-dropdown-menu>
    </div>
  `,
};

export const Disabled = {
  render: () => html`
    <div class="demo-drop">
      <h-dropdown-menu disabled .items=${PLAIN} label="Actions"></h-dropdown-menu>
      <h-dropdown-menu disabled icon-only .items=${PLAIN} label="More"></h-dropdown-menu>
    </div>
  `,
};
