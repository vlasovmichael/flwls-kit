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
