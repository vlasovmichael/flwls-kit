import { html } from 'lit';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import type { HDrawer } from './h-drawer.ts';
import './h-button.ts';
import './h-checkbox.ts';
import './h-drawer.ts';
import './h-segmented-control.ts';

type Args = {
  heading: string;
  placement: 'start' | 'end' | 'bottom';
  size: 'sm' | 'md' | 'lg';
  onOpen: () => void;
  onClose: () => void;
};

export default {
  title: 'Components/Overlays/Drawer',
  component: 'h-drawer',
  args: {
    heading: 'Filters',
    placement: 'end',
    size: 'md',
    onOpen: fn(),
    onClose: fn(),
  },
  argTypes: {
    heading: { control: 'text', description: 'Panel heading; the `heading` slot replaces it' },
    placement: {
      control: 'inline-radio',
      options: ['end', 'start', 'bottom'],
      description: 'Edge the panel slides from. `start` and `end` follow the writing direction',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Panel width: 20, 24 or 36 rem. Ignored for `bottom`',
    },
    onOpen: { table: { category: 'Events' }, description: '`open` — the panel was shown' },
    onClose: {
      table: { category: 'Events' },
      description:
        '`close` after the exit animation, `detail.reason`: button, escape, backdrop or api',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A panel that slides over the page from an edge: filters, row details,
a short form.
The page behind is dimmed and inert; focus stays inside and returns to the opener on close.
Escape, the close button and a click on the dimmed page close it.

**Use** for a task that needs the page context: tweak filters and watch the table,
read a row's details.
**Don't use** for a yes/no question — use a Dialog. Don't put a multi-step flow into a drawer.

Anatomy: header with heading and close button, scrolling body (default slot), optional
\`footer\` slot for actions. Set \`open\` to show it, or call \`hide()\` to close with animation.`,
      },
      story: { inline: false, height: '420px' },
    },
  },
};

/** Кнопка открывает панель: так выглядит настоящее использование. */
const opener = (label: string) => html`
  <button
    class="demo-button"
    @click=${(event: Event) => {
      const drawer = (event.currentTarget as HTMLElement).nextElementSibling as HDrawer;
      drawer.open = true;
    }}
  >
    ${label}
  </button>
`;

const filters = html`
  <h-segmented-control
    label="Side"
    value="all"
    .options=${[
      { label: 'All', value: 'all' },
      { label: 'Long', value: 'long' },
      { label: 'Short', value: 'short' },
    ]}
  ></h-segmented-control>
  <div class="demo-stack">
    <h-checkbox checked label="Open positions"></h-checkbox>
    <h-checkbox checked label="Closed today"></h-checkbox>
    <h-checkbox
      label="Paper trades"
      description="Simulated orders, not sent to the exchange"
    ></h-checkbox>
  </div>
`;

const footer = html`
  <h-button slot="footer" variant="ghost">Reset</h-button>
  <h-button slot="footer" variant="primary">Apply</h-button>
`;

const render = (a: Args) => html`
  ${opener('Open filters')}
  <h-drawer
    heading=${a.heading}
    placement=${a.placement}
    size=${a.size}
    @open=${a.onOpen}
    @close=${a.onClose}
  >
    ${filters} ${footer}
  </h-drawer>
`;

type Ctx = { canvasElement: HTMLElement; args: Args };

const parts = (canvasElement: HTMLElement) => {
  const drawer = canvasElement.querySelector('h-drawer') as HDrawer;
  const root = drawer.shadowRoot as ShadowRoot;
  return {
    drawer,
    root,
    opener: within(canvasElement).getByRole('button', { name: 'Open filters' }),
    dialog: root.querySelector('dialog') as HTMLDialogElement,
  };
};

const settle = (dialog: HTMLDialogElement) =>
  Promise.all(
    dialog.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => undefined)),
  );

export const PlaygroundTest = {
  name: 'Test: Close button',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: Ctx) => {
    const { root, opener: button, dialog } = parts(canvasElement);

    await userEvent.click(button);
    await waitFor(() => expect(dialog.open).toBe(true));
    await settle(dialog);
    await expect(root.activeElement).toBe(root.querySelector('.close'));

    await userEvent.click(root.querySelector('.close') as HTMLButtonElement);
    await waitFor(() => expect(dialog.open).toBe(false));
    await expect(args.onClose).toHaveBeenCalledWith(
      expect.objectContaining({ detail: { reason: 'button' } }),
    );
    await waitFor(() => expect(document.activeElement).toBe(button));
  },
};

export const EscapeTest = {
  name: 'Test: Escape and backdrop',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement }: Ctx) => {
    const { drawer, opener: button, dialog } = parts(canvasElement);
    const reasons: string[] = [];
    drawer.addEventListener('close', (event) => {
      reasons.push((event as CustomEvent<{ reason: string }>).detail.reason);
    });

    await userEvent.click(button);
    await waitFor(() => expect(dialog.open).toBe(true));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog.open).toBe(false));

    await userEvent.click(button);
    await waitFor(() => expect(dialog.open).toBe(true));
    await settle(dialog);
    // Левый верхний угол окна — мимо панели, которая стоит справа.
    const outside = { bubbles: true, clientX: 4, clientY: 4 };
    dialog.dispatchEvent(new PointerEvent('pointerdown', outside));
    await waitFor(() => expect(drawer.open).toBe(false));
    await waitFor(() => expect(dialog.open).toBe(false));

    await expect(reasons).toEqual(['escape', 'backdrop']);
  },
};

export const ReopenTest = {
  name: 'Test: Reopen',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement }: Ctx) => {
    const { drawer, opener: button, dialog } = parts(canvasElement);

    for (let round = 0; round < 3; round += 1) {
      await userEvent.click(button);
      await waitFor(() => expect(dialog.open).toBe(true));
      await settle(dialog);
      await expect(dialog.getBoundingClientRect().right).toBe(window.innerWidth);
      drawer.hide();
      await waitFor(() => expect(dialog.open).toBe(false));
    }
  },
};

export const Playground = {
  render,
};

export const Start = {
  args: { heading: 'Navigation', placement: 'start', size: 'sm' },
  render,
};

export const BottomSheet = {
  name: 'Bottom sheet',
  args: { heading: 'Filters', placement: 'bottom' },
  render,
};

export const LongContent = {
  name: 'Long content',
  args: { heading: 'Trade details' },
  render: (a: Args) => html`
    ${opener('Open filters')}
    <h-drawer heading=${a.heading} placement=${a.placement} size=${a.size}>
      ${Array.from(
        { length: 24 },
        (_, i) => html`<p>Fill ${String(i + 1)} · 0.01 BTC at 62,4${String(10 + i)}.00</p>`,
      )}
      <h-button slot="footer">Close</h-button>
    </h-drawer>
  `,
};
