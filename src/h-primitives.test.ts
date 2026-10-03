import { afterEach, expect, test, vi } from 'vitest';
import { HCopyButton } from './h-copy-button.ts';
import { HDivider } from './h-divider.ts';
import { HKbd } from './h-kbd.ts';
import { HSearch } from './h-search.ts';

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

async function mount<T extends HTMLElement & { updateComplete: Promise<boolean> }>(el: T) {
  document.body.append(el);
  await el.updateComplete;
  return { el, root: el.shadowRoot as ShadowRoot };
}

test('разделитель — separator с ориентацией, подпись между линиями', async () => {
  const divider = new HDivider();
  divider.label = 'or';
  const { root } = await mount(divider);
  expect(divider.getAttribute('role')).toBe('separator');
  expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
  expect(root.querySelectorAll('.line')).toHaveLength(2);

  divider.orientation = 'vertical';
  await divider.updateComplete;
  expect(divider.getAttribute('aria-orientation')).toBe('vertical');
});

test('клавиша рендерится как kbd', async () => {
  const kbd = new HKbd();
  kbd.textContent = 'K';
  const { root } = await mount(kbd);
  expect(root.querySelector('kbd slot')).not.toBeNull();
});

test('кнопка копирования пишет значение в буфер и объявляет об этом', async () => {
  const writeText = vi.fn(() => Promise.resolve());
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  const button = new HCopyButton();
  button.value = '0xabc';
  const { root } = await mount(button);
  const copied = new Promise((resolve) => {
    button.addEventListener('copy', resolve, { once: true });
  });

  root.querySelector('button')?.click();
  await copied;
  await button.updateComplete;

  expect(writeText).toHaveBeenCalledWith('0xabc');
  expect(root.querySelector('[role="status"]')?.textContent).toBe('Copied');
  expect(root.querySelector('h-icon')?.getAttribute('name')).toBe('check');
});

test('поиск отдаёт значение, Escape и крестик очищают', async () => {
  const search = new HSearch();
  const { root } = await mount(search);
  const values: string[] = [];
  search.addEventListener('input', () => {
    values.push(search.value);
  });
  const input = root.querySelector('input') as HTMLInputElement;

  expect(input.getAttribute('aria-label')).toBe('Search');
  expect(root.querySelector('.clear')).toBeNull();

  input.value = 'btc';
  input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  await search.updateComplete;
  expect(search.value).toBe('btc');

  root.querySelector<HTMLButtonElement>('.clear')?.click();
  await search.updateComplete;
  expect(search.value).toBe('');

  search.value = 'eth';
  await search.updateComplete;
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await search.updateComplete;

  expect(values).toEqual(['btc', '', '']);
  expect(search.value).toBe('');
});
