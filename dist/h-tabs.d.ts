import { LitElement } from 'lit';
export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsActivation = 'automatic' | 'manual';
export type TabsVariant = 'contained' | 'wrap';
type TabState = {
    controls?: string;
    selected: boolean;
    tabIndex: number;
    variant: string;
    orientation: string;
};
type PanelState = {
    labelledBy?: string;
    selected: boolean;
};
/** Отдельная вкладка получает выбор и связи ARIA от родительского контейнера. */
export declare class HTab extends LitElement {
    static properties: {
        value: {
            type: StringConstructor;
            reflect: boolean;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    value: string;
    disabled: boolean;
    constructor();
    connectedCallback(): void;
    /** Родитель задаёт roving tabindex и указывает связанную панель. */
    setState(state: TabState): void;
    updated(changed: Map<PropertyKey, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
}
/** Панель видна только для выбранной вкладки с тем же значением. */
export declare class HTabPanel extends LitElement {
    static properties: {
        value: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    value: string;
    constructor();
    connectedCallback(): void;
    /** Родитель связывает панель с вкладкой и скрывает неактивное содержимое. */
    setState(state: PanelState): void;
    render(): import("lit-html").TemplateResult<1>;
}
/** Контейнер реализует паттерн ARIA tabs с roving tabindex. */
export declare class HTabs extends LitElement {
    #private;
    static properties: {
        value: {
            type: StringConstructor;
            reflect: boolean;
        };
        orientation: {
            type: StringConstructor;
            reflect: boolean;
        };
        activation: {
            type: StringConstructor;
            reflect: boolean;
        };
        variant: {
            type: StringConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
    };
    static styles: import("lit").CSSResult;
    value: string;
    orientation: TabsOrientation;
    activation: TabsActivation;
    variant: TabsVariant;
    label: string;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
export {};
//# sourceMappingURL=h-tabs.d.ts.map