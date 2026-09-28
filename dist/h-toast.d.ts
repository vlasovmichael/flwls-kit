import { LitElement } from 'lit';
/** Короткое уведомление: появляется с пружиной, клик или `dismiss()` убирают его. */
export declare class HToast extends LitElement {
    #private;
    static properties: {
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
    };
    static styles: import("lit").CSSResult;
    message: string;
    tone: 'ok' | 'bad';
    open: boolean;
    constructor();
    connectedCallback(): void;
    firstUpdated(): void;
    /** Убрать уведомление: уход анимируется, `dismiss` приходит после него. */
    dismiss(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-toast.d.ts.map