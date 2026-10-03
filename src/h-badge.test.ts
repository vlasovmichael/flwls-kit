import { expect, test } from 'vitest';
import { HBadge, type BadgeSize, type BadgeTone } from './h-badge.ts';

async function appendComponent<T extends HTMLElement & { updateComplete: Promise<unknown> }>(
  component: T,
) {
  document.body.append(component);
  await component.updateComplete;
  return component;
}

test.each<BadgeTone>(['neutral', 'info', 'success', 'warning', 'error'])(
  'бейдж отражает тон %s',
  async (tone) => {
    const badge = new HBadge();
    badge.tone = tone;
    await appendComponent(badge);

    expect(badge.getAttribute('tone')).toBe(tone);
    badge.remove();
  },
);

test.each<BadgeSize>(['sm', 'md', 'lg'])(
  'бейдж отражает размер %s',
  async (size) => {
    const badge = new HBadge();
    badge.size = size;
    await appendComponent(badge);

    expect(badge.getAttribute('size')).toBe(size);
    badge.remove();
  },
);
