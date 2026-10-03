import { expect, test, vi } from 'vitest';
import { HDropdownMenu, type DropdownMenuItem } from './h-dropdown-menu.ts';

const ITEMS: DropdownMenuItem[] = [
  { label: 'Edit', value: 'edit', icon: 'pencil' },
  { label: 'Duplicate', value: 'duplicate', disabled: true },
  { label: 'Export', value: 'export' },
  { label: 'Delete', value: 'delete', danger: true, divider: true },
];

async function appendMenu() {
  const menu = new HDropdownMenu();
  menu.items = ITEMS;
  menu.label = 'Row actions';
  document.body.append(menu);
  await menu.updateComplete;
  const root = menu.shadowRoot as ShadowRoot;
  return {
    menu,
    root,
    trigger: root.querySelector('.trigger') as HTMLButtonElement,
    list: root.querySelector('.menu') as HTMLUListElement,
    items: [...root.querySelectorAll<HTMLButtonElement>('.item')],
  };
}

const key = (target: Element, name: string) => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, composed: true }));
};

test('кнопка связана с меню, пункты вне порядка Tab', async () => {
  const { menu, trigger, list, items } = await appendMenu();

  expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
  expect(trigger.getAttribute('aria-controls')).toBe(list.id);
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(list.hidden).toBe(true);
  expect(items.every((item) => item.tabIndex === -1)).toBe(true);
  expect(list.querySelector('[role="separator"]')).not.toBeNull();
  menu.remove();
});

test('стрелка вниз открывает меню и ходит по пунктам, пропуская выключенный', async () => {
  const { menu, root, trigger, list, items } = await appendMenu();

  key(trigger, 'ArrowDown');
  await menu.updateComplete;
  expect(menu.open).toBe(true);
  expect(list.hidden).toBe(false);
  expect(root.activeElement).toBe(items[0]);

  key(list, 'ArrowDown');
  expect(root.activeElement).toBe(items[2]);
  key(list, 'End');
  expect(root.activeElement).toBe(items[3]);
  key(list, 'ArrowDown');
  expect(root.activeElement).toBe(items[0]);
  key(list, 'e');
  expect(root.activeElement).toBe(items[2]);
  menu.remove();
});

test('выбор пункта сообщает значение, закрывает меню и возвращает фокус на кнопку', async () => {
  const { menu, root, trigger, items } = await appendMenu();
  const onSelect = vi.fn();
  const onClose = vi.fn();
  menu.addEventListener('select', (event) => {
    onSelect((event as CustomEvent<{ value: string }>).detail.value);
  });
  menu.addEventListener('close', (event) => {
    onClose((event as CustomEvent<{ reason: string }>).detail.reason);
  });

  key(trigger, 'ArrowDown');
  await menu.updateComplete;
  items[2].click();
  await menu.updateComplete;

  expect(onSelect).toHaveBeenCalledWith('export');
  expect(onClose).toHaveBeenCalledWith('select');
  expect(menu.open).toBe(false);
  expect(root.activeElement).toBe(trigger);
  menu.remove();
});

test('Escape и клик снаружи закрывают меню с причиной', async () => {
  const { menu, trigger, list } = await appendMenu();
  const reasons: string[] = [];
  menu.addEventListener('close', (event) => {
    reasons.push((event as CustomEvent<{ reason: string }>).detail.reason);
  });

  trigger.click();
  await menu.updateComplete;
  key(list, 'Escape');
  await menu.updateComplete;

  trigger.click();
  await menu.updateComplete;
  document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  await menu.updateComplete;

  expect(reasons).toEqual(['escape', 'outside']);
  await vi.waitFor(() => {
    expect(list.hidden).toBe(true);
  });
  menu.remove();
});

test('выключенное меню не открывается', async () => {
  const { menu, trigger } = await appendMenu();
  menu.disabled = true;
  await menu.updateComplete;

  trigger.click();
  key(trigger, 'ArrowDown');
  await menu.updateComplete;
  expect(menu.open).toBe(false);
  menu.remove();
});

test('меню из одной иконки подписано для скринридера', async () => {
  const { menu, trigger } = await appendMenu();
  menu.iconOnly = true;
  await menu.updateComplete;

  expect(trigger.getAttribute('aria-label')).toBe('Row actions');
  expect(trigger.querySelector('h-icon')?.getAttribute('name')).toBe('ellipsis');
  menu.remove();
});
