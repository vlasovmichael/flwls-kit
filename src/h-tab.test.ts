import { expect, test, vi } from 'vitest';
import { HTab, HTabPanel, HTabs } from './h-tabs.ts';

async function appendTab(disabled = false) {
  const tabs = new HTabs();
  const summary = new HTab();
  summary.value = 'summary';
  summary.textContent = 'Summary';
  const details = new HTab();
  details.value = 'details';
  details.disabled = disabled;
  details.textContent = 'Details';
  const summaryPanel = new HTabPanel();
  summaryPanel.value = 'summary';
  const detailsPanel = new HTabPanel();
  detailsPanel.value = 'details';
  tabs.append(summary, details, summaryPanel, detailsPanel);
  document.body.append(tabs);
  await tabs.updateComplete;
  await Promise.resolve();
  return { details, tabs };
}

test('вкладка отражает value и доступность', async () => {
  const { details, tabs } = await appendTab(true);

  expect(details.getAttribute('value')).toBe('details');
  expect(details.getAttribute('aria-disabled')).toBe('true');
  expect(details.getAttribute('role')).toBe('tab');
  tabs.remove();
});

test('клик достигает host и выбирает вкладку', async () => {
  const { details, tabs } = await appendTab();
  const clicked = vi.fn();
  details.addEventListener('click', clicked);

  details.click();
  await tabs.updateComplete;

  expect(clicked).toHaveBeenCalledTimes(1);
  expect(tabs.value).toBe('details');
  expect(details.getAttribute('aria-selected')).toBe('true');
  tabs.remove();
});

test('недоступная вкладка не меняет контейнер', async () => {
  const { details, tabs } = await appendTab(true);

  details.click();

  expect(tabs.value).toBe('summary');
  tabs.remove();
});
