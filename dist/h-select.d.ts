import { LitElement } from 'lit';
import './h-icon.js';
export type SelectOption = {
    label: string;
    value: string;
};
/** Селект использует light DOM, чтобы проекты могли оформлять список в своих слоях. */
export declare class HSelect extends LitElement {
    #private;
    static formAssociated: boolean;
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
        name: {
            type: StringConstructor;
        };
        placeholder: {
            type: StringConstructor;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    options: SelectOption[];
    value: string;
    label: string;
    name: string;
    placeholder: string;
    disabled: boolean;
    constructor();
    protected createRenderRoot(): this;
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changed: Map<PropertyKey, unknown>): void;
    /** Форма выключает контрол через platform callback. */
    formDisabledCallback(disabled: boolean): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-select.d.ts.map