import { LitElement, nothing } from 'lit';
export type DividerOrientation = 'horizontal' | 'vertical';
/** Линия между группами. С подписью — «или», «Сегодня» посреди линии. */
export declare class HDivider extends LitElement {
    static properties: {
        orientation: {
            type: StringConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
    };
    static styles: import("lit").CSSResult;
    orientation: DividerOrientation;
    label: string;
    constructor();
    connectedCallback(): void;
    updated(): void;
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-divider.d.ts.map