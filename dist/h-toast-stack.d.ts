import { LitElement } from 'lit';
import type { ToastDismissReason, ToastTone } from './h-toast.js';
import './h-toast.js';
export type ToastPosition = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
export type ToastOptions = {
    id?: string;
    title?: string;
    message: string;
    tone?: ToastTone;
    duration?: number;
    dismissible?: boolean;
};
/** Стек владеет очередью: показывает ограниченное число и удаляет закрытые сообщения. */
export declare class HToastStack extends LitElement {
    #private;
    static properties: {
        maxVisible: {
            type: NumberConstructor;
            attribute: string;
        };
        position: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    maxVisible: number;
    position: ToastPosition;
    constructor();
    /** Добавляет сообщение в конец очереди и возвращает его стабильный идентификатор. */
    show(options: ToastOptions): string;
    /** Убирает конкретное сообщение без ожидания его таймера. */
    dismiss(id: string, reason?: ToastDismissReason): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-toast-stack.d.ts.map