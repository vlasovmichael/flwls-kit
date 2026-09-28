import { describe, expect, test } from 'vitest';
import { checkCommitMsg } from './commit-msg.js';

describe('checkCommitMsg', () => {
  test('конвенция с трейлером проходит', () => {
    expect(checkCommitMsg('feat(курс): песочница\n\nCo-Authored-By: Claude <x@y>\n')).toEqual([]);
  });

  test('тело до трёх строк допустимо, четыре — нет', () => {
    const three = 'fix: a\n\n1\n2\n3\n';
    expect(checkCommitMsg(three)).toEqual([]);
    expect(checkCommitMsg(`${three}4\n`)).toHaveLength(1);
  });

  test('заголовок без типа, с точкой и длинный', () => {
    expect(checkCommitMsg('updates.').length).toBeGreaterThanOrEqual(2);
    expect(checkCommitMsg(`docs: ${'я'.repeat(70)}`)).toEqual(['заголовок 76 символов, максимум 72']);
  });

  test('служебные коммиты git не проверяются', () => {
    expect(checkCommitMsg('Revert "feat: x"\n\nThis reverts commit abc.')).toEqual([]);
    expect(checkCommitMsg("Merge branch 'main'")).toEqual([]);
  });
});
