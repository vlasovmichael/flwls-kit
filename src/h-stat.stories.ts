import { html } from 'lit';
import './h-stat.ts';

type Args = { label: string; value: string; note: string; tone: '' | 'data' | 'attn' };

export default {
  title: 'Components/Display/Stat',
  component: 'h-stat',
  args: { label: 'Steps', value: '7,000', note: 'today', tone: '' },
  argTypes: {
    label: { control: 'text', description: 'Caption above the number' },
    value: { control: 'text', description: 'The number, already formatted' },
    note: { control: 'text', description: 'Context under the number: period, comparison' },
    tone: { control: 'inline-radio', options: ['', 'data', 'attn'], description: 'Colors the number: good or needs attention' },
  },
  parameters: {
    docs: {
      description: {
        component: `One number with a caption: equity, steps, blood pressure. Big figure in \`--display\`,
caption above, context below.

**Use** for the key value of a screen, or a row of 2–4 metrics.
**Don't use** for a table of numbers — use a \`<table>\` with \`--mono\`.`,
      },
    },
  },
};

export const Playground = {
  render: (a: Args) => html`<h-stat label=${a.label} value=${a.value} note=${a.note} tone=${a.tone}></h-stat>`,
};

export const Good = { args: { label: 'Equity', value: '$105.09', note: '+0.4% today', tone: 'data' }, render: Playground.render };

export const Attention = { args: { label: 'Blood pressure', value: '164/96', note: 'above normal', tone: 'attn' }, render: Playground.render };

export const Row = {
  render: () => html`<div class="demo-row">
    <h-stat label="Equity" value="$105.09" note="+0.4% today" tone="data"></h-stat>
    <h-stat label="Open positions" value="0" note="flat"></h-stat>
    <h-stat label="Drawdown" value="−3.1%" note="of 8% limit" tone="attn"></h-stat>
  </div>`,
};
