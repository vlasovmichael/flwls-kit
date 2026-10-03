import { LitElement } from 'lit';
import './h-icon.js';
/** Ключ дня в местном времени: toISOString сдвинул бы дату на часовой пояс. */
export declare const dayKey: (d: Date) => string;
/** «2026-10-03» → полночь этого дня в местном времени; мусор → null. */
export declare function parseDay(value: string): Date | null;
/** Первый день недели по локали: 1 — понедельник, 7 — воскресенье. */
export declare function firstWeekday(locale: string): number;
/** Шесть недель всегда: при листании месяцев сетка не меняет высоту. */
export declare function monthGrid(year: number, month: number, weekStart: number): Date[];
/** Поле даты с календарём. Значение — `YYYY-MM-DD`, с атрибутом `time` — `YYYY-MM-DDTHH:MM`. */
export declare class HDatePicker extends LitElement {
    #private;
    static properties: {
        value: {
            type: StringConstructor;
            reflect: boolean;
        };
        min: {
            type: StringConstructor;
        };
        max: {
            type: StringConstructor;
        };
        time: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        label: {
            type: StringConstructor;
        };
        placeholder: {
            type: StringConstructor;
        };
        locale: {
            type: StringConstructor;
        };
        disabled: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        open: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        _view: {
            state: boolean;
        };
        _focus: {
            state: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    value: string;
    min: string;
    max: string;
    time: boolean;
    label: string;
    placeholder: string;
    locale: string;
    disabled: boolean;
    open: boolean;
    /** Первое число показанного месяца. */
    _view: Date;
    /** День с фокусом клавиатуры: по нему ходят стрелки. */
    _focus: Date;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    willUpdate(changed: Map<PropertyKey, unknown>): void;
    firstUpdated(): void;
    updated(changed: Map<PropertyKey, unknown>): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-date-picker.d.ts.map