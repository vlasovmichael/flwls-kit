import { expect, test, vi } from 'vitest';
import { HCheckbox, HSwitch, type CheckControlSize } from './h-checkbox.ts';

async function appendControl(control: HCheckbox | HSwitch) {
  document.body.append(control);
  await control.updateComplete;
  return control.shadowRoot?.querySelector('input') as HTMLInputElement;
}

test.each<CheckControlSize>(['sm', 'md', 'lg'])(
  'чекбокс отражает размер %s',
  async (size) => {
    const checkbox = new HCheckbox();
    checkbox.size = size;
    await appendControl(checkbox);

    expect(checkbox.getAttribute('size')).toBe(size);
    checkbox.remove();
  },
);

test('чекбокс отражает состояния', async () => {
  const checkbox = new HCheckbox();
  checkbox.checked = true;
  checkbox.required = true;
  checkbox.disabled = true;
  const input = await appendControl(checkbox);

  expect(input.checked).toBe(true);
  expect(input.required).toBe(true);
  expect(input.disabled).toBe(true);
  checkbox.remove();
});

test('чекбокс передаёт composed change на хост', async () => {
  const checkbox = new HCheckbox();
  const changed = vi.fn();
  checkbox.addEventListener('change', changed);
  const input = await appendControl(checkbox);

  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true }));

  expect(checkbox.checked).toBe(true);
  expect(changed).toHaveBeenCalledTimes(1);
  checkbox.remove();
});

test('чекбокс снимает indeterminate после действия', async () => {
  const checkbox = new HCheckbox();
  checkbox.indeterminate = true;
  const input = await appendControl(checkbox);

  expect(input.indeterminate).toBe(true);
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  await checkbox.updateComplete;

  expect(checkbox.indeterminate).toBe(false);
  expect(input.indeterminate).toBe(false);
  checkbox.remove();
});

test('чекбокс связывает ошибку с контролом', async () => {
  const checkbox = new HCheckbox();
  checkbox.description = 'Helpful context';
  checkbox.error = 'Required';
  const input = await appendControl(checkbox);

  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(input.getAttribute('aria-describedby')).toContain('-error');
  checkbox.remove();
});

test('switch использует role=switch и меняет состояние', async () => {
  const control = new HSwitch();
  const changed = vi.fn();
  control.addEventListener('change', changed);
  const input = await appendControl(control);

  expect(input.getAttribute('role')).toBe('switch');
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true }));

  expect(control.checked).toBe(true);
  expect(changed).toHaveBeenCalledTimes(1);
  control.remove();
});

test('сброс формы возвращает checkbox', async () => {
  const form = document.createElement('form');
  const checkbox = new HCheckbox();
  checkbox.checked = true;
  form.append(checkbox);
  document.body.append(form);
  await checkbox.updateComplete;

  checkbox.checked = false;
  checkbox.formResetCallback();
  await checkbox.updateComplete;

  expect(checkbox.checked).toBe(true);
  form.remove();
});
