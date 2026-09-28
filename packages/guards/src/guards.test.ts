import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { resolveConfig, type Config } from './config.js';
import { guardComments, guardJs, guardSize } from './guards.js';

let root: string;
let cfg: Config;
const put = (rel: string, text: string) => {
  mkdirSync(dirname(join(root, rel)), { recursive: true });
  writeFileSync(join(root, rel), text);
};

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'guards-'));
  cfg = resolveConfig(root, { scan: ['src'], size: { limit: 3 } });
  put('src/ok.ts', 'export const a = 1;\n');
});
afterEach(() => {
  rmSync(root, { recursive: true });
});

describe('guardComments', () => {
  test('новое нарушение валит, после --update проходит', () => {
    put('src/bad.ts', 'let x;\n// раньше тут было иначе\n');
    expect(guardComments(cfg).ok).toBe(false);
    expect(guardComments(cfg, true).ok).toBe(true);
    expect(JSON.parse(readFileSync(join(root, cfg.comments.debt), 'utf8'))).toEqual({ 'src/bad.ts': 1 });
    expect(guardComments(cfg).ok).toBe(true);
  });

  test('вычищенный долг требует опустить планку', () => {
    put('src/bad.ts', 'let x;\n// раньше тут было иначе\n');
    guardComments(cfg, true);
    put('src/bad.ts', 'let x;\n');
    const r = guardComments(cfg);
    expect(r.ok).toBe(false);
    expect(r.lines.join('\n')).toContain('опустить');
  });
});

describe('guardSize', () => {
  test('рост сверх лимита валит, долг держит планку', () => {
    put('src/big.ts', 'a\nb\nc\nd\n');
    expect(guardSize(cfg).ok).toBe(false);
    guardSize(cfg, true);
    expect(guardSize(cfg).ok).toBe(true);
    put('src/big.ts', 'a\nb\nc\nd\ne\n');
    expect(guardSize(cfg).ok).toBe(false);
  });
});

describe('guardJs', () => {
  test('новый JS валит, переведённый требует опустить планку', () => {
    guardJs(cfg, true);
    put('src/old.js', '');
    expect(guardJs(cfg).ok).toBe(false);
    guardJs(cfg, true);
    rmSync(join(root, 'src/old.js'));
    expect(guardJs(cfg).ok).toBe(false);
  });
});

test('пропавший каталог из scan — ошибка, а не зелёная проверка', () => {
  expect(() => guardSize(resolveConfig(root, { scan: ['nope'] }))).toThrow('nope');
});
