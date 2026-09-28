export type Config = {
    root: string;
    scan: string[];
    skip: string[];
    comments: {
        maxBlockLines: number;
        debt: string;
    };
    size: {
        limit: number;
        ext: string[];
        debt: string;
    };
    js: {
        debt: string;
    };
};
export declare const CONFIG_FILE = "guards.config.json";
type Partial1<T> = {
    [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K];
};
/** Настройки из `guards.config.json` поверх умолчаний; `scan` обязателен. */
export declare function resolveConfig(root: string, raw: Partial1<Omit<Config, 'root'>>): Config;
export declare function loadConfig(root: string): Config;
export {};
//# sourceMappingURL=config.d.ts.map