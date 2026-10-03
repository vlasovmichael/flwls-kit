import { LitElement, css, html } from 'lit';
import './h-icon.js';
let disclosureId = 0;
/**
 * Раскрывающийся блок показывает дополнительное содержание по запросу.
 */
export class HDisclosure extends LitElement {
    static properties = {
        open: { type: Boolean, reflect: true },
        disabled: { type: Boolean, reflect: true },
    };
    // Заголовок и содержимое — одна карточка. Высота едет через grid-template-rows 0fr → 1fr:
    // плавно, без замеров в JS, а отступы во внутреннем блоке сжимаются вместе с ним.
    static styles = css `
    :host {
      display: block;
      overflow: hidden;
      border: var(--border-thin) solid var(--rule);
      border-radius: var(--radius-sm);
      background: var(--panel);
      color: var(--ink);
      font-family: var(--sans);
    }

    button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      min-height: calc(var(--space-8) + var(--space-2));
      padding: var(--space-2) var(--space-4);
      border: 0;
      background: transparent;
      color: var(--ink);
      cursor: pointer;
      font: inherit;
      font-size: var(--text-base);
      font-weight: 500;
      text-align: left;
      transition: background-color 140ms ease;
    }

    button:hover:not(:disabled) {
      background: var(--panel-raised);
    }

    button:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    button:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: -2px;
      border-radius: var(--radius-sm);
    }

    .indicator {
      flex: 0 0 auto;
      margin-left: var(--space-3);
      color: var(--ink-3);
      transition: transform 280ms var(--spring);
    }

    :host([open]) .indicator {
      transform: rotate(180deg);
    }

    .region {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    :host([open]) .region {
      grid-template-rows: 1fr;
    }

    .clip {
      min-height: 0;
      overflow: hidden;
    }

    .body {
      padding: 0 var(--space-4) var(--space-4);
      color: var(--ink-2);
      font-size: var(--text-body);
      line-height: 1.5;
      opacity: 0;
      transform: translateY(-4px);
      transition:
        opacity 220ms ease,
        transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    :host([open]) .body {
      opacity: 1;
      transform: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .indicator,
      .region,
      .body {
        transition: none;
      }
    }
  `;
    #regionId = `h-disclosure-region-${String(disclosureId += 1)}`;
    #buttonId = `h-disclosure-button-${String(disclosureId)}`;
    constructor() {
        super();
        this.open = false;
        this.disabled = false;
    }
    /** Переключаем состояние только по действию пользователя. */
    #toggle() {
        if (this.disabled) {
            return;
        }
        this.open = !this.open;
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: { open: this.open },
        }));
    }
    render() {
        return html `
      <button
        id=${this.#buttonId}
        type="button"
        aria-controls=${this.#regionId}
        aria-expanded=${String(this.open)}
        ?disabled=${this.disabled}
        @click=${this.#toggle}
      >
        <slot name="summary">Details</slot>
        <h-icon class="indicator" name="chevron-down"></h-icon>
      </button>
      <div
        id=${this.#regionId}
        class="region"
        role="region"
        aria-labelledby=${this.#buttonId}
        ?inert=${!this.open}
      >
        <div class="clip"><div class="body"><slot></slot></div></div>
      </div>
    `;
    }
}
customElements.define('h-disclosure', HDisclosure);
