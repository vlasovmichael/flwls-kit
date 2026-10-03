import { html } from 'lit';
import { expect, fn, userEvent, within } from 'storybook/test';
import './h-tabs.ts';

type TabArgs = {
  value: string;
  disabled: boolean;
  onClick: () => void;
};

const description = `One selectable label inside h-tabs.

**Use** it only as a direct child of h-tabs with a matching h-tab-panel value.
**Don't use** it as a standalone button or navigation link.
Anatomy: its slotted text is the accessible tab label; h-tabs supplies selection and focus state.`;

export default {
  title: 'Components/Navigation/Tab',
  component: 'h-tab',
  args: {
    value: 'details',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Value used to select this tab and its matching panel.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents this tab from receiving focus or changing the panel.',
    },
    onClick: {
      table: { category: 'Events' },
      description: 'Native composed click event from the tab host.',
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

const render = (args: TabArgs) => html`
  <h-tabs value="summary" label="Report sections">
    <h-tab value="summary" @click=${args.onClick}>Summary</h-tab>
    <h-tab value=${args.value} ?disabled=${args.disabled} @click=${args.onClick}>Details</h-tab>
    <h-tab-panel value="summary">Summary panel.</h-tab-panel>
    <h-tab-panel value=${args.value}>Details panel.</h-tab-panel>
  </h-tabs>
`;

export const PlaygroundTest = {
  name: 'Test: Playground',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: TabArgs }) => {
    const canvas = within(canvasElement);
    const details = canvas.getByRole('tab', { name: 'Details' });
    await userEvent.click(details);
    await expect(details).toHaveAttribute('aria-selected', 'true');
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Playground = {
  render: PlaygroundTest.render,
};

export const Disabled = {
  args: { disabled: true },
  render,
};
