import { expect, test } from 'vitest';
import { HCard, type CardVariant } from './h-card.ts';

async function appendCard(card: HCard) {
  document.body.append(card);
  await card.updateComplete;
  return card;
}

test.each<CardVariant>(['surface', 'raised', 'outlined'])(
  'карточка отражает вариант %s',
  async (variant) => {
    const card = new HCard();
    card.variant = variant;
    await appendCard(card);

    expect(card.getAttribute('variant')).toBe(variant);
    card.remove();
  },
);

test('карточка размещает заголовок, содержимое, подвал и действия', async () => {
  const card = new HCard();
  const header = document.createElement('h2');
  const content = document.createElement('p');
  const footer = document.createElement('span');
  const actions = document.createElement('button');

  header.slot = 'header';
  header.textContent = 'Balance';
  content.textContent = 'Current account balance';
  footer.slot = 'footer';
  footer.textContent = 'Updated now';
  actions.slot = 'actions';
  actions.textContent = 'Review';
  card.append(header, content, footer, actions);
  await appendCard(card);

  const root = card.shadowRoot as ShadowRoot;

  expect(root.querySelector('header')).not.toBeNull();
  expect(root.querySelector('.content')).not.toBeNull();
  expect(root.querySelector('footer')).not.toBeNull();
  const headerSlot = root.querySelector<HTMLSlotElement>('slot[name="header"]');
  const contentSlot = root.querySelector<HTMLSlotElement>('slot:not([name])');
  const footerSlot = root.querySelector<HTMLSlotElement>('slot[name="footer"]');
  const actionsSlot = root.querySelector<HTMLSlotElement>('slot[name="actions"]');

  expect(headerSlot?.assignedElements()).toEqual([header]);
  expect(contentSlot?.assignedElements()).toEqual([content]);
  expect(footerSlot?.assignedElements()).toEqual([footer]);
  expect(actionsSlot?.assignedElements()).toEqual([actions]);
  card.remove();
});

test('карточка добавляет области после подключения', async () => {
  const card = new HCard();
  await appendCard(card);

  const header = document.createElement('h2');
  header.slot = 'header';
  header.textContent = 'Later heading';
  card.append(header);
  await Promise.resolve();
  await card.updateComplete;

  expect(card.shadowRoot?.querySelector('header')).not.toBeNull();
  card.remove();
});
