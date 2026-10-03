import { html } from 'lit';
import './h-divider.ts';

export default {
  title: 'Components/Display/Divider',
  component: 'h-divider',
  args: { label: '', orientation: 'horizontal' },
  argTypes: {
    label: { control: 'text', description: 'Optional text in the middle of the line' },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Vertical dividers separate items in a row',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `A line between groups of content, announced as a separator.

**Use** between groups that belong to one card or menu, or with a label like "or".
**Don't use** for spacing alone — use a gap — or between every list row.`,
      },
    },
  },
};

export const Playground = {
  render: (a: { label: string; orientation: 'horizontal' | 'vertical' }) => html`
    <p>Open positions</p>
    <h-divider label=${a.label} orientation=${a.orientation}></h-divider>
    <p>Closed today</p>
  `,
};

export const WithLabel = {
  name: 'With label',
  render: () => html`<h-divider label="or"></h-divider>`,
};

export const Vertical = {
  render: () => html`
    <div class="demo-row">
      <span>BTC</span><h-divider orientation="vertical"></h-divider><span>ETH</span>
      <h-divider orientation="vertical"></h-divider><span>SOL</span>
    </div>
  `,
};
