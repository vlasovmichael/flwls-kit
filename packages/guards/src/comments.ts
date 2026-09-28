// Комментарий объясняет код, а не рассказывает, как его писали.
// Ловит даты, хеши коммитов, значки, слова хроники и простыни длиннее лимита.
// Ничего не переписывает: автозамена ломает выравнивание таблиц и шапок.

export type CommentProblem = { line: number; rule: string; text: string };

const RULES = [
  { id: 'дата', re: /(?:^|[^\d.])(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])(?:\.20\d\d)?(?![\d.])/ },
  { id: 'хеш коммита', re: /(?<![\w.])(?=[0-9a-f]{7,40}(?![\w.]))[0-9]*[a-f][0-9a-f]*(?![\w.])/ },
  { id: 'значок', re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u },
  {
    id: 'хроника',
    re: /(?<!\p{L})(раньше|ранее|до этого|прошл(ая|ой) верси|стар(ая|ой) верси|пробовал\p{L}*|откатил\p{L}*|не понравил\p{L}*|в прошлый заход|как выяснилось|исторически)(?!\p{L})/iu,
  },
];

type Comment = { line: number; text: string; inHeader: boolean };

/** Строки-комментарии; шапка — сплошной комментарий с первой строки файла. */
function commentLines(src: string): Comment[] {
  const out: Comment[] = [];
  let inBlock = false;
  let headerOpen = true;
  src.split('\n').forEach((raw, i) => {
    const s = raw.trim();
    const isLine = s.startsWith('//');
    const opens = s.startsWith('/*');
    if (headerOpen && !isLine && !opens && !inBlock && s !== '') headerOpen = false;
    if (inBlock || isLine || opens) out.push({ line: i + 1, text: s, inHeader: headerOpen });
    if (opens && !s.includes('*/')) inBlock = true;
    if (inBlock && s.includes('*/')) inBlock = false;
  });
  return out;
}

export function checkComments(src: string, maxBlockLines: number): CommentProblem[] {
  const comments = commentLines(src);
  const problems: CommentProblem[] = [];

  for (const c of comments) {
    for (const rule of RULES) {
      if (rule.re.test(c.text)) problems.push({ line: c.line, rule: rule.id, text: c.text.slice(0, 100) });
    }
  }

  // Хвост JSDoc (@param, списки) структурный: прозу считаем до первого тега.
  let run: Comment[] = [];
  const flush = () => {
    const tag = run.findIndex((c) => /^(\*|\/\/)?\s*[@·•-]\s*\S/.test(c.text));
    const body = (tag === -1 ? run : run.slice(0, tag)).filter((c) => !/^(\/\*\*?|\*\/?|\/\/)$/.test(c.text));
    const [first] = run;
    if (body.length > maxBlockLines) {
      problems.push({ line: first.line, rule: `простыня ${String(body.length)} строк`, text: first.text.slice(0, 100) });
    }
    run = [];
  };
  let prev = -2;
  for (const c of comments) {
    if (c.inHeader) {
      flush();
    } else if (c.line === prev + 1) {
      run.push(c);
    } else {
      flush();
      run = [c];
    }
    prev = c.line;
  }
  flush();
  return problems;
}
