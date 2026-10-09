import { LitElement } from 'lit';
import './h-icon.js';
export type DrawerPlacement = 'start' | 'end' | 'bottom' | 'center';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';
export type DrawerCloseReason = 'escape' | 'backdrop' | 'button' | 'api';
/** Кадр до появления: за краем экрана; по центру — ниже, меньше, прозрачно. */
export declare function hiddenFrame(placement: DrawerPlacement, rtl: boolean): Keyframe;
/** Кадр в покое с теми же свойствами, что у скрытого, чтобы анимация шла в обе стороны. */
export declare function shownFrame(placement: DrawerPlacement): Keyframe;
/**
 * Панель с края или окно по центру поверх страницы: фильтры, детали строки, короткая форма.
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