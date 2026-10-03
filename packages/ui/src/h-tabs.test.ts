import { expect, test, vi } from 'vitest';
import { HTab, HTabPanel, HTabs, type TabsActivation, type TabsOrientation } from './h-tabs.ts';

async function appendTabs(options: {
  activation?: TabsActivation;
  disabled?: string;
  orientation?: TabsOrientation;
  value?: string;
} = {}) {
  const tabs = new HTabs();
  tabs.label = 'Account sections';
  tabs.value = options.value ?? 'overview';
  tabs.activation = options.activation ?? 'automatic';
  tabs.orientation = options.orientation ?? 'horizontal';

  for (const value of ['overview', 'activity', 'settings']) {
    const tab = new HTab();
    tab.value = value;
    tab.textContent = value;
    tab.disabled = options.disabled === value;
    const panel = new HTabPanel();
    panel.value = value;
    panel.textContent = `${value} panel`;
    tabs.append(tab, panel);
  }

  document.body.append(tabs);
  await tabs.updateComplete;
  await Promise.resolve();
  return tabs;
}

function children(tabs: HTabs) {
  return {
    panels: [...tabs.querySelectorAll<HTabPanel>('h-tab-panel')],
    tabs: [...tabs.querySelectorAll<HTab>('h-tab')],
  };
}

test('контейнер связывает tablist, вкладки и панели через ARIA', async () => {
  const tabs = await appendTabs();
  const { panels, tabs: tabItems } = children(tabs);
  const tablist = tabs.shadowRoot?.querySelector('[role="tablist"]');

  expect(tablist?.getAttribute('aria-label')).toBe('Account sections');
  expect(tabItems[0].getAttribute('aria-selected')).toBe('true');
  expect(tabItems[0].getAttribute('aria-controls')).toBe(panels[0].id);
  expect(panels[0].getAttribute('aria-labelledby')).toBe(tabItems[0].id);
  expect(panels[0].hidden).toBe(false);
  expect(panels[1].hidden).toBe(true);
  tabs.remove();
});

test('горизонтальные стрелки автоматически выбирают вкладку и отправляют change', async () => {
  const tabs = await appendTabs();
  const changed = vi.fn();
  let changedValue = '';
  tabs.addEventListener('change', changed);
  tabs.addEventListener('change', (event) => {
    changedValue = (event as CustomEvent<{ value: string }>).detail.value;
  });
  const { tabs: tabItems } = children(tabs);

  tabItems[0].focus();
  tabItems[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
  await tabs.updateComplete;

  expect(tabs.value).toBe('activity');
  expect(document.activeElement).toBe(tabItems[1]);
  expect(changed).toHaveBeenCalledTimes(1);
  expect(changedValue).toBe('activity');
  tabs.remove();
});

test('ручная активация переносит фокус до Enter или Space', async () => {
  const tabs = await appendTabs({ activation: 'manual' });
  const { tabs: tabItems } = children(tabs);

  tabItems[0].focus();
  tabItems[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
  await tabs.updateComplete;
  expect(tabs.value).toBe('overview');
  expect(document.activeElement).toBe(tabItems[1]);
  expect(tabItems[0].tabIndex).toBe(-1);
  expect(tabItems[1].tabIndex).toBe(0);

  tabItems[1].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: ' ' }));
  await tabs.updateComplete;
  expect(tabs.value).toBe('activity');
  tabs.remove();
});

test('Enter выбирает сфокусированную вкладку при ручной активации', async () => {
  const tabs = await appendTabs({ activation: 'manual' });
  const { tabs: tabItems } = children(tabs);

  tabItems[0].focus();
  tabItems[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
  await tabs.updateComplete;
  tabItems[1].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
  await tabs.updateComplete;

  expect(tabs.value).toBe('activity');
  expect(tabItems[1].getAttribute('aria-selected')).toBe('true');
  tabs.remove();
});

test('вертикальные стрелки, Home и End следуют ориентации', async () => {
  const tabs = await appendTabs({ orientation: 'vertical' });
  const { tabs: tabItems } = children(tabs);

  tabItems[0].focus();
  tabItems[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));
  await tabs.updateComplete;
  expect(tabs.value).toBe('activity');

  tabItems[1].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'End' }));
  await tabs.updateComplete;
  expect(tabs.value).toBe('settings');

  tabItems[2].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Home' }));
  await tabs.updateComplete;
  expect(tabs.value).toBe('overview');
  tabs.remove();
});

test('недоступная вкладка пропускается и не меняет значение по клику', async () => {
  const tabs = await appendTabs({ disabled: 'activity' });
  const { tabs: tabItems } = children(tabs);

  tabItems[1].click();
  expect(tabs.value).toBe('overview');
  expect(tabItems[1].getAttribute('aria-disabled')).toBe('true');
  expect(tabItems[1].tabIndex).toBe(-1);

  tabItems[0].dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));
  await tabs.updateComplete;
  expect(tabs.value).toBe('settings');
  tabs.remove();
});

test('неверное начальное значение заменяется первой доступной вкладкой', async () => {
  const tabs = await appendTabs({ value: 'missing' });

  expect(tabs.value).toBe('overview');
  tabs.remove();
});

test('вкладка без панели не получает пустую ARIA-ссылку', async () => {
  const tabs = new HTabs();
  const tab = new HTab();
  tab.value = 'summary';
  tabs.append(tab);
  document.body.append(tabs);
  await tabs.updateComplete;

  expect(tab.hasAttribute('aria-controls')).toBe(false);
  tabs.remove();
});

test('вкладки получают вид и ориентацию контейнера и следуют за их сменой', async () => {
  const tabs = await appendTabs({ orientation: 'vertical' });
  const [first] = children(tabs).tabs;
  expect(first.dataset.variant).toBe('contained');
  expect(first.dataset.orientation).toBe('vertical');

  tabs.variant = 'wrap';
  await tabs.updateComplete;
  expect(first.dataset.variant).toBe('wrap');
  tabs.remove();
});
