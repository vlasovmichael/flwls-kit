// Три храповика: долг фиксируется пофайлово в JSON, вверх не растёт.
// Долг комментариев и JS ниже планки валит проверку: планку опускают через --update,
// иначе вычищенное место молча заполнится снова.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { checkComments } from './comments.js';
import type { Config } from './config.js';
import { listFiles } from './files.js';

export type Result = { ok: boolean; lines: string[] };

function readDebt<T>(cfg: Config, path: string, empty: T): T {
  const abs = join(cfg.root, path);
  return existsSync(abs) ? (JSON.parse(readFileSync(abs, 'utf8')) as T) : empty;
}

function writeDebt(cfg: Config, path: string, value: unknown) {
  const abs = join(cfg.root, path);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, `${JSON.stringify(value, null, 2)}\n`);
}

const read = (cfg: Config, rel: string) => readFileSync(join(cfg.root, rel), 'utf8');

export function guardComments(cfg: Config, update = false): Result {
  const files = listFiles(cfg.root, cfg.scan, cfg.skip, ['js', 'mjs', 'cjs', 'ts', 'gts']);
  const found = new Map<string, ReturnType<typeof checkComments>>();
  for (const rel of files) {
    const problems = checkComments(read(cfg, rel), cfg.comments.maxBlockLines);
    if (problems.length) found.set(rel, problems);
  }
  const counts = Object.fromEntries([...found].map(([rel, p]) => [rel, p.length]));
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  if (update) {
    writeDebt(cfg, cfg.comments.debt, counts);
    return { ok: true, lines: [`[comments] планка обновлена: ${String(total)} в ${String(found.size)} файлах`] };
  }

  const debt = readDebt<Record<string, number>>(cfg, cfg.comments.debt, {});
  const lines: string[] = [];
  for (const [rel, problems] of found) {
    const allowed = debt[rel] ?? 0;
    if (problems.length <= allowed) continue;
    lines.push(`  ${rel}: ${String(problems.length)} при планке ${String(allowed)}`);
    for (const p of problems) lines.push(`    :${String(p.line)}  [${p.rule}]  ${p.text}`);
  }
  const stale = Object.entries(debt).filter(([rel, n]) => (counts[rel] ?? 0) < n);
  for (const [rel, n] of stale) lines.push(`  ${rel}: долг ${String(counts[rel] ?? 0)}, планка ${String(n)} — опустить`);

  if (lines.length) {
    return {
      ok: false,
      lines: ['[comments] нарушения или устаревшая планка:', ...lines, 'Планка вниз: flwls-guards comments --update'],
    };
  }
  return { ok: true, lines: [`[comments] новых нарушений нет, долг ${String(total)}`] };
}

export function guardSize(cfg: Config, update = false): Result {
  const { limit, ext } = cfg.size;
  const sizes: Record<string, number> = {};
  for (const rel of listFiles(cfg.root, cfg.scan, cfg.skip, ext)) {
    const n = read(cfg, rel).split('\n').length;
    if (n > limit) sizes[rel] = n;
  }
  if (update) {
    writeDebt(cfg, cfg.size.debt, sizes);
    return { ok: true, lines: [`[size] планка обновлена: ${String(Object.keys(sizes).length)} файлов сверх ${String(limit)}`] };
  }
  const debt = readDebt<Record<string, number>>(cfg, cfg.size.debt, {});
  const grown = Object.entries(sizes).filter(([rel, n]) => n > (debt[rel] ?? limit));
  if (grown.length) {
    return {
      ok: false,
      lines: [
        `[size] файлы выросли сверх планки (лимит ${String(limit)}):`,
        ...grown.map(([rel, n]) => `  ${rel}: ${String(n)} при планке ${String(debt[rel] ?? limit)}`),
      ],
    };
  }
  return { ok: true, lines: [`[size] роста нет, сверх ${String(limit)} строк: ${String(Object.keys(sizes).length)}`] };
}

export function guardJs(cfg: Config, update = false): Result {
  const files = listFiles(cfg.root, cfg.scan, cfg.skip, ['js', 'mjs', 'cjs']);
  if (update) {
    writeDebt(cfg, cfg.js.debt, files);
    return { ok: true, lines: [`[js] планка обновлена: ${String(files.length)} JS-файлов`] };
  }
  const debt = readDebt<string[]>(cfg, cfg.js.debt, []);
  const added = files.filter((f) => !debt.includes(f));
  const gone = debt.filter((f) => !files.includes(f));
  if (added.length || gone.length) {
    return {
      ok: false,
      lines: [
        '[js] список JS-файлов разошёлся с планкой:',
        ...added.map((f) => `  новый: ${f}`),
        ...gone.map((f) => `  переведён или удалён: ${f} — опустить планку`),
        'Планка вниз: flwls-guards js --update',
      ],
    };
  }
  return { ok: true, lines: [`[js] JS-файлов: ${String(files.length)}, как в планке`] };
}
