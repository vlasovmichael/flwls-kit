import { LitElement, css, html } from 'lit';
import { HDisclosure } from './h-disclosure.js';
/** Аккордеон координирует прямые раскрывающиеся блоки.
 *
 * Все они составляют одну группу.
 */
export class HAccordion extends LitElement {
    static properties = {
        multiple: { type: Boolean, reflect: true },
        label: { type: String },
    };
    static styles = css `
    :host {
      display: block;
    }

    .group {
      display: grid;
      gap: var(--space-2);
    }
  `;
    #observer = new MutationObserver((records) => {
        if (records.some((record) => record.type === 'childList')) {
            this.#enforceSingleOpen();
            return;
        }
        if (!this.multiple) {
            this.#enforceSingleOpen();
        }
    });
    constructor() {
        super();
        this.multiple = false;
        this.label = 'Accordion';
    }
    connectedCallback() {
        super.connectedCallback();
        this.#observer.observe(this, {
            attributes: true,
            attributeFilter: ['open'],
            childList: true,
            subtree: true,
        });
        this.addEventListener('change', this.#onDisclosureChange, true);
        this.addEventListener('keydown', this.#onKeyDown);
        this.#enforceSingleOpen();
    }
    disconnectedCallback() {
        this.#observer.disconnect();
        this.removeEventListener('change', this.#onDisclosureChange, true);
        this.removeEventListener('keydown', this.#onKeyDown);
        super.disconnectedCallback();
    }
    updated(changed) {
        if (changed.has('multiple') && !this.multiple) {
            this.#enforceSingleOpen();
        }
    }
    /** Берём только непосредственных детей.
     *
     * Так вложенные группы не смешиваются.
     */
    #disclosures() {
        return [...this.querySelectorAll(':scope > h-disclosure')];
    }
    /** В одиночном режиме оставляем указанный или последний блок.
     *
     * Остальные открытые блоки закрываем.
     */
    #enforceSingleOpen(active) {
        if (this.multiple) {
            return;
        }
        const open = this.#disclosures().filter((disclosure) => disclosure.open);
        const allowed = active?.open ? active : open.at(-1);
        for (const disclosure of open) {
            if (disclosure !== allowed) {
                disclosure.open = false;
            }
        }
    }
    /** Переводим событие дочернего блока.
     *
     * Группа отправляет единое событие владельцу.
     */
    #onDisclosureChange = (event) => {
        const disclosure = this.#disclosureFromEvent(event);
        if (!disclosure) {
            return;
        }
        event.stopPropagation();
        this.#enforceSingleOpen(disclosure);
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: {
                disclosure,
                open: disclosure.open,
            },
        }));
    };
    /** Находим раскрытие в composed path.
     *
     * Кнопка находится в Shadow DOM.
     */
    #disclosureFromEvent(event) {
        return event.composedPath().find((node) => {
            return node instanceof HDisclosure && node.parentElement === this;
        });
    }
    /** Стрелки и Home/End переносят фокус.
     *
     * Недоступные заголовки пропускаются.
     */
    #onKeyDown = (event) => {
        const disclosure = this.#disclosureFromEvent(event);
        if (!disclosure || disclosure.disabled) {
            return;
        }
        const available = this.#disclosures().filter((item) => !item.disabled);
        const index = available.indexOf(disclosure);
        if (index < 0) {
            return;
        }
        let next;
        if (event.key === 'ArrowDown') {
            next = available[(index + 1) % available.length];
        }
        else if (event.key === 'ArrowUp') {
            next = available[(index - 1 + available.length) % available.length];
        }
        else if (event.key === 'Home') {
            next = available[0];
        }
        else if (event.key === 'End') {
            next = available.at(-1);
        }
        else {
            return;
        }
        event.preventDefault();
        this.#buttonFor(next)?.focus();
    };
    /** Нативная кнопка нужна для навигации стрелками.
     *
     * Пользователю не приходится задавать tabindex вручную.
     */
    #buttonFor(disclosure) {
        return disclosure?.shadowRoot?.querySelector('button');
    }
    render() {
        return html `
      <div class="group" role="group" aria-label=${this.label || 'Accordion'}>
        <slot></slot>
      </div>
    `;
    }
}
customElements.define('h-accordion', HAccordion);
