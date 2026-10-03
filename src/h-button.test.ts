import { expect, test, vi } from 'vitest';
import { HButton, HIconButton, type ButtonVariant } from './h-button.ts';

async function appendButton(button: HButton) {
  document.body.append(button);
  await button.updateComplete;
  return button.shadowRoot?.querySelector('button') as HTMLButtonElement;
}

test.each<ButtonVariant>([
  'neutral',
  'primary',
  'danger',
  'ghost',
  'positive',
  'negative',
])('кнопка отражает вариант %s', async (variant) => {
  const button = new HButton();
  button.variant = variant;
  await appendButton(button);

  expect(button.getAttribute('variant')).toBe(variant);
  button.remove();
});

test('отключенная кнопка не передаёт клик хосту', async () => {
  const button = new HButton();
  button.disabled = true;
  const click = vi.fn();
  button.addEventListener('click', click);
  const nativeButton = await appendButton(button);

  nativeButton.click();

  expect(nativeButton.disabled).toBe(true);
  expect(click).not.toHaveBeenCalled();
  button.remove();
});

test('загрузка блокирует клик и объявляет занятость', async () => {
  const button = new HButton();
  button.loading = true;
  const click = vi.fn();
  button.addEventListener('click', click);
  const nativeButton = await appendButton(button);

  nativeButton.click();

  expect(nativeButton.disabled).toBe(true);
  expect(nativeButton.getAttribute('aria-busy')).toBe('true');
  expect(click).not.toHaveBeenCalled();
  button.remove();
});

test('клик из тени доходит до хоста', async () => {
  const button = new HButton();
  const click = vi.fn();
  button.addEventListener('click', click);
  const nativeButton = await appendButton(button);

  nativeButton.click();

  expect(click).toHaveBeenCalledTimes(1);
  button.remove();
});

test('Enter и пробел активируют нативную кнопку', async () => {
  const button = new HButton();
  const click = vi.fn();
  button.addEventListener('click', click);
  const nativeButton = await appendButton(button);

  nativeButton.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
  nativeButton.click();
  nativeButton.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: ' ' }));
  nativeButton.click();

  expect(click).toHaveBeenCalledTimes(2);
  button.remove();
});

test('submit отправляет ближайшую внешнюю форму', async () => {
  const form = document.createElement('form');
  const button = new HButton();
  button.type = 'submit';
  const submit = vi.fn((event: SubmitEvent) => {
    event.preventDefault();
  });
  form.addEventListener('submit', submit);
  form.append(button);
  document.body.append(form);
  await button.updateComplete;

  (button.shadowRoot?.querySelector('button') as HTMLButtonElement).click();

  expect(submit).toHaveBeenCalledTimes(1);
  form.remove();
});

test('reset сбрасывает ближайшую внешнюю форму', async () => {
  const form = document.createElement('form');
  const input = document.createElement('input');
  input.defaultValue = 'Initial';
  input.value = 'Changed';
  const button = new HButton();
  button.type = 'reset';
  form.append(input, button);
  document.body.append(form);
  await button.updateComplete;

  (button.shadowRoot?.querySelector('button') as HTMLButtonElement).click();

  expect(input.value).toBe('Initial');
  form.remove();
});

test('иконка-кнопка передаёт обязательную метку', async () => {
  const button = new HIconButton();
  button.label = 'Close dialog';
  const nativeButton = await appendButton(button);

  expect(nativeButton.getAttribute('aria-label')).toBe('Close dialog');
  button.remove();
});
