import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const css = readFileSync(join(process.cwd(), 'packages/ui/src/tokens.css'), 'utf8');

/** Объявления блока `селектор { … }` как «имя → значение». */
function block(selector: string): Map<string, string> {
  const start = css.indexOf(`${selector} {`);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  const body = css.slice(start + selector.length + 2, css.indexOf('}', start));
  return new Map([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}

const light = block(':root');
const dark = block(':root[data-theme="dark"]');
const system = block(':root:not([data-theme="light"])');

describe('tokens.css', () => {
  test('тёмная тема по атрибуту и по системе совпадает до значения', () => {
    expect([...system].sort()).toEqual([...dark].sort());
  });

  test('всё, что перекрашивает тёмная тема, есть и в светлой', () => {
    expect([...dark.keys()].filter((name) => !light.has(name))).toEqual([]);
  });

  test('шкалы растут монотонно', () => {
    for (const prefix of ['--space-', '--text-', '--layer-']) {
      const values = [...light].filter(([n]) => n.startsWith(prefix)).map(([, v]) => parseFloat(v));
      expect(values.length, prefix).toBeGreaterThan(2);
      expect(values, prefix).toEqual([...values].sort((a, b) => a - b));
    }
  });
});

describe('два слоя', () => {
  const raw = /#[\da-f]{3,8}\b|rgb\(/i;

  test('семантика ссылается на палитру, сырых цветов в ней нет (кроме теней)', () => {
    const offenders = [light, dark, system].flatMap((block) =>
      [...block].filter(([name, value]) =>
        !name.startsWith('--color-') && !name.startsWith('--shadow') && raw.test(value)).map(([n]) => n));
    expect(offenders).toEqual([]);
  });

  test('палитра одна на все темы: тёмная тема её не переопределяет', () => {
    expect([...dark.keys()].filter((name) => name.startsWith('--color-'))).toEqual([]);
  });
});
