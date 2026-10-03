import { LitElement } from 'lit';
export type ButtonVariant = 'neutral' | 'primary' | 'danger' | 'ghost' | 'positive' | 'negative';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';
/** Кнопка сохраняет нативную семантику и связывается с ближайшей формой. */
export declare class HButton extends LitElement {
    #private;
    static formAssociated: boolean;
    static properties: {
        variant: {
            type: StringConstructor;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        loading: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        block: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        type: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult[];
    variant: ButtonVariant;
    size: ButtonSize;
    disabled: boolean;
    loading: boolean;
    block: boolean;
    type: ButtonType;
    constructor();
    /** Браузер сообщает form-associated состоянию доступность контрола. */
    formDisabledCallback(disabled: boolean): void;
    protected onClick(event: MouseEvent): void;
    protected renderButton(content: unknown): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
/** Иконка-кнопка требует текстовую метку, доступную программе чтения. */
export declare class HIconButton extends HButton {
    static properties: {
        label: {
            type: StringConstructor;
        };
        variant: {
            type: StringConstructor;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        loading: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        block: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        type: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult[];
    label: string;
    constructor();
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-button.d.ts.map