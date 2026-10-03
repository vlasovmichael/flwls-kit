import { html } from 'lit';
import { expect, userEvent, within } from 'storybook/test';
import './h-tabs.ts';

type TabPanelArgs = {
  value: string;
};

const description = `Content paired with one h-tab inside h-tabs.

**Use** it for the view controlled by a direct sibling h-tab with the same value.
**Don't use** it for content that should remain visible alongside other sections.
Anatomy: h-tabs gives the panel its tabpanel role, label relationship, and hidden state.`;

export default {
  title: 'Components/Navigation/Tab Panel',
  component: 'h-tab-panel',
  args: {
    value: 'details',
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Value pairing this panel with its h-tab sibling.',
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

const render = (args: TabPanelArgs) => html`
  <h-tabs value="summary" label="Report sections">
    <h-tab value="summary">Summary</h-tab>
    <h-tab value=${args.value}>Details</h-tab>
    <h-tab-panel value="summary">Summary panel.</h-tab-panel>
    <h-tab-panel value=${args.value}>Details panel.</h-tab-panel>
  </h-tabs>
`;

export const Playground = {
  render,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Details' }));
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Details panel.');
  },
};
