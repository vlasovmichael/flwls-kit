import { expect, test, vi } from 'vitest';
import { HTag } from './h-tag.ts';
import type { BadgeTone } from './h-badge.ts';

async function appendTag(tag: HTag) {
  document.body.append(tag);
  await tag.updateComplete;
  return tag;
}

test.each<BadgeTone>(['neutral', 'info', 'success', 'warning', 'error'])(
  'тег отражает тон %s',
  async (tone) => {
    const tag = new HTag();
    tag.tone = tone;
    await appendTag(tag);

    expect(tag.getAttribute('tone')).toBe(tone);
    tag.remove();
  },
);

test('тег показывает запасную метку', async () => {
  const tag = new HTag();
  tag.label = 'BTC';
  await appendTag(tag);

  expect(tag.shadowRoot?.querySelector('.content')?.textContent).toContain('BTC');
  tag.remove();
});

test('съёмный тег отправляет remove при нажатии', async () => {
  const tag = new HTag();
  tag.label = 'BTC';
  tag.removable = true;
  const remove = vi.fn();
  tag.addEventListener('remove', remove);
  await appendTag(tag);
  const button = tag.shadowRoot?.querySelector('button') as HTMLButtonElement;

  button.click();

  expect(remove).toHaveBeenCalledTimes(1);
  expect(button.getAttribute('aria-label')).toBe('Remove BTC');
  tag.remove();
});

test('Enter и пробел удаляют тег нативной кнопкой', async () => {
  const tag = new HTag();
  tag.removable = true;
  const remove = vi.fn();
  tag.addEventListener('remove', remove);
  await appendTag(tag);
  const button = tag.shadowRoot?.querySelector('button') as HTMLButtonElement;

  button.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
  button.click();
  button.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: ' ' }));
  button.click();

  expect(remove).toHaveBeenCalledTimes(2);
  tag.remove();
});

test('несъёмный тег не показывает удаление', async () => {
  const tag = new HTag();
  await appendTag(tag);

  expect(tag.shadowRoot?.querySelector('button')).toBeNull();
  tag.remove();
});
