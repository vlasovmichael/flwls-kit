import { expect, test, vi } from 'vitest';
import { HAlert, type AlertTone } from './h-alert.ts';

async function appendAlert(options: {
  dismissible?: boolean;
  title?: string;
  tone?: AlertTone;
} = {}) {
  const alert = new HAlert();
  alert.dismissible = options.dismissible ?? false;
  alert.title = options.title ?? '';
  alert.tone = options.tone ?? 'info';
  alert.textContent = 'Your changes are saved.';
  document.body.append(alert);
  await alert.updateComplete;
  return alert;
}

test.each<AlertTone>(['info', 'success', 'warning', 'error'])(
  'баннер отражает тон %s и назначает правильную роль',
  async (tone) => {
    const alert = await appendAlert({ tone });
    const region = alert.shadowRoot?.querySelector('.alert') as HTMLElement;
    const role = tone === 'warning' || tone === 'error' ? 'alert' : 'status';

    expect(alert.getAttribute('tone')).toBe(tone);
    expect(region.getAttribute('role')).toBe(role);
    alert.remove();
  },
);

test('заголовок и содержимое попадают в баннер', async () => {
  const alert = await appendAlert({ title: 'Changes saved' });
  const root = alert.shadowRoot as ShadowRoot;

  expect(root.querySelector('h2')?.textContent).toBe('Changes saved');
  const message = root.querySelector('slot:not([name])') as HTMLSlotElement;

  expect(message.assignedNodes()).toHaveLength(1);
  const action = root.querySelector('.action') as HTMLElement;

  expect(action.hidden).toBe(true);
  alert.remove();
});

test('слот action передаёт следующее действие', async () => {
  const alert = await appendAlert();
  const action = document.createElement('button');
  action.slot = 'action';
  action.textContent = 'Review changes';
  alert.append(action);
  await alert.updateComplete;
  await alert.updateComplete;
  const slot = alert.shadowRoot?.querySelector('slot[name="action"]') as HTMLSlotElement;

  expect(slot.assignedElements()).toEqual([action]);
  const actionArea = alert.shadowRoot?.querySelector('.action') as HTMLElement;

  expect(actionArea.hidden).toBe(false);
  alert.remove();
});

test(
  'кнопка закрытия скрывает баннер и отправляет dismiss',
  async () => {
    const alert = await appendAlert({ dismissible: true });
    const dismissed = vi.fn();
    const parent = document.createElement('div');
    parent.addEventListener('dismiss', dismissed);
    parent.append(alert);
    document.body.append(parent);
    const close = alert.shadowRoot?.querySelector('.close') as HTMLButtonElement;

    close.click();

    expect(close.getAttribute('aria-label')).toBe('Dismiss alert');
    expect(alert.hidden).toBe(true);
    expect(dismissed).toHaveBeenCalledTimes(1);
    parent.remove();
  },
);

test('без dismissible кнопка закрытия не выводится', async () => {
  const alert = await appendAlert({ dismissible: false });

  expect(alert.shadowRoot?.querySelector('.close')).toBeNull();
  alert.remove();
});
