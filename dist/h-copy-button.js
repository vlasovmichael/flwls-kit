import { LitElement, css, html } from 'lit';
import './h-icon.js';
/** Копирует `value` в буфер: иконка на секунду становится галочкой, скринридер слышит «Copied». */
export class HCopyButton extends LitElement {
    static properties = {
        value: { type: String },
        label: { type: String },
        copiedLabel: { type: String, attribute: 'copied-label' },
        _copied: { state: true },
    };
    static styles = css `
    :host {
      display: inline-block;
      vertical-align: middle;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--space-8);
      height: var(--space-8);
      padding: 0;
      border: var(--border-thin) solid transparent;
      border-radius: var(--radius-pill);
      background: transparent;
      color: var(--ink-3);
      cursor: pointer;
      transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
    }

    button:hover {
      border-color: var(--rule);
      background: var(--sheen);
      color: var(--ink);
    }

    button:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: 2px;
    }

    button.is-copied {
      color: var(--data);
    }

    .status {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    @media (prefers-reduced-motion: reduce) {
      button {
        transition: none;
      }
    }
  `;
    #timer = 0;
    constructor() {
        super();
        this.value = '';
        this.label = 'Copy';
        this.copiedLabel = 'Copied';
        this._copied = false;
    }
    disconnectedCallback() {
        clearTimeout(this.#timer);
        super.disconnectedCallback();
    }
    async #copy() {
        try {
            await navigator.clipboard.writeText(this.value);
        }
        catch {
            this.dispatchEvent(new CustomEvent('copy-error', { bubbles: true, composed: true }));
            return;
        }
        this._copied = true;
        this.dispatchEvent(new CustomEvent('copy', { bubbles: true, composed: true, detail: { value: this.value } }));
        clearTimeout(this.#timer);
        this.#timer = window.setTimeout(() => {
            this._copied = false;
        }, 1500);
    }
    render() {
        return html `
      <button
        type="button"
        class=${this._copied ? 'is-copied' : ''}
        aria-label=${this.label}
        @click=${() => {
            void this.#copy();
        }}
      >
        <h-icon name=${this._copied ? 'check' : 'copy'} aria-hidden="true"></h-icon>
      </button>
      <span class="status" role="status">${this._copied ? this.copiedLabel : ''}</span>
    `;
    }
}
customElements.define('h-copy-button', HCopyButton);
