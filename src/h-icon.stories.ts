import { html } from 'lit';
import { expect } from 'storybook/test';
import { ICON_NAMES, type IconName, type IconSize } from './h-icon.ts';

type IconArgs = {
  name: IconName;
  size: IconSize;
  label: string;
};

const iconDescription = `A visual symbol from the kit's registered Lucide icon set.

**Use** it beside a label or with \`label\` when the icon conveys meaning alone.
**Don't use** it as decoration when text explains the same action.
Anatomy: one SVG in shadow DOM. Props select the registered name, token-based size, and optional
accessible label.`;

export default {
  title: 'Components/Display/Icon',
  component: 'h-icon',
  args: {
    name: 'check',
    size: 'md',
    label: '',
  },
  argTypes: {
    name: {
      control: 'select',
      options: ICON_NAMES,
      description: 'Name of an icon registered in the kit bundle.',
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
      description: 'Icon box size from the spacing token scale.',
    },
    label: {
      control: 'text',
      description: 'Accessible label; without it the icon is hidden from assistive technology.',
    },
  },
  parameters: {
    docs: {
      description: {
        component: iconDescription,
      },
    },
  },
};

const renderIcon = (args: IconArgs) => html`
  <h-icon name=${args.name} size=${args.size} label=${args.label}></h-icon>
`;

export const Playground = {
  render: renderIcon,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const icon = canvasElement.querySelector('h-icon');
    await expect(icon?.shadowRoot?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  },
};

export const CheckIcon = {
  args: { name: 'check' },
  render: renderIcon,
};

export const ChevronDownIcon = {
  args: { name: 'chevron-down' },
  render: renderIcon,
};

export const InfoIcon = {
  args: { name: 'info' },
  render: renderIcon,
};

export const TrashIcon = {
  args: { name: 'trash-2' },
  render: renderIcon,
};

export const AlertIcon = {
  args: { name: 'triangle-alert' },
  render: renderIcon,
};

export const CloseIcon = {
  args: { name: 'x' },
  render: renderIcon,
};

export const Small = {
  args: { size: 'sm' },
  render: renderIcon,
};

export const Medium = {
  args: { size: 'md' },
  render: renderIcon,
};

export const Large = {
  args: { size: 'lg' },
  render: renderIcon,
};

export const Labelled = {
  args: { label: 'Position confirmed' },
  render: renderIcon,
};
