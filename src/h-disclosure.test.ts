import { expect, test, vi } from 'vitest';
import { HDisclosure } from './h-disclosure.ts';

async function appendDisclosure(options: { disabled?: boolean; open?: boolean } = {}) {
  const disclosure = new HDisclosure();
  disclosure.disabled = options.disabled ?? false;
  disclosure.open = options.open ?? false;

  const summary = document.createElement('span');
  summary.slot = 'summary';
  summary.textContent = 'Monthly activity';
  const content = document.createElement('p');
  content.textContent = '12 entries were recorded this month.';
  disclosure.append(summary, content);
  document.body.append(disclosure);
  await disclosure.updateComplete;
  return disclosure;
}

function elements(disclosure: HDisclosure) {
  const root = disclosure.shadowRoot as ShadowRoot;
  return {
    button: root.querySelector('button') as HTMLButtonElement,
    region: root.querySelector('[role="region"]') as HTMLElement,
  };
}

test.each([false, true])('раскрытие отражает open=%s', async (open) => {
  const disclosure = await appendDisclosure({ open });
  const { button, region } = elements(disclosure);

  expect(disclosure.hasAttribute('open')).toBe(open);
  expect(button.getAttribute('aria-expanded')).toBe(String(open));
  // Свёрнутая область недоступна диктору и Tab через inert, а не hidden: так её можно анимировать.
  expect(region.inert).toBe(!open);
  disclosure.remove();
});

test(
  'кнопка связывает раскрываемую область через ARIA',
  async () => {
    const disclosure = await appendDisclosure();
    const { button, region } = elements(disclosure);

    expect(button.getAttribute('aria-controls')).toBe(region.id);
    expect(region.getAttribute('aria-labelledby')).toBe(button.id);
    expect(region.getAttribute('role')).toBe('region');
    disclosure.remove();
  },
);

test(
  'клик переключает состояние и отправляет composed change',
  async () => {
    const disclosure = await appendDisclosure();
    const changed = vi.fn();
    const parent = document.createElement('div');
    parent.addEventListener('change', changed);
    parent.append(disclosure);
    document.body.append(parent);
    const { button } = elements(disclosure);

    button.click();
    await disclosure.updateComplete;

    expect(disclosure.open).toBe(true);
    expect(changed).toHaveBeenCalledTimes(1);
    const event = changed.mock.calls[0][0] as CustomEvent<{ open: boolean }>;

    expect(event.detail.open).toBe(true);
    parent.remove();
  },
);

test(
  'Enter и пробел активируют нативную кнопку',
  async () => {
    const disclosure = await appendDisclosure();
    const changed = vi.fn();
    disclosure.addEventListener('change', changed);
    const { button } = elements(disclosure);

    button.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    button.click();
    await disclosure.updateComplete;
    button.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: ' ' }));
    button.click();
    await disclosure.updateComplete;

    expect(changed).toHaveBeenCalledTimes(2);
    expect(disclosure.open).toBe(false);
    disclosure.remove();
  },
);

test(
  'недоступное раскрытие не меняет состояние и отражает disabled',
  async () => {
    const disclosure = await appendDisclosure({ disabled: true });
    const changed = vi.fn();
    disclosure.addEventListener('change', changed);
    const { button } = elements(disclosure);

    button.click();

    expect(disclosure.hasAttribute('disabled')).toBe(true);
    expect(button.disabled).toBe(true);
    expect(disclosure.open).toBe(false);
    expect(changed).not.toHaveBeenCalled();
    disclosure.remove();
  },
);

test(
  'слоты передают заголовок и содержание в соответствующие области',
  async () => {
    const disclosure = await appendDisclosure({ open: true });
    const root = disclosure.shadowRoot as ShadowRoot;
    const summary = disclosure.querySelector('[slot="summary"]') as HTMLElement;
    const content = disclosure.querySelector('p') as HTMLParagraphElement;
    const summarySlot = root.querySelector<HTMLSlotElement>('slot[name="summary"]');
    const contentSlot = root.querySelector<HTMLSlotElement>(
      'slot:not([name])',
    );

    expect(summarySlot?.assignedElements()).toEqual([summary]);
    expect(contentSlot?.assignedElements()).toEqual([content]);
    disclosure.remove();
  },
);
