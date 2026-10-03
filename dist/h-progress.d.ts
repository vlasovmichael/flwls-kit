import { LitElement } from 'lit';
/** Полоса показывает известную или неопределённую долю работы. */
export declare class HProgress extends LitElement {
    #private;
    static properties: {
        value: {
            type: NumberConstructor;
        };
        min: {
            type: NumberConstructor;
        };
        max: {
            type: NumberConstructor;
        };
        label: {
            type: StringConstructor;
        };
        indeterminate: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    value: number;
    min: number;
    max: number;
    label: string;
    indeterminate: boolean;
    constructor();
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-progress.d.ts.map