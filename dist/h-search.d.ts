import { LitElement } from 'lit';
import './h-icon.js';
/** Поле поиска: лупа, крестик очистки, Escape стирает. Проект слушает `input` и читает `value`. */
export declare class HSearch extends LitElement {
    #private;
    static properties: {
        value: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        placeholder: {
            type: StringConstructor;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    value: string;
    label: string;
    placeholder: string;
    size: 'sm' | 'md';
    disabled: boolean;
    constructor();
    focus(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-search.d.ts.map