import { expect, test, vi } from 'vitest';
import { HToast } from './h-toast.ts';

async function appendToast(toast: HToast) {
  document.body.append(toast);
  await toast.updateComplete;
}

test.each(['info', 'success', 'warning', 'error', 'ok', 'bad'] as const)(
  'уведомление отражает тон %s',
  async (tone) => {
    const toast = new HToast();
    toast.tone = tone;
    await appendToast(toast);
    expect(toast.getAttribute('tone')).toBe(tone);
    toast.remove();
  },
);

test('кнопка закрытия сообщает причину и доступна с клавиатуры', async () => {
  const toast = new HToast();
  toast.open = true;
  toast.duration = 0;
  const dismissed = vi.fn();
  toast.addEventListener('dismiss', dismissed);
  await appendToast(toast);
  const close = toast.shadowRoot?.querySelector('.close') as HTMLButtonElement;
  close.click();
  expect(close.getAttribute('aria-label')).toBe('Close notification');
  // Событие приходит после анимации ухода.
  await vi.waitFor(() => {
    expect(dismissed).toHaveBeenCalled();
  });
  expect(dismissed).toHaveBeenCalledWith(
    expect.objectContaining({ detail: { reason: 'close' } }),
  );
  toast.remove();
});

test('таймер закрывает открытое уведомление', async () => {
  vi.useFakeTimers();
  const toast = new HToast();
  toast.open = true;
  toast.duration = 100;
  const dismissed = vi.fn();
  toast.addEventListener('dismiss', dismissed);
  await appendToast(toast);
  // Таймер показа плюс анимация ухода.
  await vi.advanceTimersByTimeAsync(100 + 300);
  expect(dismissed).toHaveBeenCalledWith(
    expect.objectContaining({ detail: { reason: 'timeout' } }),
  );
  toast.remove();
  vi.useRealTimers();
});

test('под курсором таймер стоит, после ухода курсора идёт заново', async () => {
  vi.useFakeTimers();
  const toast = new HToast();
  toast.open = true;
  toast.duration = 100;
  const dismissed = vi.fn();
  toast.addEventListener('dismiss', dismissed);
  await appendToast(toast);
  toast.dispatchEvent(new Event('pointerenter'));
  await vi.advanceTimersByTimeAsync(1000);
  expect(dismissed).not.toHaveBeenCalled();
  toast.dispatchEvent(new Event('pointerleave'));
  await vi.advanceTimersByTimeAsync(100 + 300);
  expect(dismissed).toHaveBeenCalled();
  toast.remove();
  vi.useRealTimers();
});

test('ошибку диктор читает сразу: role=alert', async () => {
  const toast = new HToast();
  toast.open = true;
  toast.tone = 'error';
  await appendToast(toast);
  expect(toast.shadowRoot?.querySelector('.toast')?.getAttribute('role')).toBe('alert');
  toast.remove();
});
