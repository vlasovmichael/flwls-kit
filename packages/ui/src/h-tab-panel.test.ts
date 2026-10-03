import { expect, test } from 'vitest';
import { HTab, HTabPanel, HTabs } from './h-tabs.ts';

test('панель получает роль, метку вкладки и скрывается при другой value', async () => {
  const tabs = new HTabs();
  tabs.value = 'one';
  const firstTab = new HTab();
  firstTab.value = 'one';
  const secondTab = new HTab();
  secondTab.value = 'two';
  const firstPanel = new HTabPanel();
  firstPanel.value = 'one';
  const secondPanel = new HTabPanel();
  secondPanel.value = 'two';
  tabs.append(firstTab, secondTab, firstPanel, secondPanel);
  document.body.append(tabs);
  await tabs.updateComplete;
  await Promise.resolve();

  expect(firstPanel.getAttribute('role')).toBe('tabpanel');
  expect(firstPanel.getAttribute('aria-labelledby')).toBe(firstTab.id);
  expect(firstPanel.hidden).toBe(false);
  expect(secondPanel.hidden).toBe(true);

  tabs.value = 'two';
  await tabs.updateComplete;
  expect(firstPanel.hidden).toBe(true);
  expect(secondPanel.hidden).toBe(false);
  tabs.remove();
});
