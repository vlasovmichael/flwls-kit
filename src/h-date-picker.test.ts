import { describe, expect, test } from 'vitest';
import { HDatePicker, dayKey, firstWeekday, monthGrid, parseDay } from './h-date-picker.ts';

describe('даты', () => {
  test('ключ дня в местном времени и обратно', () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
    expect(parseDay('2026-10-03T14:30')?.getDate()).toBe(3);
    expect(parseDay('2026-02-30')).toBeNull();
    expect(parseDay('')).toBeNull();
  });

  test('сетка — всегда 42 дня и начинается с первого дня недели', () => {
    const monday = monthGrid(2026, 9, 1);
    expect(monday).toHaveLength(42);
    expect(dayKey(monday[0])).toBe('2026-09-28');
    expect(monday[0].getDay()).toBe(1);

    const sunday = monthGrid(2026, 9, 7);
    expect(sunday[0].getDay()).toBe(0);
    expect(dayKey(sunday[0])).toBe('2026-09-27');
  });

  test('первый день недели по локали', () => {
    expect(firstWeekday('pl-PL')).toBe(1);
    expect(firstWeekday('not a locale')).toBe(1);
  });
});

async function appendPicker(props: Partial<HDatePicker> = {}) {
  const picker = Object.assign(new HDatePicker(), { locale: 'en-GB' }, props);
  document.body.append(picker);
  await picker.updateComplete;
  const root = picker.shadowRoot as ShadowRoot;
  return { picker, root, trigger: root.querySelector('.trigger') as HTMLButtonElement };
}

test('пустое поле показывает подсказку, заполненное — дату', async () => {
  const { picker, trigger } = await appendPicker();
  expect(trigger.textContent).toContain('Pick a date');

  picker.value = '2026-10-03';
  await picker.updateComplete;
  expect(trigger.textContent).toContain('3 Oct 2026');
  expect(trigger.getAttribute('aria-label')).toBe('Date: 3 October 2026');
  picker.remove();
});

test('клик по дню ставит значение, шлёт change и закрывает календарь', async () => {
  const { picker, root } = await appendPicker({ value: '2026-10-03' });
  const values: string[] = [];
  picker.addEventListener('change', (event) => {
    values.push((event as CustomEvent<{ value: string }>).detail.value);
  });

  picker.open = true;
  await picker.updateComplete;
  const cell = root.querySelector<HTMLElement>('td[data-day="2026-10-14"]');
  cell?.click();
  await picker.updateComplete;

  expect(values).toEqual(['2026-10-14']);
  expect(picker.open).toBe(false);
  picker.remove();
});

test('стрелки и PageDown двигают фокус, Enter выбирает', async () => {
  const { picker, root } = await appendPicker({ value: '2026-01-31' });
  picker.open = true;
  await picker.updateComplete;
  const grid = root.querySelector('table') as HTMLTableElement;
  const key = (name: string) => {
    grid.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }));
  };

  key('PageDown');
  await picker.updateComplete;
  expect(root.querySelector<HTMLElement>('td[tabindex="0"]')?.dataset.day).toBe('2026-02-28');

  key('ArrowRight');
  await picker.updateComplete;
  key('Enter');
  await picker.updateComplete;
  expect(picker.value).toBe('2026-03-01');
  picker.remove();
});

test('дни вне min и max выключены и не выбираются', async () => {
  const { picker, root } = await appendPicker({
    value: '2026-10-10',
    min: '2026-10-05',
    max: '2026-10-20',
  });
  picker.open = true;
  await picker.updateComplete;

  const early = root.querySelector<HTMLElement>('td[data-day="2026-10-03"]');
  expect(early?.getAttribute('aria-disabled')).toBe('true');
  early?.click();
  expect(picker.value).toBe('2026-10-10');
  picker.remove();
});

test('с временем значение несёт час, календарь не закрывается выбором дня', async () => {
  const { picker, root } = await appendPicker({ value: '2026-10-03T09:15', time: true });
  picker.open = true;
  await picker.updateComplete;

  root.querySelector<HTMLElement>('td[data-day="2026-10-05"]')?.click();
  await picker.updateComplete;
  expect(picker.value).toBe('2026-10-05T09:15');
  expect(picker.open).toBe(true);
  picker.remove();
});
