import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const SRC = join(process.cwd(), 'packages/ui/src');
const names = (css: string) => new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
const blocks = (css: string) => css.split(/\n(?=:root|@media)/).map(names);

const base = names(readFileSync(join(SRC, 'tokens.css'), 'utf8'));
const themes = readdirSync(join(SRC, 'themes')).filter((f) => f.endsWith('.css'));

describe.each(themes)('тема %s', (file) => {
  const css = readFileSync(join(SRC, 'themes', file), 'utf8');

  test('переопределяет только токены базы', () => {
    expect([...names(css)].filter((n) => !base.has(n))).toEqual([]);
  });

  test('тёмный вариант по атрибуту и по системе задаёт одно и то же', () => {
    const parts = blocks(css.slice(css.indexOf(':root')));
    expect(parts).toHaveLength(3);
    const [, dark, system] = parts.map((set) => [...set].sort());
    expect(system).toEqual(dark);
  });
});
