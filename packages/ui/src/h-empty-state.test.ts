import { expect, test, vi } from 'vitest';
import { HEmptyState, type EmptyStateTone } from './h-empty-state.ts';

async function appendState(state: HEmptyState) {
  document.body.append(state);
  await state.updateComplete;
  return state;
}

test.each<EmptyStateTone>(['neutral', 'info', 'success', 'warning', 'error'])(
  'пустое состояние отражает тон %s',
  async (tone) => {
    const state = new HEmptyState();
    state.tone = tone;
    await appendState(state);

    expect(state.getAttribute('tone')).toBe(tone);
    state.remove();
  },
);

test('пустое состояние показывает заголовок и описание', async () => {
  const state = new HEmptyState();
  state.title = 'No alerts';
  state.description = 'Create an alert to track a price.';
  await appendState(state);

  const root = state.shadowRoot as ShadowRoot;
  expect(root.querySelector('h2')?.textContent).toBe('No alerts');
  expect(root.querySelector('p')?.textContent).toBe('Create an alert to track a price.');
  state.remove();
});

test('пустое состояние скрывает пустое описание', async () => {
  const state = new HEmptyState();
  state.title = 'No alerts';
  await appendState(state);

  expect(state.shadowRoot?.querySelector('p')).toBeNull();
  state.remove();
});

test('пустое состояние размещает иконку и действие в слотах', async () => {
  const state = new HEmptyState();
  const icon = document.createElement('span');
  const action = document.createElement('button');

  icon.slot = 'icon';
  icon.textContent = '⌕';
  action.slot = 'action';
  action.textContent = 'Add market';
  state.append(icon, action);
  await appendState(state);

  const root = state.shadowRoot as ShadowRoot;
  const iconSlot = root.querySelector<HTMLSlotElement>('slot[name="icon"]');
  const actionSlot = root.querySelector<HTMLSlotElement>('slot[name="action"]');

  expect(iconSlot?.assignedElements()).toEqual([icon]);
  expect(actionSlot?.assignedElements()).toEqual([action]);
  await state.updateComplete;
  expect(root.querySelector<HTMLElement>('.actions')?.hidden).toBe(false);
  state.remove();
});

test('клик действия всплывает к владельцу пустого состояния', async () => {
  const state = new HEmptyState();
  const action = document.createElement('button');
  const clicked = vi.fn();

  action.slot = 'action';
  state.append(action);
  state.addEventListener('click', clicked);
  await appendState(state);
  action.click();

  expect(clicked).toHaveBeenCalledTimes(1);
  state.remove();
});
