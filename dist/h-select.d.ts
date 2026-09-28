import { LitElement } from 'lit';
export type SelectOption = {
    label: string;
    value: string;
};
export declare class HSelect extends LitElement {
    #private;
    static properties: {
        options: {
            attribute: boolean;
        };
        value: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
    };
    options: SelectOption[];
    value: string;
    label: string;
    constructor();
    protected createRenderRoot(): this;
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changed: Map<PropertyKey, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-select.d.ts.map