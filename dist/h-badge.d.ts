import { LitElement } from 'lit';
export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md' | 'lg';
/** Бейдж показывает статус. */
export declare class HBadge extends LitElement {
    static properties: {
        tone: {
            type: StringConstructor;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    tone: BadgeTone;
    size: BadgeSize;
    constructor();
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-badge.d.ts.map