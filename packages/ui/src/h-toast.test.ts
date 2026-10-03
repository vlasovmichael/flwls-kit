import { expect, test } from 'vitest';
import { HToast } from './h-toast.ts';

test('уведомление сообщает о закрытии', async () => {
  const toast = document.createElement('h-toast') as HToast;
  toast.message = 'Запись сохранена';
  document.body.append(toast);
  await toast.updateComplete;

  const dismissed = new Promise<void>((resolve) => {
    toast.addEventListener('dismiss', () => {
      resolve();
    });
  });
  (toast.shadowRoot?.querySelector('.toast') as HTMLElement).click();
  await dismissed;

  expect(toast.open).toBe(false);
  toast.remove();
});
