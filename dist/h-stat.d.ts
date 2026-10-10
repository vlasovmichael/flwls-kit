import { LitElement, type PropertyValues } from 'lit';
/** Число из отформатированной строки: «$1,204.5» → 1204.5, «−3.1%» → −3.1. */
export declare function numericValue(text: string): number | null;
/** Позиции сменившихся цифр; строки выравниваются по правому краю, как разряды. */
export declare function changedDigits(prev: string, next: string): number[];
export declare class HStat extends LitElement {
    static properties: {
        label: {
            type: StringConstructor;
        };
        value: {
            type: StringConstructor;
        };
        note: {
            type: StringConstructor;
        };
        tone: {
            type: StringConstructor;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    label: string;
    value: string;
    note: string;
    tone: string;
    size: string;
    constructor();
    render(): import("lit-html").TemplateResult<1>;
    protected updated(changed: PropertyValues<this>): void;
}
//# sourceMappingURL=h-stat.d.ts.map