import { LitElement } from 'lit';
import './h-icon.js';
/** Копирует `value` в буфер: иконка на секунду становится галочкой, скринридер слышит «Copied». */
export declare class HCopyButton extends LitElement {
    #private;
    static properties: {
        value: {
            type: StringConstructor;
        };
        label: {
            type: StringConstructor;
        };
        copiedLabel: {
            type: StringConstructor;
            attribute: string;
        };
        _copied: {
            state: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    value: string;
    label: string;
    copiedLabel: string;
    _copied: boolean;
    constructor();
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-copy-button.d.ts.map