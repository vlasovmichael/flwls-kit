import { html } from 'lit';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import './h-dialog.ts';
import type { HDialog } from './h-dialog.ts';

type Args = {
  title: string;
  text: string;
  danger: boolean;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default {
  title: 'Components/Overlays/Dialog',
  component: 'h-dialog',
  args: {
    title: 'Save changes?',
    text: 'Settings apply immediately.',
    danger: false,
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    onConfirm: fn(),
    onCancel: fn(),
  },
  argTypes: {
    title: { control: 'text', description: 'The question the buttons answer' },
    text: { control: 'text', description: 'Body text (default slot)' },
    danger: { control: 'boolean', description: 'Destructive action: red confirm button with a warning icon' },
    confirmLabel: { control: 'text', description: 'Confirm button label (`confirm-label`)' },
    cancelLabel: { control: 'text', description: 'Cancel button label (`cancel-label`)' },
    onConfirm: { table: { category: 'Events' }, description: '`confirm` — the confirm button was pressed' },
    onCancel: { table: { category: 'Events' }, description: '`cancel` — Cancel, Escape or a click outside' },
  },
  parameters: {
    docs: {
      description: {
        component: `A modal confirmation: title, text, cancel and confirm. Escape and a click outside cancel.
Focus moves into the dialog and returns to the opener when it closes.

**Use** for an action that cannot be undone: delete, close a position.
**Don't use** for "saved" messages — use a Toast.

Set \`open\` to show it. \`confirm\` and \`cancel\` fire after the exit animation, and \`open\` becomes false.`,
      },
      story: { inline: false, height: '360px' },
    },
  },
};

/** Кнопка открывает диалог: так выглядит настоящее использование. */
const opener = (a: Args) => html`
  <button
    class="demo-button"
    @click=${(e: Event) => {
      const dialog = (e.currentTarget as HTMLElement).nextElementSibling as HDialog;
      dialog.open = true;
    }}
  >
    Open dialog
  </button>
  <h-dialog
    title=${a.title}
    ?danger=${a.danger}
    confirm-label=${a.confirmLabel}
    cancel-label=${a.cancelLabel}
    @confirm=${a.onConfirm}
    @cancel=${a.onCancel}
    >${a.text}</h-dialog
  >
`;

export const PlaygroundTest = {
  name: 'Test: Playground',
  tags: ['!dev', '!autodocs'],
  render: opener,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: Args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }));
    const dialog = canvasElement.querySelector('h-dialog') as HDialog;
    await waitFor(() => expect(dialog.open).toBe(true));
    const cancel = dialog.shadowRoot?.querySelector('.cancel') as HTMLButtonElement;
    await userEvent.click(cancel);
    await waitFor(() => expect(args.onCancel).toHaveBeenCalled());
    await expect(dialog.open).toBe(false);
  },
};

export const Playground = {
  render: PlaygroundTest.render,
};

export const EscapeCancelsTest = {
  name: 'Test: Escape Cancels',
  tags: ['!dev', '!autodocs'],
  render: opener,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: Args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open dialog' }));
    const dialog = canvasElement.querySelector('h-dialog') as HDialog;
    await waitFor(() => expect(dialog.open).toBe(true));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(args.onCancel).toHaveBeenCalled());
  },
};

export const FocusTrapTest = {
  name: 'Test: Focus Trap',
  tags: ['!dev', '!autodocs'],
  render: opener,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open dialog' }));
    const dialog = canvasElement.querySelector('h-dialog') as HDialog;
    await waitFor(() => expect(dialog.open).toBe(true));
    const root = dialog.shadowRoot as ShadowRoot;
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('section button')];
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    last.focus();
    await userEvent.keyboard('{Tab}');
    await expect(root.activeElement).toBe(first);
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await expect(root.activeElement).toBe(last);
    // Проверку контраста запускаем на проявившемся окне, а не посреди анимации входа.
    await Promise.all(root.getAnimations().map((a) => a.finished));
  },
};

export const ReopenTest = {
  name: 'Test: Reopen',
  tags: ['!dev', '!autodocs'],
  render: opener,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const openButton = within(canvasElement).getByRole('button', { name: 'Open dialog' });
    const dialog = canvasElement.querySelector('h-dialog') as HDialog;
    const root = dialog.shadowRoot as ShadowRoot;
    const settle = () => Promise.all(root.getAnimations().map((a) => a.finished));

    for (let round = 0; round < 2; round += 1) {
      await userEvent.click(openButton);
      await waitFor(() => expect(dialog.open).toBe(true));
      await settle();
      const backdrop = root.querySelector('.backdrop') as HTMLElement;
      await expect(getComputedStyle(backdrop).opacity).toBe('1');
      await userEvent.click(root.querySelector('.cancel') as HTMLButtonElement);
      await waitFor(() => expect(dialog.open).toBe(false));
    }
  },
};

export const Destructive = {
  args: { title: 'Delete entry?', text: 'This cannot be undone.', danger: true, confirmLabel: 'Delete' },
  render: opener,
};

export const Open = {
  name: 'Open (static)',
  args: { title: 'Save changes?' },
  render: (a: Args) => html`<h-dialog open title=${a.title} confirm-label=${a.confirmLabel} cancel-label=${a.cancelLabel}
    >${a.text}</h-dialog
  >`,
};
