import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import './h-button.ts';
import './h-icon.ts';

type Args = {
  variant: 'neutral' | 'primary' | 'danger' | 'ghost' | 'positive' | 'negative';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  loading: boolean;
  block: boolean;
  type: 'button' | 'submit' | 'reset';
  onClick: () => void;
};

const description = `A native, form-associated action button. **Use** primary for one main action.
**Don't use** color merely as decoration. Anatomy: icon slots surround the text slot.`;

export default {
  title: 'Components/Actions/Button',
  component: 'h-button',
  args: {
    variant: 'neutral',
    size: 'md',
    disabled: false,
    loading: false,
    block: false,
    type: 'button',
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'primary', 'danger', 'ghost', 'positive', 'negative'],
      description: 'Semantic action tone.',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Height, text size and padding.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents interaction and form submission.',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a spinner and prevents interaction.',
    },
    block: {
      control: 'boolean',
      description: 'Fills available inline width.',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'Native behavior for the nearest outer form.',
    },
    onClick: {
      table: { category: 'Events' },
      description: 'Native composed `click` event.',
    },
  },
  parameters: {
    docs: { description: { component: description } },
  },
};

const render = (args: Args) => html`
  <h-button
    variant=${args.variant}
    size=${args.size}
    type=${args.type}
    ?disabled=${args.disabled}
    ?loading=${args.loading}
    ?block=${args.block}
    @click=${args.onClick}
  >
    <span slot="icon-start" aria-hidden="true">+</span>
    Save changes
    <span slot="icon-end" aria-hidden="true">→</span>
  </h-button>
`;

export const PlaygroundTest = {
  name: 'Test: Playground',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: Args }) => {
    const component = canvasElement.querySelector('h-button') as HTMLElement & {
      shadowRoot: ShadowRoot;
      updateComplete: Promise<void>;
    };
    await component.updateComplete;
    const button = component.shadowRoot.querySelector('button') as HTMLButtonElement;
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

export const Playground = {
  render: PlaygroundTest.render,
};

export const Neutral = { render };

export const Primary = { args: { variant: 'primary' }, render };

export const Danger = { args: { variant: 'danger' }, render };

export const Ghost = { args: { variant: 'ghost' }, render };

export const Positive = { args: { variant: 'positive' }, render };

export const Negative = { args: { variant: 'negative' }, render };

export const Small = { args: { size: 'sm' }, render };

export const Medium = { args: { size: 'md' }, render };

export const Large = { args: { size: 'lg' }, render };

export const Disabled = { args: { disabled: true }, render };

export const Loading = { args: { loading: true }, render };

export const Block = { args: { block: true }, render };

export const IconButton = {
  name: 'Icon button',
  render: () => html`
    <h-icon-button label="Close dialog" @click=${fn()}>
      <h-icon name="x"></h-icon>
    </h-icon-button>
  `,
  parameters: {
    docs: {
      description: {
        story: 'Use an icon button only when its required `label` makes the action unambiguous.',
      },
    },
  },
};
