import { html } from 'lit';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import './h-toast.ts';
import type { HToast } from './h-toast.ts';

type Args = { message: string; tone: 'ok' | 'bad'; onDismiss: () => void };

export default {
  title: 'Components/Overlays/Toast',
  component: 'h-toast',
  args: { message: 'Entry saved', tone: 'ok', onDismiss: fn() },
  argTypes: {
    message: { control: 'text', description: 'Text, used when the slot is empty' },
    tone: { control: 'inline-radio', options: ['ok', 'bad'], description: '`ok` — check mark, `bad` — warning' },
    onDismiss: { table: { category: 'Events' }, description: '`dismiss` — the toast was closed' },
  },
  parameters: {
    docs: {
      description: {
        component: `A short message about the result of an action. Disappears on its own.

**Use** for "saved", "could not send".
**Don't use** for a form error the user must fix — show it next to the field.`,
      },
    },
  },
};

export const Playground = {
  render: (a: Args) => html`
    <button
      class="demo-button"
      @click=${(e: Event) => {
        const toast = (e.currentTarget as HTMLElement).nextElementSibling as HToast;
        toast.open = true;
      }}
    >
      Show toast
    </button>
    <h-toast message=${a.message} tone=${a.tone} @dismiss=${a.onDismiss}></h-toast>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Show toast' }));
    const toast = canvasElement.querySelector('h-toast') as HToast;
    await waitFor(() => expect(toast.open).toBe(true));
  },
};

export const Error = { args: { message: 'Could not send', tone: 'bad' }, render: Playground.render };
