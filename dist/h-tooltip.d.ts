import { LitElement } from 'lit';
export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type TooltipAlign = 'start' | 'center' | 'end';
/** Короткая подсказка поясняет элемент, не заменяя видимую подпись. */
export declare class HTooltip extends LitElement {
    #private;
    static properties: {
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        side: {
            type: StringConstructor;
            reflect: boolean;
        };
        align: {
            type: StringConstructor;
            reflect: boolean;
        };
        delay: {
            type: NumberConstructor;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    open: boolean;
    side: TooltipSide;
    align: TooltipAlign;
    delay: number;
    disabled: boolean;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    updated(changed: Map<PropertyKey, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-tooltip.d.ts.map