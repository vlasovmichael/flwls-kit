import { LitElement } from 'lit';
/** Аккордеон координирует прямые раскрывающиеся блоки.
 *
 * Все они составляют одну группу.
 */
export declare class HAccordion extends LitElement {
    #private;
    static properties: {
        multiple: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
    };
    static styles: import("lit").CSSResult;
    multiple: boolean;
    label: string;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changed: Map<PropertyKey, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-accordion.d.ts.map