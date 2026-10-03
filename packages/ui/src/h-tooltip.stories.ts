import { html } from 'lit';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import './h-tooltip.ts';
import type { TooltipAlign, TooltipSide } from './h-tooltip.ts';

type TooltipArgs = {
  open: boolean;
  side: TooltipSide;
  align: TooltipAlign;
  delay: number;
  disabled: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const description = `A short label that explains an unfamiliar control on hover or focus.

**Use** it for concise supplementary information when a visible label is not enough.
**Don't use** it for instructions, interactive content, or information people must read;
put those in the page instead.
Anatomy: the trigger slot holds the labelled control and the default slot holds plain tooltip text.
Properties set its controlled state, preferred side, alignment, hover delay, and availability.`;

export default {
  title: 'Components/Overlays/Tooltip',
  component: 'h-tooltip',
  args: {
    open: false,
    side: 'top',
    align: 'center',
    delay: 400,
    disabled: false,
    onOpen: fn(),
    onClose: fn(),
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the tooltip is visible; interaction also updates this property.',
    },
    side: {
      control: 'inline-radio',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Preferred side of the trigger for the tooltip.',
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end'],
      description: 'Alignment on the selected side of the trigger.',
    },
    delay: {
      control: { type: 'number', min: 0, step: 100 },
      description: 'Milliseconds to wait before opening after mouse hover.',
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents hover, focus, and touch from opening the tooltip.',
    },
    onOpen: {
      table: { category: 'Events' },
      description: 'Fires when the tooltip becomes visible.',
    },
    onClose: {
      table: { category: 'Events' },
      description: 'Fires when the tooltip becomes hidden.',
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

const render = (args: TooltipArgs) => html`
  <h-tooltip
    .open=${args.open}
    side=${args.side}
    align=${args.align}
    .delay=${args.delay}
    .disabled=${args.disabled}
    @open=${args.onOpen}
    @close=${args.onClose}
  >
    <button slot="trigger" type="button">Open tooltip</button>
    Market prices update every second.
  </h-tooltip>
`;

export const Playground = {
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: TooltipArgs }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open tooltip' });
    const tooltip = canvasElement.querySelector('h-tooltip') as HTMLElement & {
      open: boolean;
      shadowRoot: ShadowRoot;
    };

    await userEvent.hover(trigger);
    await waitFor(() => expect(tooltip.open).toBe(true));
    await expect(trigger.getAttribute('aria-describedby')).toContain('tooltip-');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(tooltip.open).toBe(false));
    await expect(args.onOpen).toHaveBeenCalled();
    await expect(args.onClose).toHaveBeenCalled();
  },
};

export const Top = {
  args: { side: 'top' },
  render,
};

export const Right = {
  args: { side: 'right' },
  render,
};

export const Bottom = {
  args: { side: 'bottom' },
  render,
};

export const Left = {
  args: { side: 'left' },
  render,
};

export const StartAligned = {
  args: { align: 'start' },
  render,
};

export const EndAligned = {
  args: { align: 'end' },
  render,
};

export const WithoutDelay = {
  args: { delay: 0 },
  render,
};

export const Disabled = {
  args: { disabled: true },
  render,
};
