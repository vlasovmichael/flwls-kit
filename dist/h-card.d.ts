import { LitElement } from 'lit';
export type CardVariant = 'surface' | 'raised' | 'outlined';
/** Карточка группирует связанное содержимое и необязательные области. */
export declare class HCard extends LitElement {
    #private;
    static properties: {
        variant: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    variant: CardVariant;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-card.d.ts.map