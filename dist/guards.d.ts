import type { Config } from './config.js';
export type Result = {
    ok: boolean;
    lines: string[];
};
export declare function guardComments(cfg: Config, update?: boolean): Result;
export declare function guardSize(cfg: Config, update?: boolean): Result;
export declare function guardJs(cfg: Config, update?: boolean): Result;
//# sourceMappingURL=guards.d.ts.map