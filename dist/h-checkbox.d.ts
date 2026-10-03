import { LitElement } from 'lit';
export type CheckControlSize = 'sm' | 'md' | 'lg';
/** Общая основа связывает переключатель с формой. */
declare abstract class HCheckControl extends LitElement {
    #private;
    static formAssociated: boolean;
    static properties: {
        checked: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        value: {
            type: StringConstructor;
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
    static styles: import("lit").CSSResult[];
    checked: boolean;
    value: string;
    name: string;
    label: string;
    description: string;
    error: string;
    disabled: boolean;
    required: boolean;
    size: CheckControlSize;
    constructor();
    protected firstUpdated(): void;
    protected updated(): void;
    /** Браузер передаёт form-disabled состояние. */
    formDisabledCallback(disabled: boolean): void;
    /** Сброс формы возвращает исходное состояние. */
    formResetCallback(): void;
    protected get describedBy(): string | null;
    protected get descriptionId(): string;
    protected get errorId(): string;
    /** Нативное change обновляет хост и выходит из тени. */
    protected change(event: Event): void;
    protected renderMessages(): import("lit-html").TemplateResult<1>;
}
/** Чекбокс выбирает независимую опцию. */
export declare class HCheckbox extends HCheckControl {
    static styles: import("lit").CSSResult[];
    static properties: {
        indeterminate: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        checked: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        value: {
            type: StringConstructor;
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
    indeterminate: boolean;
    constructor();
    protected updated(): void;
    /** Действие пользователя снимает indeterminate. */
    protected change(event: Event): void;
    render(): import("lit-html").TemplateResult<1>;
}
/** Переключатель сообщает бинарное состояние. */
export declare class HSwitch extends HCheckControl {
    static styles: import("lit").CSSResult[];
    render(): import("lit-html").TemplateResult<1>;
}
export {};
//# sourceMappingURL=h-checkbox.d.ts.map