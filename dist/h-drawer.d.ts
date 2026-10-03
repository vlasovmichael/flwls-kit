import { LitElement } from 'lit';
import './h-icon.js';
export type DrawerPlacement = 'start' | 'end' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg';
export type DrawerCloseReason = 'escape' | 'backdrop' | 'button' | 'api';
/**
 * Боковая панель поверх страницы: фильтры, детали строки, форма без ухода со страницы.
 * Держится на нативном <dialog>: ловушку фокуса, inert фона и верхний слой даёт браузер.
 */
export declare class HDrawer extends LitElement {
    #private;
    static properties: {
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        heading: {
            type: StringConstructor;
        };
        placement: {
            type: StringConstructor;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    open: boolean;
    heading: string;
    placement: DrawerPlacement;
    size: DrawerSize;
    constructor();
    /** Закрыть с анимацией; `close` приходит с причиной после ухода панели. */
    hide(reason?: DrawerCloseReason): void;
    updated(changed: Map<PropertyKey, unknown>): void;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-drawer.d.ts.map