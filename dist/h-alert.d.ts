import { LitElement } from 'lit';
import './h-icon.js';
export type AlertTone = 'info' | 'success' | 'warning' | 'error';
/** Встроенный баннер сообщает о состоянии. */
export declare class HAlert extends LitElement {
    #private;
    static properties: {
        title: {
            type: StringConstructor;
        };
        tone: {
            type: StringConstructor;
            reflect: boolean;
        };
        dismissible: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    title: string;
    tone: AlertTone;
    dismissible: boolean;
    constructor();
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-alert.d.ts.map