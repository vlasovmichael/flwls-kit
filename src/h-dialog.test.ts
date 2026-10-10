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

test('полноэкранное окно сохраняет шапку и прокручивает тело', async () => {
  const dialog = document.createElement('h-dialog') as HDialog;
  dialog.size = 'full';
  dialog.description = 'Длинное содержимое окна';
  dialog.open = true;
  document.body.append(dialog);
  await dialog.updateComplete;

  const root = dialog.shadowRoot as ShadowRoot;
  const header = root.querySelector('header') as HTMLElement;
  const body = root.querySelector('.body') as HTMLElement;
  const styles = HDialog.styles as unknown as { cssText: string };
  expect(dialog.getAttribute('size')).toBe('full');
  expect(header).toBeTruthy();
  expect(body).toBeTruthy();
  expect(styles.cssText).toContain("width: 100dvw");
  expect(styles.cssText).toContain("height: 100dvh");
  expect(styles.cssText).toContain("border-radius: 0");
  expect(styles.cssText).toContain("position: sticky");
  expect(styles.cssText).toContain("overflow: auto");
  dialog.remove();
});

test('открытое окно запрещает прокрутку страницы под собой', async () => {
  const dialog = document.createElement('h-dialog') as HDialog;
  dialog.open = true;
  document.body.append(dialog);
  await dialog.updateComplete;
  const rules = document.adoptedStyleSheets
    .flatMap((sheet) => [...sheet.cssRules].map((rule) => rule.cssText));
  const lock = rules.some((rule) => rule.includes('is-modal-open')
    && rule.includes('overflow: hidden'));
  expect(lock).toBe(true);
  expect(document.body.classList.contains('is-modal-open')).toBe(true);
  dialog.remove();
  expect(document.body.classList.contains('is-modal-open')).toBe(false);
});
