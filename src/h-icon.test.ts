import { expect, test } from 'vitest';
import { HIcon, ICON_NAMES, type IconName, type IconSize } from './h-icon.ts';

async function appendIcon(icon: HIcon) {
  document.body.append(icon);
  await icon.updateComplete;
  return icon;
}

test.each<IconName>(ICON_NAMES)('иконка выводит зарегистрированное имя %s', async (name) => {
  const icon = new HIcon();
  icon.name = name;
  await appendIcon(icon);

  expect(icon.getAttribute('name')).toBe(name);
  expect(icon.shadowRoot?.querySelector('svg')).not.toBeNull();
  icon.remove();
});

test.each<IconSize>(['sm', 'md', 'lg'])('иконка отражает размер %s', async (size) => {
  const icon = new HIcon();
  icon.size = size;
  await appendIcon(icon);

  expect(icon.getAttribute('size')).toBe(size);
  icon.remove();
});

test('иконка без метки скрыта от вспомогательных технологий', async () => {
  const icon = new HIcon();
  await appendIcon(icon);
  const svg = icon.shadowRoot?.querySelector('svg') as SVGElement;

  expect(svg.getAttribute('aria-hidden')).toBe('true');
  expect(svg.getAttribute('role')).toBeNull();
  icon.remove();
});

test('иконка с меткой получает роль и доступное имя', async () => {
  const icon = new HIcon();
  icon.label = 'Delete position';
  await appendIcon(icon);
  const svg = icon.shadowRoot?.querySelector('svg') as SVGElement;

  expect(svg.getAttribute('aria-hidden')).toBe('false');
  expect(svg.getAttribute('role')).toBe('img');
  expect(svg.getAttribute('aria-label')).toBe('Delete position');
  icon.remove();
});
