import './h-icon.js';
import { LitElement } from 'lit';
export type EmptyStateTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';
/** Пустое состояние объясняет отсутствие данных и даёт следующий шаг.
 *
 * Иконка и действие передаются слотами, чтобы состояние подходило разным разделам.
 */
export declare class HEmptyState extends LitElement {
    #private;
    static properties: {
        title: {
            type: StringConstructor;
        };
        description: {
            type: StringConstructor;
        };
        tone: {
            type: StringConstructor;
            reflect: boolean;
        };
    };
    static styles: import("lit").CSSResult;
    title: string;
    description: string;
    tone: EmptyStateTone;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-empty-state.d.ts.map