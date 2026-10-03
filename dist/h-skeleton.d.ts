import { LitElement } from 'lit';
export type SkeletonVariant = 'text' | 'circle' | 'rect' | 'card';
/** Скелетон показывает структуру загрузки, не выдавая её за содержимое.
 *
 * Элемент скрыт от скринридера: он не является данными или сообщением о состоянии.
 */
export declare class HSkeleton extends LitElement {
    #private;
    static properties: {
        variant: {
            type: StringConstructor;
            reflect: boolean;
        };
        width: {
            type: StringConstructor;
        };
        height: {
            type: StringConstructor;
        };
    };
    static styles: import("lit").CSSResult;
    variant: SkeletonVariant;
    width: string;
    height: string;
    constructor();
    updated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=h-skeleton.d.ts.map