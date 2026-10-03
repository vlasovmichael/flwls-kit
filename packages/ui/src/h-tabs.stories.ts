import { html } from 'lit';
import { expect, fn, userEvent, within } from 'storybook/test';
import './h-tabs.ts';
import type { TabsActivation, TabsOrientation, TabsVariant } from './h-tabs.ts';

type TabsArgs = {
  value: string;
  orientation: TabsOrientation;
  activation: TabsActivation;
  variant: TabsVariant;
  label: string;
  onChange: () => void;
};

const description = `A container for switching between related views without leaving the page.

**Use** for a small set of peer sections where exactly one panel is visible.
**Don't use** for page navigation, a linear workflow, or unrelated actions.
Anatomy: direct h-tab children form the labelled tablist and direct h-tab-panel children
hold matching content. Match every tab and panel with the same value property.`;

export default {
  title: 'Components/Navigation/Tabs',
  component: 'h-tabs',
  args: {
    value: 'overview',
    orientation: 'horizontal',
    activation: 'automatic',
    variant: 'contained',
    label: 'Account sections',
    onChange: fn(),
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Value of the selected enabled tab.',
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description: 'Arrow-key direction and visual arrangement of tabs.',
    },
    activation: {
      control: 'inline-radio',
      options: ['automatic', 'manual'],
      description: 'Whether moving focus with arrows immediately changes the panel.',
    },
    variant: {
      control: 'inline-radio',
      options: ['contained', 'wrap'],
      description: 'Contained switcher surface or a wrapping underline tab list.',
    },
    label: {
      control: 'text',
      description: 'Accessible name announced for the tablist.',
    },
    onChange: {
      table: { category: 'Events' },
      description: 'Composed change event with the selected value and tab in detail.',
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

const render = (args: TabsArgs) => html`
  <h-tabs
    .value=${args.value}
    orientation=${args.orientation}
    activation=${args.activation}
    variant=${args.variant}
    label=${args.label}
    @change=${args.onChange}
  >
    <h-tab value="overview">Overview</h-tab>
    <h-tab value="activity">Activity</h-tab>
    <h-tab value="settings">Settings</h-tab>
    <h-tab-panel value="overview">Your account overview.</h-tab-panel>
    <h-tab-panel value="activity">Your recent activity.</h-tab-panel>
    <h-tab-panel value="settings">Your account settings.</h-tab-panel>
  </h-tabs>
`;

export const Playground = {
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: TabsArgs }) => {
    const canvas = within(canvasElement);
    const overview = canvas.getByRole('tab', { name: 'Overview' });
    const activity = canvas.getByRole('tab', { name: 'Activity' });
    overview.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(activity).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('recent activity');
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

export const Contained = {
  args: { variant: 'contained' },
  render,
};

export const Wrap = {
  args: { variant: 'wrap' },
  render,
};

export const Horizontal = {
  args: { orientation: 'horizontal' },
  render,
};

export const Vertical = {
  args: { orientation: 'vertical' },
  render,
};

export const AutomaticActivation = {
  args: { activation: 'automatic' },
  render,
};

export const ManualActivation = {
  args: { activation: 'manual' },
  render,
};

export const WithDisabledTab = {
  render: (args: TabsArgs) => html`
    <h-tabs
      .value=${args.value}
      orientation=${args.orientation}
      activation=${args.activation}
      variant=${args.variant}
      label=${args.label}
      @change=${args.onChange}
    >
      <h-tab value="overview">Overview</h-tab>
      <h-tab value="activity" disabled>Activity</h-tab>
      <h-tab value="settings">Settings</h-tab>
      <h-tab-panel value="overview">Your account overview.</h-tab-panel>
      <h-tab-panel value="activity">Your recent activity.</h-tab-panel>
      <h-tab-panel value="settings">Your account settings.</h-tab-panel>
    </h-tabs>
  `,
};
