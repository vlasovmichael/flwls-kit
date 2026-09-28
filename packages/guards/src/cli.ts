#!/usr/bin/env node
// flwls-guards <all|comments|size|js> [--update]
// flwls-guards commit-msg <файл сообщения>
// Настройки — guards.config.json в текущем каталоге.
import { readFileSync } from 'node:fs';
import { checkCommitMsg } from './commit-msg.js';
import { loadConfig } from './config.js';
import { guardComments, guardJs, guardSize, type Result } from './guards.js';

const [command = 'all', ...args] = process.argv.slice(2);
const update = args.includes('--update');

function finish(results: Result[]): never {
  for (const r of results) (r.ok ? console.log : console.error)(r.lines.join('\n'));
  process.exit(results.every((r) => r.ok) ? 0 : 1);
}

if (command === 'commit-msg') {
  const [path] = args;
  if (!path) {
    console.error('[commit-msg] не передан файл сообщения');
    process.exit(1);
  }
  const problems = checkCommitMsg(readFileSync(path, 'utf8'));
  finish([{ ok: !problems.length, lines: problems.length ? ['[commit-msg] сообщение не принято:', ...problems.map((p) => `  ${p}`)] : [] }]);
}

const GUARDS = { comments: guardComments, size: guardSize, js: guardJs };
const cfg = loadConfig(process.cwd());

if (command === 'all') {
  if (update) {
    console.error('[guards] --update только для одного сторожа: планки не опускают пачкой');
    process.exit(1);
  }
  finish(Object.values(GUARDS).map((g) => g(cfg)));
}

if (!(command in GUARDS)) {
  console.error(`[guards] неизвестная команда «${command}»: all, comments, size, js, commit-msg`);
  process.exit(1);
}
finish([GUARDS[command as keyof typeof GUARDS](cfg, update)]);
