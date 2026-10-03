import { LitElement, nothing } from 'lit';
type IconPart = readonly [string, Record<string, string | number | undefined>];
export type IconNode = readonly IconPart[];
declare const DEFAULT_ICONS: {
    readonly 'arrow-down': import("lucide").IconNode;
    readonly 'arrow-left': import("lucide").IconNode;
    readonly 'arrow-right': import("lucide").IconNode;
    readonly 'arrow-up': import("lucide").IconNode;
    readonly 'arrow-up-right': import("lucide").IconNode;
    readonly bell: import("lucide").IconNode;
    readonly calendar: import("lucide").IconNode;
    readonly check: import("lucide").IconNode;
    readonly 'chevron-down': import("lucide").IconNode;
    readonly 'chevron-left': import("lucide").IconNode;
    readonly 'chevron-right': import("lucide").IconNode;
    readonly 'chevron-up': import("lucide").IconNode;
    readonly 'circle-alert': import("lucide").IconNode;
    readonly 'circle-check': import("lucide").IconNode;
    readonly 'circle-x': import("lucide").IconNode;
    readonly clock: import("lucide").IconNode;
    readonly copy: import("lucide").IconNode;
    readonly download: import("lucide").IconNode;
    readonly ellipsis: import("lucide").IconNode;
    readonly 'ellipsis-vertical': import("lucide").IconNode;
    readonly 'external-link': import("lucide").IconNode;
    readonly eye: import("lucide").IconNode;
    readonly 'eye-off': import("lucide").IconNode;
    readonly file: import("lucide").IconNode;
    readonly filter: import("lucide").IconNode;
    readonly folder: import("lucide").IconNode;
    readonly house: import("lucide").IconNode;
    readonly inbox: import("lucide").IconNode;
    readonly info: import("lucide").IconNode;
    readonly link: import("lucide").IconNode;
    readonly lock: import("lucide").IconNode;
    readonly 'log-out': import("lucide").IconNode;
    readonly menu: import("lucide").IconNode;
    readonly minus: import("lucide").IconNode;
    readonly monitor: import("lucide").IconNode;
    readonly moon: import("lucide").IconNode;
    readonly pencil: import("lucide").IconNode;
    readonly plus: import("lucide").IconNode;
    readonly 'refresh-cw': import("lucide").IconNode;
    readonly search: import("lucide").IconNode;
    readonly settings: import("lucide").IconNode;
    readonly star: import("lucide").IconNode;
    readonly sun: import("lucide").IconNode;
    readonly 'trash-2': import("lucide").IconNode;
    readonly 'trending-down': import("lucide").IconNode;
    readonly 'trending-up': import("lucide").IconNode;
    readonly 'triangle-alert': import("lucide").IconNode;
    readonly upload: import("lucide").IconNode;
    readonly user: import("lucide").IconNode;
    readonly x: import("lucide").IconNode;
};
export type IconName = keyof typeof DEFAULT_ICONS;
/** Проект добавляет свои иконки Lucide под своими именами, не трогая кит. */
export declare function registerIcons(icons: Record<string, IconNode>): void;
/** Имена, доступные сейчас: набор по умолчанию плюс зарегистрированные проектом. */
export declare function iconNames(): string[];
export declare const ICON_NAMES: IconName[];
export type IconSize = 'sm' | 'md' | 'lg';
/** Иконка Lucide по имени из реестра: набор по умолчанию плюс зарегистрированные проектом. */
export declare class HIcon extends LitElement {
    static properties: {
        name: {
            type: StringConstructor;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
    };
    static styles: import("lit").CSSResult;
    name: IconName | (string & {});
    size: IconSize;
    label: string;
    constructor();
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
}
export {};
//# sourceMappingURL=h-icon.d.ts.map