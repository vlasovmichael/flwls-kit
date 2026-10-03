import { html } from 'lit';
import { expect, fn, userEvent } from 'storybook/test';
import './h-accordion.ts';

type AccordionArgs = {
  label: string;
  multiple: boolean;
  onChange: () => void;
};

const description = `A group of related disclosures that can keep one or several sections open.

**Use** for compact, independent details such as account sections or a list of FAQs.
**Don't use** for page navigation, a linear workflow, or content people need to compare at once.
Anatomy: direct h-disclosure children provide each header and controlled region. The label property
names the group, multiple permits concurrent open sections, and change reports the changed
disclosure.`;

export default {
  title: 'Components/Navigation/Accordion',
  component: 'h-accordion',
  args: {
    label: 'Account details',
    multiple: false,
    onChange: fn(),
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Accessible name announced for the accordion group.',
    },
    multiple: {
      control: 'boolean',
      description: 'Whether more than one direct disclosure can remain open.',
    },
    onChange: {
      table: { category: 'Events' },
      description: 'Composed change event with the changed disclosure and open state in detail.',
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

const render = (args: AccordionArgs) => html`
  <h-accordion
    label=${args.label}
    ?multiple=${args.multiple}
    @change=${args.onChange}
  >
    <h-disclosure open>
      <span slot="summary">Account summary</span>
      <p>Balance, available funds, and settlement information.</p>
    </h-disclosure>
    <h-disclosure>
      <span slot="summary">Risk settings</span>
      <p>Alerts, position limits, and review frequency.</p>
    </h-disclosure>
    <h-disclosure>
      <span slot="summary">Data sources</span>
      <p>Connected exchanges and data refresh settings.</p>
    </h-disclosure>
  </h-accordion>
`;

export const PlaygroundTest = {
  name: 'Test: Playground',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: { canvasElement: HTMLElement; args: AccordionArgs }) => {
    const accordion = canvasElement.querySelector('h-accordion') as HTMLElement;
    const disclosures = [...accordion.querySelectorAll('h-disclosure')];
    const headers = disclosures.map((disclosure) => {
      return disclosure.shadowRoot?.querySelector('button') as HTMLButtonElement;
    });

    headers[0].focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(document.activeElement).toBe(disclosures[1]);
    await expect(disclosures[1].shadowRoot?.activeElement).toBe(headers[1]);
    await userEvent.keyboard('{Enter}');
    await expect(headers[0]).toHaveAttribute('aria-expanded', 'false');
    await expect(headers[1]).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onChange).toHaveBeenCalledTimes(1);
  },
};

export const Playground = {
  render: PlaygroundTest.render,
};

export const Single = {
  args: { multiple: false },
  render,
};

export const Multiple = {
  args: { multiple: true },
  render,
};

export const CustomLabel = {
  args: { label: 'Frequently asked questions' },
  render,
};
