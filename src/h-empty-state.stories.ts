import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import './h-button.ts';
import './h-empty-state.ts';
import './h-icon.ts';

type EmptyStateArgs = {
  title: string;
  description: string;
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'error';
  onClick: () => void;
};

const description = `An empty state explains why a content area has no items and offers a next step.

**Use** it when a list, search result, or dashboard section has no useful content yet.
**Don't use** it for a loading state; use HSkeleton while information is still arriving.
Anatomy: the icon slot provides a visual cue, title and description explain the state, and
the action slot contains the next action. Tone gives the icon semantic emphasis.`;

export default {
  title: 'Components/Display/Empty State',
  component: 'h-empty-state',
  args: {
    title: 'No watchlist items',
    description: 'Add a market to start tracking its price and volume.',
    tone: 'neutral',
    onClick: fn(),
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Heading that explains the empty state.',
    },
    description: {
      control: 'text',
      description: 'Optional supporting text with context or guidance.',
    },
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'info', 'success', 'warning', 'error'],
      description: 'Semantic emphasis for the icon.',
    },
    onClick: {
      table: { category: 'Events' },
      description: 'Native composed click from an action slotted into the state.',
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

const render = (args: EmptyStateArgs) => html`
  <h-empty-state
    title=${args.title}
    description=${args.description}
    tone=${args.tone}
    @click=${args.onClick}
  >
    <h-icon slot="icon" name="search"></h-icon>
    <h-button slot="action" variant="primary">Add market</h-button>
  </h-empty-state>
`;

export const PlaygroundTest = {
  name: 'Test: Playground',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: EmptyStateArgs }) => {
    const state = canvasElement.querySelector('h-empty-state') as HTMLElement & {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<void>;
    };
    await state.updateComplete;
    const action = state.querySelector('h-button') as HTMLElement & {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<void>;
    };
    await action.updateComplete;
    const button = action.shadowRoot.querySelector('button') as HTMLButtonElement;
    button.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Playground = {
  render: PlaygroundTest.render,
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
