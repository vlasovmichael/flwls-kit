import { LitElement, css, html } from 'lit';
import './h-icon.js';
/** Тег хранит выбранное значение. */
export class HTag extends LitElement {
    static properties = {
        tone: { type: String, reflect: true },
        removable: { type: Boolean, reflect: true },
        label: { type: String },
    };
    static styles = css `
    :host {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      gap: var(--space-1);
      min-height: var(--space-6);
      padding: var(--space-1) var(--space-2) var(--space-1) var(--space-3);
      border: var(--border-thin) solid var(--rule-strong);
      border-radius: var(--radius-pill);
      background: var(--panel-raised);
      color: var(--ink);
      font-family: var(--mono);
      font-size: var(--text-small);
      line-height: 1;
      white-space: nowrap;
    }

    :host([tone='info']) {
      border-color: var(--accent);
      background: var(--wash);
    }

    :host([tone='success']) {
      border-color: var(--gain);
      background: var(--gain-wash);
    }

    :host([tone='warning']) {
      border-color: var(--caution);
      background: var(--caution-wash);
    }

    :host([tone='error']) {
      border-color: var(--loss);
      background: var(--loss-wash);
    }

    .content {
      min-width: 0;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--space-4);
      height: var(--space-4);
      padding: 0;
      border: 0;
      border-radius: var(--radius-pill);
      background: transparent;
      color: currentColor;
      cursor: pointer;
      font: inherit;
      font-size: var(--text-base);
      line-height: 1;
    }

    button:hover {
      background: var(--panel);
    }

    button:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: var(--space-1);
    }
  `;
    constructor() {
        super();
        this.tone = 'neutral';
        this.removable = false;
        this.label = '';
    }
    /** Удаление всплывает к владельцу списка фильтров. */
    #remove() {
        this.dispatchEvent(new CustomEvent('remove', {
            bubbles: true,
            composed: true,
        }));
    }
    render() {
        const removeLabel = this.label ? `Remove ${this.label}` : 'Remove tag';
        return html `
      <slot name="prefix"></slot>
      <span class="content"><slot>${this.label}</slot></span>
      ${this.removable
            ? html `
            <button
              type="button"
              aria-label=${removeLabel}
              @click=${this.#remove}
            >
              <h-icon name="x"></h-icon>
            </button>
          `
            : null}
    `;
    }
}
customElements.define('h-tag', HTag);
