import { LitElement } from 'lit';
export type SpinnerSize = 'sm' | 'md' | 'lg';
/** Индикатор без известного процента завершения. */
export declare class HSpinner extends LitElement {
    static properties: {
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
    };
    static styles: import("lit").CSSResult;
    size: SpinnerSize;
    label: string;
    constructor();
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-spinner.d.ts.map