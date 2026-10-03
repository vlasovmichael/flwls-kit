import { expect, test, vi } from 'vitest';
import {
  HSegmentedControl,
  type SegmentedControlSize,
} from './h-segmented-control.ts';

const options = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
];

async function appendControl(control: HSegmentedControl) {
  document.body.append(control);
  await control.updateComplete;
  return control.shadowRoot?.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
}

test.each<SegmentedControlSize>(['sm', 'md', 'lg'])(
  'контрол отражает размер %s',
  async (size) => {
    const control = new HSegmentedControl();
    control.options = options;
    control.size = size;
    await appendControl(control);

    expect(control.getAttribute('size')).toBe(size);
    control.remove();
  },
);

test('контрол объявляет группу радиокнопок и выбранное значение', async () => {
  const control = new HSegmentedControl();
  control.label = 'Period';
  control.options = options;
  control.value = 'week';
  const buttons = await appendControl(control);

  const group = control.shadowRoot?.querySelector('[role="radiogroup"]');
  expect(group?.getAttribute('aria-label')).toBe('Period');
  expect(buttons[1].getAttribute('role')).toBe('radio');
  expect(buttons[1].getAttribute('aria-checked')).toBe('true');
  expect(buttons[1].getAttribute('tabindex')).toBe('0');
  control.remove();
});

test('клик меняет значение и отправляет составное событие change', async () => {
  const control = new HSegmentedControl();
  control.options = options;
  control.value = 'day';
  const changed = vi.fn();
  document.body.addEventListener('change', changed);
  const buttons = await appendControl(control);

  buttons[1].click();

  expect(control.value).toBe('week');
  expect(changed).toHaveBeenCalledWith(
    expect.objectContaining({ detail: { value: 'week', option: options[1] } }),
  );
  document.body.removeEventListener('change', changed);
  control.remove();
});

test('стрелки выбирают следующий сегмент и переносят фокус', async () => {
  const control = new HSegmentedControl();
  control.options = options;
  control.value = 'day';
  const buttons = await appendControl(control);

  buttons[0].focus();
  buttons[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
  await control.updateComplete;

  expect(control.value).toBe('week');
  expect(control.shadowRoot?.activeElement).toBe(buttons[1]);
  control.remove();
});

test('Home и End выбирают крайние доступные сегменты', async () => {
  const control = new HSegmentedControl();
  control.options = [
    options[0],
    { label: 'Week', value: 'week', disabled: true },
    options[2],
  ];
  control.value = 'month';
  const buttons = await appendControl(control);

  buttons[2].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Home' }));
  await control.updateComplete;
  expect(control.value).toBe('day');

  buttons[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'End' }));
  await control.updateComplete;
  expect(control.value).toBe('month');
  control.remove();
});

test('отключённый контрол и сегмент не меняют значение', async () => {
  const control = new HSegmentedControl();
  control.options = [options[0], { label: 'Week', value: 'week', disabled: true }];
  control.value = 'day';
  const buttons = await appendControl(control);

  buttons[1].click();
  expect(control.value).toBe('day');

  control.disabled = true;
  await control.updateComplete;
  buttons[0].click();
  expect(buttons[0].disabled).toBe(true);
  expect(control.value).toBe('day');
  control.remove();
});
