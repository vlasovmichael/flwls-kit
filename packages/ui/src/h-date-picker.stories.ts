import { html } from 'lit';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import type { HDatePicker } from './h-date-picker.ts';
import './h-date-picker.ts';

type Args = {
  value: string;
  min: string;
  max: string;
  time: boolean;
  label: string;
  placeholder: string;
  locale: string;
  disabled: boolean;
  onChange: () => void;
};

export default {
  title: 'Components/Form Controls/Date Picker',
  component: 'h-date-picker',
  args: {
    value: '2026-10-14',
    min: '',
    max: '',
    time: false,
    label: 'Report date',
    placeholder: 'Pick a date',
    locale: 'en-GB',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    value: { control: 'text', description: '`YYYY-MM-DD`, or `YYYY-MM-DDTHH:MM` with `time`' },
    min: { control: 'text', description: 'Earliest day that can be picked, `YYYY-MM-DD`' },
    max: { control: 'text', description: 'Latest day that can be picked, `YYYY-MM-DD`' },
    time: {
      control: 'boolean',
      description: 'Adds a time field; the calendar stays open after a day',
    },
    label: { control: 'text', description: 'Accessible name of the field and the calendar' },
    placeholder: { control: 'text', description: 'Shown while the value is empty' },
    locale: {
      control: 'inline-radio',
      options: ['en-GB', 'en-US', 'pl-PL', 'ru-RU'],
      description: 'Month names and the first day of the week. Defaults to the page language',
    },
    disabled: { control: 'boolean', description: 'Disables the field' },
    onChange: { table: { category: 'Events' }, description: '`change` with `detail.value`' },
  },
  parameters: {
    docs: {
      description: {
        component: `A date field with a calendar. The month grid always has six weeks,
so it does not jump while paging; today is marked with a dot, the selected day is filled.

**Use** for a single day or a moment: report date, a reminder, an entry time.
**Don't use** for dates far in the past, like a birthday — a plain text field is faster there.

Keyboard in the calendar: arrows move by day and week, Home and End to the week's edges,
Page Up and Page Down by month (with Shift — by year), Enter picks, Escape closes.
The calendar lives in the top layer, so \`overflow: hidden\` on a parent does not clip it.`,
      },
      story: { inline: false, height: '440px' },
    },
  },
};

const render = (a: Args) => html`
  <h-date-picker
    value=${a.value}
    min=${a.min}
    max=${a.max}
    ?time=${a.time}
    label=${a.label}
    placeholder=${a.placeholder}
    locale=${a.locale}
    ?disabled=${a.disabled}
    @change=${a.onChange}
  ></h-date-picker>
`;

const opened = (a: Args) => html`
  <h-date-picker
    open
    value=${a.value}
    min=${a.min}
    max=${a.max}
    ?time=${a.time}
    label=${a.label}
    locale=${a.locale}
  ></h-date-picker>
`;

type Ctx = { canvasElement: HTMLElement; args: Args };

export const KeyboardTest = {
  name: 'Test: Keyboard',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement, args }: Ctx) => {
    const picker = canvasElement.querySelector('h-date-picker') as HDatePicker;
    await picker.updateComplete;
    const root = picker.shadowRoot as ShadowRoot;
    const trigger = root.querySelector('.trigger') as HTMLButtonElement;
    const focused = () => (root.activeElement as HTMLElement | null)?.dataset.day;

    await userEvent.click(trigger);
    await waitFor(() => expect(focused()).toBe('2026-10-14'));

    await userEvent.keyboard('{ArrowDown}{ArrowLeft}');
    await waitFor(() => expect(focused()).toBe('2026-10-20'));
    await userEvent.keyboard('{PageDown}');
    await waitFor(() => expect(focused()).toBe('2026-11-20'));
    await userEvent.keyboard('{Enter}');

    await expect(picker.value).toBe('2026-11-20');
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(root.activeElement).toBe(trigger));
  },
};

export const ReopenTest = {
  name: 'Test: Reopen and Escape',
  tags: ['!dev', '!autodocs'],
  render,
  play: async ({ canvasElement }: Ctx) => {
    const picker = canvasElement.querySelector('h-date-picker') as HDatePicker;
    await picker.updateComplete;
    const root = picker.shadowRoot as ShadowRoot;
    const pop = root.querySelector('.pop') as HTMLElement;

    for (let round = 0; round < 2; round += 1) {
      await userEvent.click(root.querySelector('.trigger') as HTMLButtonElement);
      await waitFor(() => expect(pop.matches(':popover-open')).toBe(true));
      await Promise.all(pop.getAnimations().map((a) => a.finished));
      await expect(getComputedStyle(pop).opacity).toBe('1');
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(pop.matches(':popover-open')).toBe(false));
    }
  },
};

export const Playground = {
  render,
};

export const Open = {
  render: opened,
};

export const WithTime = {
  name: 'With time',
  args: { value: '2026-10-14T09:30', time: true, label: 'Reminder' },
  render: opened,
};

export const MinAndMax = {
  name: 'Min and max',
  args: { min: '2026-10-05', max: '2026-10-23' },
  render: opened,
};

export const WeekStartsOnSunday = {
  name: 'Week starts on Sunday',
  args: { locale: 'en-US' },
  render: opened,
};

export const States = {
  render: () => html`
    <div class="demo-row">
      <h-date-picker label="Start date" locale="en-GB"></h-date-picker>
      <h-date-picker label="Report date" value="2026-10-14" locale="en-GB"></h-date-picker>
      <h-date-picker label="Locked date" value="2026-10-14" locale="en-GB" disabled></h-date-picker>
    </div>
  `,
};
