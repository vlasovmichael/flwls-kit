import { LitElement } from 'lit';
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
    };
    static styles: import("lit").CSSResult;
    label: string;
    value: string;
    note: string;
    tone: string;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-stat.d.ts.map