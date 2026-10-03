import { LitElement } from 'lit';
import './h-icon.js';
export type DropdownMenuItem = {
    label: string;
    value: string;
    icon?: string;
    disabled?: boolean;
    /** Необратимое действие: красный пункт. */
    danger?: boolean;
    /** Линия над пунктом отделяет группу. */
    divider?: boolean;
};
export type DropdownMenuSize = 'sm' | 'md';
export type DropdownMenuAlign = 'start' | 'end';
export type DropdownMenuCloseReason = 'escape' | 'outside' | 'select' | 'tab' | 'toggle';
/** Меню действий: открывается кнопкой и ничего не хранит, в отличие от h-select. */
export declare class HDropdownMenu extends LitElement {
    #private;
    static properties: {
        items: {
            attribute: boolean;
        };
        label: {
            type: StringConstructor;
        };
        icon: {
            type: StringConstructor;
        };
        iconOnly: {
            type: BooleanConstructor;
            attribute: string;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        align: {
            type: StringConstructor;
            reflect: boolean;
        };
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    items: DropdownMenuItem[];
    label: string;
    icon: string;
    iconOnly: boolean;
    size: DropdownMenuSize;
    align: DropdownMenuAlign;
    open: boolean;
    disabled: boolean;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changed: Map<PropertyKey, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-dropdown-menu.d.ts.map