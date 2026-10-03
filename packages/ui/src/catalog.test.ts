// Документация не отстаёт от кода: каждый токен кита описан на страницах «Основы», и наоборот.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { ALL } from '../../../.storybook/docs/catalog.ts';

const css = readFileSync(join(process.cwd(), 'packages/ui/src/tokens.css'), 'utf8');
const light = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')));
const defined = [...light.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]);

test('каждый токен tokens.css описан в документации', () => {
  expect(defined.filter((name) => !ALL.includes(name))).toEqual([]);
});

test('документация не описывает токенов, которых нет', () => {
  expect(ALL.filter((name) => !defined.includes(name))).toEqual([]);
});
