import { expect, test, vi } from 'vitest';
import { HToastStack } from './h-toast-stack.ts';
import type { HToast } from './h-toast.ts';

test('стек показывает следующую запись после закрытия', async () => {
  const stack = new HToastStack();
  stack.maxVisible = 1;
  document.body.append(stack);
  stack.show({ message: 'First', duration: 0 });
  stack.show({ message: 'Second', duration: 0 });
  await stack.updateComplete;
  expect(stack.shadowRoot?.querySelectorAll('h-toast')).toHaveLength(1);
  stack.dismiss('toast-1');
  await stack.updateComplete;
  const toast = stack.shadowRoot?.querySelector('h-toast') as HToast;
  expect(toast.message).toBe('Second');
  stack.remove();
});

test('стек сообщает идентификатор и причину', () => {
  const stack = new HToastStack();
  const dismissed = vi.fn();
  stack.addEventListener('dismiss', dismissed);
  const id = stack.show({ message: 'Saved', duration: 0 });
  stack.dismiss(id, 'action');
  expect(dismissed).toHaveBeenCalledWith(
    expect.objectContaining({ detail: { id, reason: 'action' } }),
  );
});
