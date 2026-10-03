import { expect, test } from 'vitest';
import { HProgress } from './h-progress.ts';

async function appendProgress(options: {
  indeterminate?: boolean;
  label?: string;
  max?: number;
  min?: number;
  value?: number;
} = {}) {
  const progress = new HProgress();
  progress.indeterminate = options.indeterminate ?? false;
  progress.label = options.label ?? 'Uploading report';
  progress.max = options.max ?? 100;
  progress.min = options.min ?? 0;
  progress.value = options.value ?? 42;
  document.body.append(progress);
  await progress.updateComplete;
  return progress;
}

test('определённый прогресс передаёт ARIA-диапазон и метку', async () => {
  const progress = await appendProgress();
  const track = progress.shadowRoot?.querySelector('.track') as HTMLElement;

  expect(track.getAttribute('role')).toBe('progressbar');
  expect(track.getAttribute('aria-label')).toBe('Uploading report');
  expect(track.getAttribute('aria-valuemin')).toBe('0');
  expect(track.getAttribute('aria-valuemax')).toBe('100');
  expect(track.getAttribute('aria-valuenow')).toBe('42');
  expect(track.getAttribute('aria-valuetext')).toBe('42 of 100');
  progress.remove();
});

test('прогресс ограничивает значение диапазоном', async () => {
  const progress = await appendProgress({ value: 120 });
  const root = progress.shadowRoot as ShadowRoot;
  const track = root.querySelector('.track') as HTMLElement;
  const bar = root.querySelector('.bar') as HTMLElement;

  expect(track.getAttribute('aria-valuenow')).toBe('100');
  expect(bar.style.getPropertyValue('--progress-complete')).toBe('1');

  progress.value = -10;
  await progress.updateComplete;

  expect(track.getAttribute('aria-valuenow')).toBe('0');
  expect(bar.style.getPropertyValue('--progress-complete')).toBe('0');
  progress.remove();
});

test('пользовательский диапазон задаёт завершённую долю', async () => {
  const progress = await appendProgress({ min: 10, max: 20, value: 15 });
  const bar = progress.shadowRoot?.querySelector('.bar') as HTMLElement;

  expect(bar.style.getPropertyValue('--progress-complete')).toBe('0.5');
  progress.remove();
});

test('неопределённый прогресс скрывает текущее значение', async () => {
  const progress = await appendProgress({ indeterminate: true });
  const root = progress.shadowRoot as ShadowRoot;
  const track = root.querySelector('.track') as HTMLElement;
  const value = root.querySelector('.value') as HTMLElement;

  expect(track.getAttribute('aria-valuenow')).toBeNull();
  expect(track.getAttribute('aria-valuetext')).toBe('In progress');
  expect(value.hidden).toBe(true);
  progress.remove();
});

test('неверный диапазон не делит на ноль', async () => {
  const progress = await appendProgress({ min: 10, max: 10, value: 10 });
  const bar = progress.shadowRoot?.querySelector('.bar') as HTMLElement;

  expect(bar.style.getPropertyValue('--progress-complete')).toBe('0');
  progress.remove();
});

test('прогресс отключает анимацию при reduced motion', () => {
  expect(HProgress.styles.toString()).toContain('@media (prefers-reduced-motion: reduce)');
  expect(HProgress.styles.toString()).toContain('animation: none');
});
