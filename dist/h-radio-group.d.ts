import { LitElement } from 'lit';
export type RadioGroupSize = 'sm' | 'md' | 'lg';
export type RadioGroupOption = {
    label: string;
    value: string;
    disabled?: boolean;
};
/** Группа радио выбирает один вариант. */
export declare class HRadioGroup extends LitElement {
    #private;
    static formAssociated: boolean;
    static properties: {
        value: {
            type: StringConstructor;
        };
        options: {
            attribute: boolean;
        };
        name: {
            type: StringConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
        description: {
            type: StringConstructor;
        };
        error: {
            type: StringConstructor;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        required: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    value: string;
    options: RadioGroupOption[];
    name: string;
    label: string;
    description: string;
    error: string;
    disabled: boolean;
    required: boolean;
    size: RadioGroupSize;
    constructor();
    protected firstUpdated(): void;
    protected updated(): void;
    /** Браузер сообщает, что fieldset стал недоступен. */
    formDisabledCallback(disabled: boolean): void;
    /** Сброс формы возвращает исходное значение. */
    formResetCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-radio-group.d.ts.map