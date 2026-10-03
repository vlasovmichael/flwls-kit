import { LitElement, css, html } from 'lit';
import './h-icon.js';
/**
 * Номера страниц с разрывами. Число слотов постоянно (2 × siblings + 5), чтобы ряд
 * не менял ширину при листании; разрыв ставится, только если прячет больше одной страницы.
 */
export function pageSlots(page, pages, siblings = 1) {
    const slots = siblings * 2 + 5;
    const all = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
    if (pages <= slots)
        return all(1, pages);
    const left = Math.max(page - siblings, 1);
    const right = Math.min(page + siblings, pages);
    const leftGap = left > 3;
    const rightGap = right < pages - 2;
    const edge = 3 + siblings * 2;
    if (!leftGap)
        return [...all(1, edge), 'gap', pages];
    if (!rightGap)
        return [1, 'gap', ...all(pages - edge + 1, pages)];
    return [1, 'gap', ...all(left, right), 'gap', pages];
}
/** Листалка страниц таблицы или списка. Хранит только номер страницы, данные грузит проект. */
export class HPagination extends LitElement {
    static properties = {
        page: { type: Number, reflect: true },
        pages: { type: Number },
        siblings: { type: Number },
        size: { type: String, reflect: true },
        compact: { type: Boolean, reflect: true },
        label: { type: String },
    };
    static styles = css `
    :host {
      display: block;
      color: var(--ink);
      font-family: var(--sans);
    }

    ol {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-1);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    button,
    .gap {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: calc(var(--space-6) + var(--space-3));
      height: calc(var(--space-6) + var(--space-3));
      padding: 0 var(--space-2);
      font: 500 var(--text-base) / 1 var(--sans);
      font-variant-numeric: tabular-nums;
    }

    :host([size='sm']) button,
    :host([size='sm']) .gap {
      min-width: var(--space-6);
      height: var(--space-6);
      padding: 0 var(--space-1);
      font-size: var(--text-small);
    }

    button {
      border: var(--border-thin) solid transparent;
      border-radius: var(--radius-pill);
      background: transparent;
      color: var(--ink-2);
      cursor: pointer;
      transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
    }

    button:hover:not(:disabled, [aria-current='page']) {
      border-color: var(--rule);
      background: var(--sheen);
      color: var(--ink);
    }

    button:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: 2px;
    }

    button[aria-current='page'] {
      background: var(--wash);
      color: var(--accent);
      font-weight: 600;
      cursor: default;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    .gap {
      color: var(--ink-3);
    }

    .status {
      padding: 0 var(--space-2);
      color: var(--ink-2);
      font-size: var(--text-base);
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    :host([size='sm']) .status {
      font-size: var(--text-small);
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `;
    constructor() {
        super();
        this.page = 1;
        this.pages = 1;
        this.siblings = 1;
        this.size = 'md';
        this.compact = false;
        this.label = 'Pagination';
    }
    get #current() {
        return Math.min(Math.max(1, Math.round(this.page)), Math.max(1, this.pages));
    }
    #go(next) {
        const page = Math.min(Math.max(1, next), this.pages);
        if (page === this.#current)
            return;
        this.page = page;
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { page } }));
    }
    #arrow(direction) {
        const prev = direction === 'prev';
        const target = this.#current + (prev ? -1 : 1);
        const disabled = prev ? this.#current <= 1 : this.#current >= this.pages;
        return html `
      <li>
        <button
          type="button"
          aria-label=${prev ? 'Previous page' : 'Next page'}
          ?disabled=${disabled}
          @click=${() => {
            this.#go(target);
        }}
        >
          <h-icon name=${prev ? 'chevron-left' : 'chevron-right'} aria-hidden="true"></h-icon>
        </button>
      </li>
    `;
    }
    #number(page) {
        const current = page === this.#current;
        return html `
      <li>
        <button
          type="button"
          aria-label=${`Page ${String(page)}`}
          aria-current=${current ? 'page' : 'false'}
          @click=${() => {
            this.#go(page);
        }}
        >
          ${page}
        </button>
      </li>
    `;
    }
    render() {
        if (this.pages <= 1)
            return html ``;
        const middle = this.compact
            ? html `<li class="status" aria-live="polite">
          Page ${this.#current} of ${this.pages}
        </li>`
            : pageSlots(this.#current, this.pages, this.siblings).map((slot) => slot === 'gap'
                ? html `<li class="gap" aria-hidden="true">…</li>`
                : this.#number(slot));
        return html `
      <nav aria-label=${this.label}>
        <ol>
          ${this.#arrow('prev')} ${middle} ${this.#arrow('next')}
        </ol>
      </nav>
    `;
    }
}
customElements.define('h-pagination', HPagination);
