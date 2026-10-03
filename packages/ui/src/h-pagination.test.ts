import { describe, expect, test } from 'vitest';
import { HPagination, pageSlots } from './h-pagination.ts';

describe('pageSlots', () => {
  test('мало страниц — все подряд', () => {
    expect(pageSlots(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(pageSlots(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test('у краёв один разрыв, в середине два', () => {
    expect(pageSlots(1, 20)).toEqual([1, 2, 3, 4, 5, 'gap', 20]);
    expect(pageSlots(10, 20)).toEqual([1, 'gap', 9, 10, 11, 'gap', 20]);
    expect(pageSlots(20, 20)).toEqual([1, 'gap', 16, 17, 18, 19, 20]);
  });

  test('число слотов не меняется при листании', () => {
    for (let page = 1; page <= 30; page += 1) {
      expect(pageSlots(page, 30)).toHaveLength(7);
      expect(pageSlots(page, 30, 2)).toHaveLength(9);
    }
  });

  test('разрыв не прячет одну страницу', () => {
    for (let page = 1; page <= 12; page += 1) {
      const slots = pageSlots(page, 12);
      slots.forEach((slot, i) => {
        if (slot !== 'gap') return;
        const before = slots[i - 1] as number;
        const after = slots[i + 1] as number;
        expect(after - before).toBeGreaterThan(2);
      });
    }
  });
});

async function appendPagination(page: number, pages: number) {
  const pagination = new HPagination();
  pagination.page = page;
  pagination.pages = pages;
  document.body.append(pagination);
  await pagination.updateComplete;
  const root = pagination.shadowRoot as ShadowRoot;
  return { pagination, root };
}

test('текущая страница отмечена, стрелки у краёв выключены', async () => {
  const { pagination, root } = await appendPagination(1, 12);

  expect(root.querySelector('nav')?.getAttribute('aria-label')).toBe('Pagination');
  expect(root.querySelector('[aria-current="page"]')?.textContent.trim()).toBe('1');
  const prev = root.querySelector<HTMLButtonElement>('[aria-label="Previous page"]');
  expect(prev?.disabled).toBe(true);
  expect(root.querySelector<HTMLButtonElement>('[aria-label="Next page"]')?.disabled).toBe(false);
  pagination.remove();
});

test('клик по номеру и стрелке меняет страницу и шлёт change', async () => {
  const { pagination, root } = await appendPagination(5, 12);
  const pages: number[] = [];
  pagination.addEventListener('change', (event) => {
    pages.push((event as CustomEvent<{ page: number }>).detail.page);
  });

  root.querySelector<HTMLButtonElement>('[aria-label="Page 12"]')?.click();
  await pagination.updateComplete;
  root.querySelector<HTMLButtonElement>('[aria-label="Previous page"]')?.click();
  await pagination.updateComplete;
  root.querySelector<HTMLButtonElement>('[aria-current="page"]')?.click();

  expect(pages).toEqual([12, 11]);
  expect(pagination.page).toBe(11);
  pagination.remove();
});

test('одна страница — листалки нет, компактный вид пишет «Page N of M»', async () => {
  const { pagination, root } = await appendPagination(1, 1);
  expect(root.querySelector('nav')).toBeNull();

  pagination.pages = 9;
  pagination.page = 3;
  pagination.compact = true;
  await pagination.updateComplete;
  const status = root.querySelector('.status')?.textContent.replace(/\s+/g, ' ').trim();
  expect(status).toBe('Page 3 of 9');
  pagination.remove();
});
