import { html } from 'lit';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import './h-toast.ts';
import type { HToast, ToastTone } from './h-toast.ts';

type Args = {
  title: string;
  message: string;
  tone: ToastTone;
  duration: number;
  dismissible: boolean;
  onDismiss: () => void;
};

export default {
  title: 'Components/Overlays/Toast',
  component: 'h-toast',
  args: {
    title: 'Saved',
    message: 'Your changes are available to everyone.',
    tone: 'success',
    duration: 0,
    dismissible: true,
    onDismiss: fn(),
  },
  argTypes: {
    title: { control: 'text', description: 'Optional concise heading.' },
    message: { control: 'text', description: 'Fallback text for the default slot.' },
    tone: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error', 'ok', 'bad'],
      description: 'Status tone; `ok` and `bad` are compatibility aliases.',
    },
    duration: {
      control: { type: 'number', min: 0, step: 100 },
      description: 'Milliseconds to wait; zero leaves the toast open.',
    },
    dismissible: { control: 'boolean', description: 'Shows the labelled close button.' },
    onDismiss: {
      table: { category: 'Events' },
      description: '`dismiss` detail has `timeout`, `close` or `action` reason.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A short, non-blocking result message with a keyboard-operable close button.
Anatomy: icon, optional title, message, action slot and close button.

**Use** after a completed action such as saving or sending.
**Don't use** for an error the user must correct; place that next to its field.`,
      },
    },
  },
};

const render = (args: Args) => html`
  <button
    class="demo-button"
    @click=${(event: Event) => {
      const toast = (event.currentTarget as HTMLElement).nextElementSibling as HToast;
      toast.open = true;
    }}
  >
    Open toast
  </button>
  <h-toast
    .title=${args.title}
    .message=${args.message}
    .tone=${args.tone}
    .duration=${args.duration}
    .dismissible=${args.dismissible}
    @dismiss=${args.onDismiss}
  ></h-toast>
`;

export const Playground = {
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: Args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open toast' }));
    const toast = canvasElement.querySelector('h-toast') as HToast;
    await waitFor(() => expect(toast.open).toBe(true));
    const close = toast.shadowRoot?.querySelector('.close') as HTMLButtonElement;
    close.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(args.onDismiss).toHaveBeenCalled());
  },
};

export const Info = {
  args: { tone: 'info' },
  render,
};

export const Success = {
  args: { tone: 'success' },
  render,
};

export const Warning = {
  args: { tone: 'warning' },
  render,
};

export const Error = {
  args: { tone: 'error' },
  render,
};

export const LegacyOk = {
  args: { tone: 'ok' },
  render,
};

export const LegacyBad = {
  args: { tone: 'bad' },
  render,
};

export const Timed = {
  args: { duration: 2400 },
  render,
};

export const WithoutCloseButton = {
  args: { dismissible: false },
  render,
};
