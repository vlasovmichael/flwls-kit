import { expect, test } from 'vitest';
import { HSkeleton, type SkeletonVariant } from './h-skeleton.ts';

async function appendSkeleton(skeleton: HSkeleton) {
  document.body.append(skeleton);
  await skeleton.updateComplete;
  return skeleton;
}

test.each<SkeletonVariant>(['text', 'circle', 'rect', 'card'])(
  'скелетон отражает вариант %s',
  async (variant) => {
    const skeleton = new HSkeleton();
    skeleton.variant = variant;
    await appendSkeleton(skeleton);

    expect(skeleton.getAttribute('variant')).toBe(variant);
    skeleton.remove();
  },
);

test('скелетон применяет заданные размеры', async () => {
  const skeleton = new HSkeleton();
  skeleton.width = '75%';
  skeleton.height = 'var(--space-8)';
  await appendSkeleton(skeleton);

  const shape = skeleton.shadowRoot?.querySelector<HTMLElement>('.skeleton');
  expect(shape?.style.getPropertyValue('--skeleton-width')).toBe('75%');
  expect(shape?.style.getPropertyValue('--skeleton-height')).toBe('var(--space-8)');
  skeleton.remove();
});

test('скелетон скрыт от вспомогательных технологий', async () => {
  const skeleton = new HSkeleton();
  await appendSkeleton(skeleton);

  const shape = skeleton.shadowRoot?.querySelector('.skeleton');
  expect(shape?.getAttribute('aria-hidden')).toBe('true');
  skeleton.remove();
});

test('стили скелетона отключают анимацию для reduced motion', () => {
  expect(HSkeleton.styles.toString()).toContain('@media (prefers-reduced-motion: reduce)');
  expect(HSkeleton.styles.toString()).toContain('animation: none');
});
