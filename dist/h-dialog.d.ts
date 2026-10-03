import { LitElement } from 'lit';
/** Окно подтверждения: `confirm` или `cancel` приходят после анимации ухода. */
export declare class HDialog extends LitElement {
    #private;
    static properties: {
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        title: {
            type: StringConstructor;
        };
        danger: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        confirmLabel: {
            type: StringConstructor;
            attribute: string;
        };
        cancelLabel: {
            type: StringConstructor;
            attribute: string;
        };
    };
    static styles: import("lit").CSSResult;
    open: boolean;
    title: string;
    danger: boolean;
    confirmLabel: string;
    cancelLabel: string;
    constructor();
    updated(changed: Map<PropertyKey, unknown>): void;
    disconnectedCallback(): void;
    /** Закрыть окно: уход анимируется, событие приходит после него. */
    close(kind: 'confirm' | 'cancel'): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-dialog.d.ts.map