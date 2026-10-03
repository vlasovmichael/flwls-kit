import { LitElement } from 'lit';
import './h-icon.js';
export type PaginationSize = 'sm' | 'md';
export type PageSlot = number | 'gap';
/**
 * Номера страниц с разрывами. Число слотов постоянно (2 × siblings + 5), чтобы ряд
 * не менял ширину при листании; разрыв ставится, только если прячет больше одной страницы.
 */
export declare function pageSlots(page: number, pages: number, siblings?: number): PageSlot[];
/** Листалка страниц таблицы или списка. Хранит только номер страницы, данные грузит проект. */
export declare class HPagination extends LitElement {
    #private;
    static properties: {
        page: {
            type: NumberConstructor;
            reflect: boolean;
        };
        pages: {
            type: NumberConstructor;
        };
        siblings: {
            type: NumberConstructor;
        };
        size: {
            type: StringConstructor;
            reflect: boolean;
        };
        compact: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
    };
    static styles: import("lit").CSSResult;
    page: number;
    pages: number;
    siblings: number;
    size: PaginationSize;
    compact: boolean;
    label: string;
    constructor();
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-pagination.d.ts.map