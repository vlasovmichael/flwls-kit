import { expect, test, vi } from 'vitest';
import { HAccordion } from './h-accordion.ts';
import { HDisclosure } from './h-disclosure.ts';

async function appendAccordion(options: { multiple?: boolean } = {}) {
  const accordion = new HAccordion();
  accordion.label = 'Account details';
  accordion.multiple = options.multiple ?? false;

  for (const title of ['Summary', 'Risk settings', 'Data sources']) {
    const disclosure = new HDisclosure();
    const summary = document.createElement('span');
    summary.slot = 'summary';
    summary.textContent = title;
    const content = document.createElement('p');
    content.textContent = `${title} content`;
    disclosure.append(summary, content);
    accordion.append(disclosure);
  }

  document.body.append(accordion);
  await accordion.updateComplete;
  await Promise.all(disclosures(accordion).map((item) => item.updateComplete));
  return accordion;
}

function disclosures(accordion: HAccordion) {
  return [...accordion.querySelectorAll<HDisclosure>(':scope > h-disclosure')];
}

function button(disclosure: HDisclosure) {
  return disclosure.shadowRoot?.querySelector('button') as HTMLButtonElement;
}

test('группа сохраняет ARIA-связи раскрытий', async () => {
  const accordion = await appendAccordion();
  const group = accordion.shadowRoot?.querySelector('[role="group"]');
  const first = disclosures(accordion)[0];
  const region = first.shadowRoot?.querySelector('[role="region"]') as HTMLElement;

  expect(group?.getAttribute('aria-label')).toBe('Account details');
  expect(button(first).getAttribute('aria-controls')).toBe(region.id);
  expect(region.getAttribute('aria-labelledby')).toBe(button(first).id);
  accordion.remove();
});

test('одиночный режим закрывает прежнее раскрытие', async () => {
  const accordion = await appendAccordion();
  const changed = vi.fn();
  const parent = document.createElement('div');
  const [first, second] = disclosures(accordion);
  first.open = true;
  await first.updateComplete;
  parent.addEventListener('change', changed);
  parent.append(accordion);
  document.body.append(parent);

  button(second).click();
  await Promise.all([accordion.updateComplete, first.updateComplete, second.updateComplete]);

  expect(first.open).toBe(false);
  expect(second.open).toBe(true);
  expect(changed).toHaveBeenCalledTimes(1);
  const event = changed.mock.calls[0][0] as CustomEvent<{ disclosure: HDisclosure; open: boolean }>;

  expect(event.detail.disclosure).toBe(second);
  expect(event.detail.open).toBe(true);
  parent.remove();
});

test('множественный режим оставляет несколько раскрытий', async () => {
  const accordion = await appendAccordion({ multiple: true });
  const [first, second] = disclosures(accordion);

  button(first).click();
  button(second).click();
  await Promise.all([first.updateComplete, second.updateComplete]);

  expect(first.open).toBe(true);
  expect(second.open).toBe(true);
  accordion.remove();
});

test('смена multiple закрывает все блоки кроме последнего', async () => {
  const accordion = await appendAccordion({ multiple: true });
  const [first, second, third] = disclosures(accordion);
  first.open = true;
  second.open = true;
  third.open = true;
  await Promise.all([first.updateComplete, second.updateComplete, third.updateComplete]);

  accordion.multiple = false;
  await Promise.all([accordion.updateComplete, first.updateComplete, second.updateComplete]);

  expect(first.open).toBe(false);
  expect(second.open).toBe(false);
  expect(third.open).toBe(true);
  accordion.remove();
});

test('стрелки, Home и End перемещают фокус', async () => {
  const accordion = await appendAccordion();
  const [first, second, third] = disclosures(accordion);
  second.disabled = true;
  await second.updateComplete;

  button(first).focus();
  button(first).dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, composed: true, key: 'ArrowDown' }),
  );
  expect(document.activeElement).toBe(third);
  expect(third.shadowRoot?.activeElement).toBe(button(third));

  button(third).dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, composed: true, key: 'Home' }),
  );
  expect(document.activeElement).toBe(first);

  button(first).dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, composed: true, key: 'End' }),
  );
  expect(document.activeElement).toBe(third);

  button(third).dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, composed: true, key: 'ArrowUp' }),
  );
  expect(document.activeElement).toBe(first);
  accordion.remove();
});

test('внешнее открытие в одиночном режиме оставляет один блок', async () => {
  const accordion = await appendAccordion();
  const [first, second, third] = disclosures(accordion);
  first.open = true;
  second.open = true;
  third.open = true;
  await new Promise<void>((resolve) => {
    setTimeout(resolve);
  });
  await Promise.all([first.updateComplete, second.updateComplete, third.updateComplete]);

  expect(first.open).toBe(false);
  expect(second.open).toBe(false);
  expect(third.open).toBe(true);
  accordion.remove();
});
