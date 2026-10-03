import { expect, test } from 'vitest';
import { HSelect } from './h-select.ts';

test('список сообщает выбранное значение', async () => {
  const select = document.createElement('h-select') as HSelect;
  select.options = [
    { label: 'Первый', value: 'one' },
    { label: 'Второй', value: 'two' },
  ];
  document.body.append(select);
  await select.updateComplete;

  const changed = new Promise<CustomEvent<{ value: string }>>((resolve) => {
    select.addEventListener(
      'change',
      (event) => {
        resolve(event as CustomEvent<{ value: string }>);
      },
      { once: true },
    );
  });
  const button = select.querySelector('.select-button') as HTMLButtonElement;
  button.click();
  const option = select.querySelectorAll('.select-option')[1] as HTMLLIElement;
  option.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  expect((await changed).detail.value).toBe('two');
  select.remove();
});

test('селект связывает кнопку со списком и отключается', async () => {
  const select = document.createElement('h-select') as HSelect;
  select.options = [{ label: 'Первый', value: 'one' }];
  select.disabled = true;
  document.body.append(select);
  await select.updateComplete;

  const button = select.querySelector('.select-button') as HTMLButtonElement;
  const list = select.querySelector('.select-list') as HTMLElement;

  expect(button.disabled).toBe(true);
  expect(button.getAttribute('aria-controls')).toBe(list.id);
  button.click();
  expect(select.dataset.open).not.toBe('true');
  select.remove();
});

test('у нижнего края список разворачивается вверх', async () => {
  const select = document.createElement('h-select') as HSelect;
  select.options = [{ label: 'Первый', value: 'one' }];
  document.body.append(select);
  await select.updateComplete;

  const list = select.querySelector('.select-list') as HTMLElement;
  list.getBoundingClientRect = () => ({ bottom: window.innerHeight, left: 100 }) as DOMRect;
  (select.querySelector('.select-button') as HTMLButtonElement).click();
  await select.updateComplete;
  await Promise.resolve();

  expect([select.dataset.open, select.classList.contains('is-up')]).toEqual(['true', true]);
  select.remove();
});
