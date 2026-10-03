import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import './h-button.ts';
import './h-alert.ts';

type AlertArgs = {
  title: string;
  tone: 'info' | 'success' | 'warning' | 'error';
  dismissible: boolean;
  onDismiss: () => void;
};

const description = `An inline banner communicates an important state near the content it affects.

**Use** for a saved setting, an important warning, a failure, or contextual guidance.
**Don't use** for a transient result after an action; use HToast instead.
Anatomy: semantic icon, optional title, default message slot, optional action slot, and
a labelled close button when dismissible. Tone chooses the state meaning; warning and
error use an assertive alert role, while info and success use a polite status role.`;

export default {
  title: 'Components/Display/Alert',
  component: 'h-alert',
  args: {
    title: 'Changes saved',
    tone: 'success',
    dismissible: true,
    onDismiss: fn(),
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional concise heading for the banner.',
    },
    tone: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Semantic state and live-region urgency.',
    },
    dismissible: {
      control: 'boolean',
      description: 'Shows a labelled button that hides the banner.',
    },
    onDismiss: {
      table: { category: 'Events' },
      description: 'Composed dismiss event emitted after the close button is activated.',
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

const render = (args: AlertArgs) => html`
  <h-alert
    title=${args.title}
    tone=${args.tone}
    ?dismissible=${args.dismissible}
    @dismiss=${args.onDismiss}
  >
    Your changes are available to everyone.
    <h-button slot="action" size="sm" variant="ghost">Review changes</h-button>
  </h-alert>
`;

export const PlaygroundTest = {
  name: 'Test: Playground',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: AlertArgs }) => {
    const alert = canvasElement.querySelector('h-alert') as HAlertElement;
    await alert.updateComplete;
    const close = alert.shadowRoot.querySelector('.close') as HTMLButtonElement;

    close.focus();
    await userEvent.keyboard('{Enter}');

    await expect(alert).toHaveAttribute('hidden');
    await expect(args.onDismiss).toHaveBeenCalledTimes(1);
  },
};

export const Playground = {
  render: PlaygroundTest.render,
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

export const WithoutTitle = {
  args: { title: '' },
  render,
};

export const NotDismissible = {
  args: { dismissible: false },
  render,
};

type HAlertElement = HTMLElement & {
  shadowRoot: ShadowRoot;
  updateComplete: Promise<void>;
};
