import { LitElement } from 'lit';
export type FieldSize = 'sm' | 'md' | 'lg';
/** Поле собирает подпись, нативный контрол и служебный текст в доступную группу. */
export declare class HField extends LitElement {
    #private;
    static formAssociated: boolean;
    static properties: {
        value: {
            type: StringConstructor;
        };
        name: {
            type: StringConstructor;
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
        placeholder: {
            type: StringConstructor;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        readonly: {
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
        type: {
            type: StringConstructor;
        };
        inputmode: {
            type: StringConstructor;
        };
    };
    static styles: import("lit").CSSResult;
    value: string;
    name: string;
    label: string;
    description: string;
    error: string;
    placeholder: string;
    disabled: boolean;
    readonly: boolean;
    required: boolean;
    size: FieldSize;
    type: string;
    inputmode: string;
    constructor();
    updated(): void;
    /** Форма выключает контрол через platform callback. */
    formDisabledCallback(disabled: boolean): void;
    protected renderControl(): import("lit-html").TemplateResult<1>;
    protected get descriptionId(): string;
    protected get errorId(): string;
    render(): import("lit-html").TemplateResult<1>;
}
/** Многострочный вариант сохраняет те же свойства и нативные события поля. */
export declare class HTextarea extends HField {
    #private;
    protected renderControl(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-field.d.ts.map