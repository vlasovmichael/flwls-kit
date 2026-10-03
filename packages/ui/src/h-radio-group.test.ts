import { expect, test, vi } from 'vitest';
import {
  HRadioGroup,
  type RadioGroupOption,
  type RadioGroupSize,
} from './h-radio-group.ts';

const options: RadioGroupOption[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

async function appendGroup(group: HRadioGroup) {
  document.body.append(group);
  await group.updateComplete;
  return group.shadowRoot?.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
}

test.each<RadioGroupSize>(['sm', 'md', 'lg'])(
  'группа отражает размер %s',
  async (size) => {
    const group = new HRadioGroup();
    group.options = options;
    group.size = size;
    await appendGroup(group);

    expect(group.getAttribute('size')).toBe(size);
    group.remove();
  },
);

test('группа связывает label, описание и ошибку', async () => {
  const group = new HRadioGroup();
  group.options = options;
  group.label = 'Frequency';
  group.description = 'How often to send a report.';
  group.error = 'Choose one.';
  await appendGroup(group);
  const radios = group.shadowRoot?.querySelector('[role="radiogroup"]') as HTMLElement;

  expect(radios.getAttribute('aria-label')).toBe('Frequency');
  expect(radios.getAttribute('aria-invalid')).toBe('true');
  expect(radios.getAttribute('aria-describedby')).toContain('-error');
  group.remove();
});

test('клик меняет значение и отправляет composed change', async () => {
  const group = new HRadioGroup();
  group.options = options;
  group.value = 'daily';
  const changed = vi.fn();
  group.addEventListener('change', changed);
  const radios = await appendGroup(group);

  radios[1].click();

  expect(group.value).toBe('weekly');
  expect(changed).toHaveBeenCalledWith(
    expect.objectContaining({ detail: { value: 'weekly', option: options[1] } }),
  );
  group.remove();
});

test('стрелки выбирают следующее радио', async () => {
  const group = new HRadioGroup();
  group.options = options;
  group.value = 'daily';
  const radios = await appendGroup(group);

  radios[0].focus();
  radios[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
  await group.updateComplete;

  expect(group.value).toBe('weekly');
  expect(group.shadowRoot?.activeElement).toBe(radios[1]);
  group.remove();
});

test('Home и End пропускают отключённые варианты', async () => {
  const group = new HRadioGroup();
  group.options = [
    options[0],
    { label: 'Weekly', value: 'weekly', disabled: true },
    options[2],
  ];
  group.value = 'monthly';
  const radios = await appendGroup(group);

  radios[2].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Home' }));
  await group.updateComplete;
  expect(group.value).toBe('daily');

  radios[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'End' }));
  await group.updateComplete;
  expect(group.value).toBe('monthly');
  group.remove();
});

test('disabled группа не меняет выбранный вариант', async () => {
  const group = new HRadioGroup();
  group.options = options;
  group.value = 'daily';
  group.disabled = true;
  const radios = await appendGroup(group);

  radios[1].click();

  expect(radios[1].disabled).toBe(true);
  expect(group.value).toBe('daily');
  group.remove();
});

test('сброс формы возвращает radio group', async () => {
  const form = document.createElement('form');
  const group = new HRadioGroup();
  group.options = options;
  group.value = 'weekly';
  form.append(group);
  document.body.append(form);
  await group.updateComplete;

  group.value = 'monthly';
  group.formResetCallback();
  await group.updateComplete;

  expect(group.value).toBe('weekly');
  form.remove();
});
