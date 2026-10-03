import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import './h-tag.ts';

type Args = {
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'error';
  removable: boolean;
  label: string;
  onRemove: () => void;
};

const description = `A tag represents a selected value and can offer a separate removal action.

**Use** it for filters, watchlist items, and other values users can remove.
**Don't use** it for passive status; use HBadge.
Anatomy: optional prefix, text slot, close button.`;

export default {
  title: 'Components/Display/Tag',
  component: 'h-tag',
  args: {
    tone: 'neutral',
    removable: true,
    label: 'BTC',
    onRemove: fn(),
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'error'],
      description: 'Semantic status tone for the tag.',
    },
    removable: {
      control: 'boolean',
      description: 'Shows an accessible button that emits remove.',
    },
    label: {
      control: 'text',
      description: 'Fallback text and accessible name for removal.',
    },
    onRemove: {
      table: { category: 'Events' },
      description: 'Composed remove event from the close button.',
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

const render = (args: Args) => html`
  <h-tag
    tone=${args.tone}
    label=${args.label}
    ?removable=${args.removable}
    @remove=${args.onRemove}
  >
    <span slot="prefix" aria-hidden="true">#</span>
    ${args.label}
  </h-tag>
`;

export const Playground = {
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: Args }) => {
    const tag = canvasElement.querySelector('h-tag') as HTMLElement & {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<void>;
    };
    await tag.updateComplete;
    const button = tag.shadowRoot.querySelector('button') as HTMLButtonElement;
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onRemove).toHaveBeenCalledTimes(1);
  },
};

export const Neutral = {
  args: { tone: 'neutral' },
  render,
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

export const Removable = {
  args: { removable: true },
  render,
};

export const Fixed = {
  args: { removable: false, label: 'Read only' },
  render,
};
