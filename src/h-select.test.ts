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

  const changed = new Promise<CustomEvent<string>>((resolve) => {
    select.addEventListener(
      'change',
      (event) => {
        resolve(event as CustomEvent<string>);
      },
      { once: true },
    );
  });
  const button = select.querySelector('.select-button') as HTMLButtonElement;
  button.click();
  const option = select.querySelectorAll('.select-option')[1] as HTMLLIElement;
  option.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  expect((await changed).detail).toBe('two');
  select.remove();
});
