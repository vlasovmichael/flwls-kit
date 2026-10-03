import { LitElement } from 'lit';
import type { BadgeTone } from './h-badge.ts';
import './h-icon.js';
/** Тег хранит выбранное значение. */
export declare class HTag extends LitElement {
    #private;
    static properties: {
        tone: {
            type: StringConstructor;
            reflect: boolean;
        };
        removable: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
    };
    static styles: import("lit").CSSResult;
    tone: BadgeTone;
    removable: boolean;
    label: string;
    constructor();
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-tag.d.ts.map