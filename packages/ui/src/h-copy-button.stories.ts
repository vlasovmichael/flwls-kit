import { html } from 'lit';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import type { HCopyButton } from './h-copy-button.ts';
import './h-copy-button.ts';

type Args = { value: string; label: string; onCopy: () => void };

export default {
  title: 'Components/Actions/Copy Button',
  component: 'h-copy-button',
  args: { value: '0x7a3f…c91e', label: 'Copy address', onCopy: fn() },
  argTypes: {
    value: { control: 'text', description: 'Text written to the clipboard' },
    label: { control: 'text', description: 'Accessible name; say what is copied' },
    onCopy: { table: { category: 'Events' }, description: '`copy` with `detail.value`' },
  },
  parameters: {
    docs: {
      description: {
        component: `Copies a value to the clipboard. The icon turns into a check for a second and a
screen reader hears "Copied". If the browser refuses, \`copy-error\` fires.

**Use** next to an address, an ID or a command people paste elsewhere.
**Don't use** for long text — offer a download instead.`,
      },
    },
  },
};

const render = (a: Args) => html`
  <div class="demo-list-row">
    <code>${a.value}</code>
    <h-copy-button value=${a.value} label=${a.label} @copy=${a.onCopy}></h-copy-button>
  </div>
`;

export const CopyTest = {
  name: 'Test: Copy',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: Args }) => {
    const button = canvasElement.querySelector('h-copy-button') as HCopyButton;
    await button.updateComplete;
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.resolve() },
      configurable: true,
    });
    await userEvent.click(button.shadowRoot?.querySelector('button') as HTMLButtonElement);
    await waitFor(() => expect(args.onCopy).toHaveBeenCalledTimes(1));
    const status = button.shadowRoot?.querySelector('[role="status"]');
    await waitFor(() => expect(status?.textContent).toBe('Copied'));
  },
};

export const Playground = { render };
