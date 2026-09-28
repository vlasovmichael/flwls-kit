// Conventional Commits: заголовок до 72 символов без точки, тело до 3 строк.
export const TYPES = ['feat', 'fix', 'chore', 'refactor', 'docs', 'test', 'perf', 'build', 'ci', 'style'];
const SUBJECT = new RegExp(`^(${TYPES.join('|')})(\\([^)]+\\))?!?: .+$`);
const TRAILER = /^(Co-Authored-By|Claude-Session|Signed-off-by|Refs|Closes):/i;
export function checkCommitMsg(message) {
    const lines = message.split('\n').filter((l) => !l.startsWith('#'));
    const [subject = '', blank = '', ...rest] = lines;
    // Служебные коммиты git пишет сам, их формат не наш.
    if (/^(Merge|Revert|fixup!|squash!) /.test(subject))
        return [];
    const problems = [];
    if (!SUBJECT.test(subject)) {
        problems.push(`заголовок не по конвенции: «${subject}»`, `ожидается «тип(область): что сделано», тип из: ${TYPES.join(', ')}`);
    }
    if (subject.length > 72)
        problems.push(`заголовок ${String(subject.length)} символов, максимум 72`);
    if (subject.endsWith('.'))
        problems.push('точка в конце заголовка');
    const body = rest.filter((l) => l.trim() && !TRAILER.test(l));
    if (body.length && blank.trim())
        problems.push('между заголовком и телом нужна пустая строка');
    if (body.length > 3)
        problems.push(`тело ${String(body.length)} строк, максимум 3 — лишнее видно в диффе`);
    return problems;
}
