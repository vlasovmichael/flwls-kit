// Храповик длины строк: код читают люди, а строка длиннее 100 знаков прячет стиль и логику.
// Долг пофайлово в line-debt.json: вверх не растёт, у нового файла он ноль.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from 'vitest';

const MAX = 100;
const DEBT_FILE = join(process.cwd(), 'packages/ui/line-debt.json');
const debt = JSON.parse(readFileSync(DEBT_FILE, 'utf8')) as Record<string, number>;

const tsIn = (dir: string) =>
  readdirSync(dir).filter((f) => f.endsWith('.ts')).map((f) => `${dir}/${f}`);
const files = [...tsIn('packages/ui/src'), ...tsIn('.storybook/docs')];

test(`строки не длиннее ${String(MAX)} знаков сверх зафиксированного долга`, () => {
  const over = files.flatMap((file) => {
    const long = readFileSync(file, 'utf8').split('\n').filter((l) => l.length > MAX).length;
    const allowed = debt[file] ?? 0;
    return long > allowed ? [`${file}: ${String(long)} > ${String(allowed)}`] : [];
  });
  expect(over).toEqual([]);
});
