import { html } from 'lit';
import { expect } from 'storybook/test';
import './h-button.ts';
import './h-card.ts';

type CardArgs = {
  variant: 'surface' | 'raised' | 'outlined';
};

const cardDescription = `A surface that groups one related piece of content.

**Use** it to separate a self-contained summary, task, or record from the page.
**Don't use** it to wrap every small element or to make a whole page look like nested boxes.
Anatomy: header introduces the card, the default slot contains its content, and footer
and actions hold supporting information and controls. The variant property sets elevation.`;

export default {
  title: 'Components/Display/Card',
  component: 'h-card',
  args: {
    variant: 'surface',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['surface', 'raised', 'outlined'],
      description: 'Surface treatment and elevation of the card.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: cardDescription,
      },
    },
  },
};

const renderCard = (args: CardArgs) => html`
  <h-card variant=${args.variant}>
    <h2 slot="header">Account balance</h2>
    <p>Available to trade: 12,480 USD.</p>
    <span slot="footer">Updated just now</span>
    <h-button slot="actions" variant="primary" size="sm">Review</h-button>
  </h-card>
`;

export const PlaygroundTest = {
  name: 'Test: Playground',
  tags: ['!dev', '!autodocs'],
  render: renderCard,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const card = canvasElement.querySelector('h-card') as HCardElement;
    await card.updateComplete;

    await expect(card.shadowRoot.querySelector('header')).not.toBeNull();
    await expect(card.shadowRoot.querySelector('footer')).not.toBeNull();
    await expect(card.shadowRoot.querySelector('slot[name="actions"]')).not.toBeNull();
  },
};

export const Playground = {
  render: PlaygroundTest.render,
};

export const Surface = {
  args: { variant: 'surface' },
  render: renderCard,
};

export const Raised = {
  args: { variant: 'raised' },
  render: renderCard,
};

export const Outlined = {
  args: { variant: 'outlined' },
  render: renderCard,
};

type HCardElement = HTMLElement & {
  shadowRoot: ShadowRoot;
  updateComplete: Promise<void>;
};
