import { expect, test } from 'vitest';
import { HStat } from './h-stat.ts';

test('плитка отражает атрибуты в теневом дереве', async () => {
  const stat = document.createElement('h-stat') as HStat;
  stat.label = 'Шаги';
  stat.value = '7000';
  stat.note = 'за сегодня';
  document.body.append(stat);
  await stat.updateComplete;
  expect(stat.shadowRoot?.querySelector('.value')?.textContent).toBe('7000');
  stat.remove();
});
