import { LitElement } from 'lit';
import './h-icon.js';
/**
 * Раскрывающийся блок показывает дополнительное содержание по запросу.
 */
export declare class HDisclosure extends LitElement {
    #private;
    static properties: {
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    open: boolean;
    disabled: boolean;
    constructor();
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-disclosure.d.ts.map