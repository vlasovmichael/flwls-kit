import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import './h-disclosure.ts';

type DisclosureArgs = {
  open: boolean;
  disabled: boolean;
  onChange: () => void;
};

const description = `A button that reveals or hides supporting content in the same context.

**Use** for optional details such as a day's activity, notes, or an expandable simulation.
**Don't use** for primary navigation, a multi-step workflow, or content that must always be visible.
Anatomy: the summary slot labels the native button; the default slot is a controlled,
labelled region. The open property controls visibility, disabled prevents changes,
and change reports a user toggle.`;

export default {
  title: 'Components/Navigation/Disclosure',
  component: 'h-disclosure',
  args: {
    open: false,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the controlled content region is visible.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents the button from changing the disclosure state.',
    },
    onChange: {
      table: { category: 'Events' },
      description: 'Composed change event with the new open state in detail.',
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

const render = (args: DisclosureArgs) => html`
  <h-disclosure
    ?open=${args.open}
    ?disabled=${args.disabled}
    @change=${args.onChange}
  >
    <span slot="summary">Monthly activity</span>
    <p>12 entries were recorded this month.</p>
  </h-disclosure>
`;

export const PlaygroundTest = {
  name: 'Test: Playground',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({
    canvasElement,
    args,
  }: {
    canvasElement: HTMLElement;
    args: DisclosureArgs;
  }) => {
    const disclosure = canvasElement.querySelector('h-disclosure') as HTMLElement & {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<void>;
    };
    await disclosure.updateComplete;
    const button = disclosure.shadowRoot.querySelector('button') as HTMLButtonElement;

    button.focus();
    await userEvent.keyboard('{Enter}');
    await disclosure.updateComplete;

    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

export const Playground = {
  render: PlaygroundTest.render,
};

export const Closed = {
  args: { open: false },
  render,
};

export const Open = {
  args: { open: true },
  render,
};

export const Disabled = {
  args: { disabled: true },
  render,
};
