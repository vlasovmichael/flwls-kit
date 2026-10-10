import { expect, test } from 'vitest';
import { HStat, changedDigits, numericValue } from './h-stat.ts';

test('плитка отражает атрибуты в теневом дереве', async () => {
  const stat = document.createElement('h-stat') as HStat;
  stat.label = 'Шаги';
  stat.value = '7000';
  stat.note = 'за сегодня';
  document.body.append(stat);
  await stat.updateComplete;
  expect(stat.shadowRoot?.querySelector('.value')?.textContent).toBe('7000');
  expect(stat.shadowRoot?.querySelector('.value')?.getAttribute('aria-label')).toBe('7000');
  stat.remove();
});

test('новое значение перерисовывает цифры', async () => {
  const stat = document.createElement('h-stat') as HStat;
  stat.value = '1,204';
  document.body.append(stat);
  await stat.updateComplete;
  stat.value = '1,210';
  await stat.updateComplete;
  expect(stat.shadowRoot?.querySelector('.value')?.textContent).toBe('1,210');
  stat.remove();
});

test('сменившиеся разряды считаются справа', () => {
  expect(changedDigits('1,204', '1,210')).toEqual([3, 4]);
  expect(changedDigits('999', '1,000')).toEqual([0, 2, 3, 4]);
  expect(changedDigits('42', '42')).toEqual([]);
});

test('число читается из отформатированной строки', () => {
  expect(numericValue('$1,204.5')).toBe(1204.5);
  expect(numericValue('−3.1%')).toBe(-3.1);
  expect(numericValue('—')).toBeNull();
});
