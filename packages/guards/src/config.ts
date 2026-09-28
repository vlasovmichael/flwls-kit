import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type Config = {
  root: string;
  scan: string[];
  skip: string[];
  comments: { maxBlockLines: number; debt: string };
  size: { limit: number; ext: string[]; debt: string };
  js: { debt: string };
};

export const CONFIG_FILE = 'guards.config.json';

const DEFAULTS: Omit<Config, 'root' | 'scan'> = {
  skip: ['node_modules', 'dist', 'coverage'],
  comments: { maxBlockLines: 3, debt: 'scripts/comment-debt.json' },
  size: { limit: 1000, ext: ['js', 'mjs', 'cjs', 'ts', 'gts', 'css', 'scss'], debt: 'scripts/size-debt.json' },
  js: { debt: 'scripts/js-debt.json' },
};

export type RawConfig = {
  scan?: string[];
  skip?: string[];
  comments?: Partial<Config['comments']>;
  size?: Partial<Config['size']>;
  js?: Partial<Config['js']>;
};

/** Настройки из `guards.config.json` поверх умолчаний; `scan` обязателен. */
export function resolveConfig(root: string, raw: RawConfig): Config {
  if (!raw.scan?.length) throw new Error(`${CONFIG_FILE}: не задан "scan" — какие каталоги проверять`);
  return {
    root,
    scan: raw.scan,
    skip: raw.skip ?? DEFAULTS.skip,
    comments: { ...DEFAULTS.comments, ...raw.comments },
    size: { ...DEFAULTS.size, ...raw.size },
    js: { ...DEFAULTS.js, ...raw.js },
  };
}

export function loadConfig(root: string): Config {
  const text = readFileSync(join(root, CONFIG_FILE), 'utf8');
  return resolveConfig(root, JSON.parse(text) as RawConfig);
}
