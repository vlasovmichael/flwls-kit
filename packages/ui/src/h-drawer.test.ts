import { expect, test } from 'vitest';
import { HDrawer, hiddenFrame, shownFrame } from './h-drawer.ts';

async function appendDrawer() {
  const drawer = new HDrawer();
  drawer.heading = 'Filters';
  drawer.textContent = 'Body';
  document.body.append(drawer);
  await drawer.updateComplete;
  return { drawer, dialog: drawer.shadowRoot?.querySelector('dialog') as HTMLDialogElement };
}

test('панель подписана заголовком и по умолчанию выезжает справа', async () => {
  const { drawer, dialog } = await appendDrawer();

  const heading = drawer.shadowRoot?.getElementById(dialog.getAttribute('aria-labelledby') ?? '');
  expect(heading?.textContent.trim()).toBe('Filters');
  expect(drawer.getAttribute('placement')).toBe('end');
  expect(drawer.shadowRoot?.querySelector('.close')?.getAttribute('aria-label')).toBe('Close');
  drawer.remove();
});

test('подвал без кнопок не занимает места', async () => {
  const { drawer } = await appendDrawer();
  const footer = drawer.shadowRoot?.querySelector('footer');
  expect(footer?.classList.contains('is-empty')).toBe(true);

  const action = document.createElement('button');
  action.slot = 'footer';
  drawer.append(action);
  await new Promise((resolve) => setTimeout(resolve));
  await drawer.updateComplete;
  expect(footer?.classList.contains('is-empty')).toBe(false);
  drawer.remove();
});

test('hide() на закрытой панели ничего не шлёт', async () => {
  const { drawer } = await appendDrawer();
  let closed = 0;
  drawer.addEventListener('close', () => (closed += 1));
  drawer.hide();
  await drawer.updateComplete;
  expect(closed).toBe(0);
  drawer.remove();
});

test('по центру окно появляется снизу и из прозрачности, сбоку — из-за края', () => {
  expect(hiddenFrame('center', false)).toEqual({
    transform: 'translateY(12px) scale(0.98)',
    opacity: 0,
  });
  expect(shownFrame('center')).toEqual({ transform: 'none', opacity: 1 });
  expect(hiddenFrame('end', false)).toEqual({ transform: 'translateX(100%)' });
  expect(hiddenFrame('end', true)).toEqual({ transform: 'translateX(-100%)' });
  expect(shownFrame('end')).toEqual({ transform: 'none' });
});

test('placement и size отражаются в атрибутах для стилей', async () => {
  const { drawer } = await appendDrawer();
  drawer.placement = 'center';
  drawer.size = 'full';
  await drawer.updateComplete;
  expect(drawer.getAttribute('placement')).toBe('center');
  expect(drawer.getAttribute('size')).toBe('full');
  drawer.remove();
});
