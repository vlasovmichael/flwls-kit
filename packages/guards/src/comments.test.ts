import { describe, expect, test } from 'vitest';
import { checkComments } from './comments.js';

const rules = (src: string, max = 3) => checkComments(src, max).map((p) => p.rule);

describe('checkComments', () => {
  test('чистый комментарий проходит', () => {
    expect(rules('const a = 1;\n// сумма в злотых, без копеек\n')).toEqual([]);
  });

  test('дата, хеш, значок и хроника ловятся', () => {
    const src = [
      'let x;',
      '// починено 06.09',
      'x = 1;',
      '// см. коммит 3a59863',
      '// \u{1F6A8} не трогать',
      '// раньше здесь был цикл',
    ].join('\n');
    expect(rules(src)).toEqual(['дата', 'хеш коммита', 'значок', 'хроника']);
  });

  test('версия и числа не считаются датой или хешем', () => {
    expect(rules('let x;\n// Node 22.13 и лимит 1000\n// TypeScript 5.9\n')).toEqual([]);
  });

  test('простыня вне шапки ловится, шапка — нет', () => {
    const header = ['// один', '// два', '// три', '// четыре', 'import x from "y";'];
    expect(rules(header.join('\n'))).toEqual([]);
    const body = ['let x;', '// один', '// два', '// три', '// четыре'];
    expect(rules(body.join('\n'))).toEqual(['простыня 4 строк']);
    expect(rules(body.join('\n'), 6)).toEqual([]);
  });

  test('теги JSDoc не удлиняют простыню', () => {
    const src = ['let x;', '/**', ' * Сумма.', ' * @param a первое', ' * @param b второе', ' * @returns сумма', ' */'];
    expect(rules(src.join('\n'))).toEqual([]);
  });
});
