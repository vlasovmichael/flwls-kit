import { LitElement } from 'lit';
import './h-icon.js';
export type ToastTone = 'info' | 'success' | 'warning' | 'error' | 'ok' | 'bad';
export type ToastDismissReason = 'timeout' | 'close' | 'action';
/** Короткое сообщение о результате действия с понятным способом закрыть его. */
export declare class HToast extends LitElement {
    #private;
    static properties: {
        title: {
            type: StringConstructor;
        };
        message: {
            type: StringConstructor;
        };
        tone: {
            type: StringConstructor;
            reflect: boolean;
        };
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        duration: {
            type: NumberConstructor;
        };
        dismissible: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    title: string;
    message: string;
    tone: ToastTone;
    open: boolean;
    duration: number;
    dismissible: boolean;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changed: Map<PropertyKey, unknown>): void;
    /** Закрывает уведомление и сообщает стеку, почему оно ушло. */
    dismiss(reason?: ToastDismissReason): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-toast.d.ts.map