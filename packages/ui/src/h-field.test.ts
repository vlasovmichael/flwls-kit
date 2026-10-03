import { expect, test, vi } from 'vitest';
import { HField, HTextarea } from './h-field.ts';

async function appendField(field: HField) {
  document.body.append(field);
  await field.updateComplete;
  return field;
}

test('поле передаёт введённое значение и событие input', async () => {
  const field = await appendField(new HField());
  const input = field.shadowRoot?.querySelector('input') as HTMLInputElement;
  const inputEvent = vi.fn();
  field.addEventListener('input', inputEvent);

  input.value = 'Atlas';
  input.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));

  expect(field.value).toBe('Atlas');
  expect(inputEvent).toHaveBeenCalledOnce();
  field.remove();
});

test('поле передаёт composed change', async () => {
  const field = await appendField(new HField());
  const input = field.shadowRoot?.querySelector('input') as HTMLInputElement;
  const change = vi.fn();
  field.addEventListener('change', change);

  input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

  expect(change).toHaveBeenCalledOnce();
  field.remove();
});

test('поле связывает описание и ошибку с контролом', async () => {
  const field = new HField();
  field.description = 'Helpful context';
  field.error = 'Required';
  await appendField(field);
  const input = field.shadowRoot?.querySelector('input') as HTMLInputElement;

  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(input.getAttribute('aria-describedby')).toContain('-error');
  field.remove();
});

test('поле отражает состояние нативного контрола', async () => {
  const field = new HField();
  field.disabled = true;
  field.readonly = true;
  field.required = true;
  await appendField(field);
  const input = field.shadowRoot?.querySelector('input') as HTMLInputElement;

  expect(input.disabled).toBe(true);
  expect(input.readOnly).toBe(true);
  expect(input.required).toBe(true);
  field.remove();
});

test('textarea использует нативный многострочный контрол', async () => {
  const field = new HTextarea();
  await appendField(field);
  const textarea = field.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

  textarea.value = 'Line one\nLine two';
  textarea.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true }));

  expect(field.value).toBe('Line one\nLine two');
  field.remove();
});
