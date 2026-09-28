import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
/** Файлы с нужными расширениями в каталогах `scan`, пути — от корня, по алфавиту. */
export function listFiles(root, scan, skip, ext) {
    const skipSet = new Set(skip);
    const extRe = new RegExp(`\\.(${ext.join('|')})$`);
    const out = [];
    const walk = (dir) => {
        for (const name of readdirSync(dir)) {
            if (skipSet.has(name))
                continue;
            const path = join(dir, name);
            if (statSync(path).isDirectory())
                walk(path);
            else if (extRe.test(name))
                out.push(relative(root, path));
        }
    };
    for (const dir of scan) {
        const abs = join(root, dir);
        // Пропавший каталог из конфига — ошибка настройки, а не «нарушений нет».
        if (!existsSync(abs))
            throw new Error(`каталог из "scan" не найден: ${dir}`);
        walk(abs);
    }
    return out.sort();
}
