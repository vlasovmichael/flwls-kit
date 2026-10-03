import { LitElement } from 'lit';
export type SegmentedControlSize = 'sm' | 'md' | 'lg';
export type SegmentedControlOption = {
    label: string;
    value: string;
    disabled?: boolean;
};
/** Группа сегментов выбирает ровно одно значение из небольшого списка. */
export declare class HSegmentedControl extends LitElement {
    #private;
    static properties: {
        value: {
            type: StringConstructor;
        };
        options: {
            attribute: boolean;
        };
        label: {
            type: StringConstructor;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        stretch: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    value: string;
    options: SegmentedControlOption[];
    label: string;
    disabled: boolean;
    size: SegmentedControlSize;
    stretch: boolean;
    constructor();
    disconnectedCallback(): void;
    protected firstUpdated(): void;
    protected updated(changed: Map<PropertyKey, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-segmented-control.d.ts.map