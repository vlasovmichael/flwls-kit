import { expect, test, vi } from 'vitest';
import { HTooltip, type TooltipAlign, type TooltipSide } from './h-tooltip.ts';

async function appendTooltip(tooltip: HTooltip, trigger = document.createElement('button')) {
  trigger.slot = 'trigger';
  trigger.textContent = 'Open tooltip';
  tooltip.append(trigger);
  document.body.append(tooltip);
  await tooltip.updateComplete;
  await Promise.resolve();
  return trigger;
}

test.each<TooltipSide>(['top', 'right', 'bottom', 'left'])(
  'подсказка отражает сторону %s',
  async (side) => {
    const tooltip = new HTooltip();
    tooltip.side = side;
    await appendTooltip(tooltip);

    expect(tooltip.getAttribute('side')).toBe(side);
    tooltip.remove();
  },
);

test.each<TooltipAlign>(['start', 'center', 'end'])(
  'подсказка отражает выравнивание %s',
  async (align) => {
    const tooltip = new HTooltip();
    tooltip.align = align;
    await appendTooltip(tooltip);

    expect(tooltip.getAttribute('align')).toBe(align);
    tooltip.remove();
  },
);

test('подсказка связывает trigger с role tooltip и восстанавливает атрибут', async () => {
  const tooltip = new HTooltip();
  const trigger = document.createElement('button');
  trigger.setAttribute('aria-describedby', 'existing-help');
  await appendTooltip(tooltip, trigger);
  const content = tooltip.shadowRoot?.querySelector('[role="tooltip"]') as HTMLElement;

  expect(content.id).not.toBe('');
  expect(trigger.getAttribute('aria-describedby')).toContain('existing-help');
  expect(trigger.getAttribute('aria-describedby')).toContain(content.id);

  tooltip.remove();
  expect(trigger.getAttribute('aria-describedby')).toBe('existing-help');
});

test('наведение открывает подсказку после задержки и уход закрывает её', async () => {
  vi.useFakeTimers();
  const tooltip = new HTooltip();
  tooltip.delay = 100;
  const trigger = await appendTooltip(tooltip);

  trigger.dispatchEvent(new MouseEvent('mouseenter'));
  await vi.advanceTimersByTimeAsync(100);
  expect(tooltip.open).toBe(true);

  trigger.dispatchEvent(new MouseEvent('mouseleave'));
  expect(tooltip.open).toBe(false);
  tooltip.remove();
  vi.useRealTimers();
});

test('фокус открывает подсказку, а Escape закрывает её', async () => {
  const tooltip = new HTooltip();
  const trigger = await appendTooltip(tooltip);

  trigger.dispatchEvent(new FocusEvent('focusin'));
  await tooltip.updateComplete;
  expect(tooltip.open).toBe(true);

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  expect(tooltip.open).toBe(false);
  tooltip.remove();
});

test('касание переключает подсказку', async () => {
  const tooltip = new HTooltip();
  const trigger = await appendTooltip(tooltip);
  const touch = new Event('pointerdown') as PointerEvent;

  Object.defineProperty(touch, 'pointerType', { value: 'touch' });
  trigger.dispatchEvent(touch);
  expect(tooltip.open).toBe(true);
  trigger.dispatchEvent(touch);
  expect(tooltip.open).toBe(false);
  tooltip.remove();
});

test('disabled не открывает подсказку', async () => {
  const tooltip = new HTooltip();
  tooltip.disabled = true;
  const trigger = await appendTooltip(tooltip);

  trigger.dispatchEvent(new FocusEvent('focusin'));
  expect(tooltip.open).toBe(false);
  tooltip.remove();
});

test('пересчитывает позицию от trigger и сообщает изменение состояния', async () => {
  const tooltip = new HTooltip();
  const trigger = document.createElement('button');
  const opened = vi.fn();
  const closed = vi.fn();
  trigger.getBoundingClientRect = () => new DOMRect(40, 30, 20, 10);
  tooltip.addEventListener('open', opened);
  tooltip.addEventListener('close', closed);
  await appendTooltip(tooltip, trigger);

  tooltip.open = true;
  await tooltip.updateComplete;
  const content = tooltip.shadowRoot?.querySelector('.tooltip') as HTMLElement;
  expect(content.style.left).not.toBe('');
  expect(content.style.top).not.toBe('');
  expect(opened).toHaveBeenCalledTimes(1);

  tooltip.open = false;
  await tooltip.updateComplete;
  expect(closed).toHaveBeenCalledTimes(1);
  tooltip.remove();
});
