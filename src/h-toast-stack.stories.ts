import { html } from 'lit';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import './h-toast-stack.ts';
import type { HToastStack, ToastPosition } from './h-toast-stack.ts';

type Args = { maxVisible: number; position: ToastPosition; onDismiss: () => void };

export default {
  title: 'Components/Overlays/Toast Stack',
  component: 'h-toast-stack',
  args: { maxVisible: 3, position: 'bottom-end', onDismiss: fn() },
  argTypes: {
    maxVisible: { control: { type: 'number', min: 1 }, description: 'Visible queue limit.' },
    position: {
      control: 'select',
      options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'],
      description: 'Fixed viewport corner.',
    },
    onDismiss: { table: { category: 'Events' }, description: 'Removed id and reason.' },
  },
  parameters: {
    docs: {
      description: {
        component: `The notification queue owner. Call \`show(options)\` for limits, timers
and removal.

**Use** one stack near the application root.
**Don't use** it for inline validation; show that next to the input.`,
      },
    },
  },
};

const render = (args: Args) => html`
  <button
    class="demo-button"
    @click=${(event: Event) => {
      const stack = (event.currentTarget as HTMLElement).nextElementSibling as HToastStack;
      stack.show({
        title: 'Saved',
        message: 'Your settings have been updated.',
        duration: 0,
      });
    }}
  >
    Add notification
  </button>
  <h-toast-stack
    .maxVisible=${args.maxVisible}
    .position=${args.position}
    @dismiss=${args.onDismiss}
  ></h-toast-stack>
`;

export const PlaygroundTest = {
  name: 'Test: Playground',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Add notification' }));
    const stack = canvasElement.querySelector('h-toast-stack') as HToastStack;
    await waitFor(() => expect(stack.shadowRoot?.querySelector('h-toast')).not.toBeNull());
    const toast = stack.shadowRoot?.querySelector('h-toast') as HTMLElement;
    const close = toast.shadowRoot?.querySelector('.close') as HTMLButtonElement;
    await userEvent.click(close);
    await waitFor(() => expect(stack.shadowRoot?.querySelector('h-toast')).toBeNull());
  },
};

export const Playground = {
  render: PlaygroundTest.render,
};

export const TopStart = {
  args: { position: 'top-start' },
  render,
};

export const TopEnd = {
  args: { position: 'top-end' },
  render,
};

export const BottomStart = {
  args: { position: 'bottom-start' },
  render,
};

export const LimitedQueue = {
  args: { maxVisible: 1 },
  render,
};
