import { expect, test } from 'vitest';
import { HDialog } from './h-dialog.ts';

test('окно отдаёт подтверждение событием', async () => {
  const dialog = document.createElement('h-dialog') as HDialog;
  dialog.open = true;
  document.body.append(dialog);
  await dialog.updateComplete;
  const confirmed = new Promise<void>((resolve) => { dialog.addEventListener('confirm', () => { resolve(); }); });
  (dialog.shadowRoot?.querySelector('.confirm') as HTMLButtonElement).click();
  await confirmed;
  dialog.remove();
  expect(true).toBe(true);
});

test('Tab с последней кнопки ведёт на первую, Shift+Tab — обратно', async () => {
  const dialog = document.createElement('h-dialog') as HDialog;
  dialog.title = 'Trap';
  dialog.open = true;
  document.body.append(dialog);
  await dialog.updateComplete;
  const root = dialog.shadowRoot;
  const buttons = [...(root?.querySelectorAll<HTMLButtonElement>('section button') ?? [])];
  const first = buttons[0];
  const last = buttons[buttons.length - 1];

  last.focus();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
  expect(dialog.shadowRoot?.activeElement).toBe(first);

  const shiftTab = { key: 'Tab', shiftKey: true, bubbles: true };
  document.dispatchEvent(new KeyboardEvent('keydown', shiftTab));
  expect(dialog.shadowRoot?.activeElement).toBe(last);
  dialog.remove();
});
