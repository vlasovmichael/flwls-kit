import { LitElement, css, html, nothing } from 'lit';
import './h-icon.js';

/** Поле поиска: лупа, крестик очистки, Escape стирает. Проект слушает `input` и читает `value`. */
export class HSearch extends LitElement {
  static properties = {
    value: { type: String },
    label: { type: String },
    placeholder: { type: String },
    size: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-block;
      width: 16rem;
      max-width: 100%;
      font-family: var(--sans);
    }

    .box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .glass {
      position: absolute;
      left: var(--space-3);
      color: var(--ink-3);
      pointer-events: none;
    }

    input {
      box-sizing: border-box;
      width: 100%;
      min-height: calc(var(--space-6) + var(--space-3));
      padding: 0 calc(var(--space-8) + var(--space-1)) 0 calc(var(--space-8) + var(--space-1));
      border: var(--border-thin) solid var(--ink-3);
      border-radius: var(--radius-pill);
      background: var(--panel);
      color: var(--ink);
      font: var(--text-base) var(--sans);
      transition: border-color 160ms ease;
    }

    :host([size='sm']) input {
      min-height: var(--space-8);
      font-size: var(--text-small);
    }

    input::placeholder {
      color: var(--ink-3);
    }

    input:hover {
      border-color: var(--ink-2);
    }

    input:focus-visible {
      border-color: var(--accent);
      outline: var(--border-thin) solid var(--accent);
    }

    /* Свой крестик вместо браузерного: у WebKit он своего цвета и размера. */
    input::-webkit-search-cancel-button {
      appearance: none;
    }

    input:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    .clear {
      position: absolute;
      right: var(--space-1);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--space-8);
      height: var(--space-8);
      padding: 0;
      border: 0;
      border-radius: var(--radius-pill);
      background: transparent;
      color: var(--ink-3);
      cursor: pointer;
    }

    :host([size='sm']) .clear {
      width: var(--space-6);
      height: var(--space-6);
    }

    .clear:hover {
      background: var(--sheen);
      color: var(--ink);
    }

    .clear:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: -2px;
    }

    @media (prefers-reduced-motion: reduce) {
      input {
        transition: none;
      }
    }
  `;

  declare value: string;

  declare label: string;

  declare placeholder: string;

  declare size: 'sm' | 'md';

  declare disabled: boolean;

  constructor() {
    super();
    this.value = '';
    this.label = 'Search';
    this.placeholder = 'Search';
    this.size = 'md';
    this.disabled = false;
  }

  get #input() {
    return this.renderRoot.querySelector('input');
  }

  focus() {
    this.#input?.focus();
  }

  /** События как у нативного поля: значение читается из `value` хоста. */
  #emit(type: 'input' | 'search') {
    this.dispatchEvent(new Event(type, { bubbles: true, composed: true }));
  }

  #clear() {
    this.value = '';
    this.#emit('input');
    this.#input?.focus();
  }

  // Нативный input всплывает сам и composed: хост к этому моменту уже знает новое значение.
  #onInput = (event: Event) => {
    this.value = (event.target as HTMLInputElement).value;
  };

  #onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') this.#emit('search');
    if (event.key === 'Escape' && this.value) {
      event.preventDefault();
      event.stopPropagation();
      this.#clear();
    }
  };

  render() {
    return html`
      <div class="box">
        <h-icon class="glass" name="search" aria-hidden="true"></h-icon>
        <input
          type="search"
          aria-label=${this.label}
          placeholder=${this.placeholder}
          autocomplete="off"
          spellcheck="false"
          .value=${this.value}
          ?disabled=${this.disabled}
          @input=${this.#onInput}
          @keydown=${this.#onKeyDown}
        />
        ${this.value && !this.disabled
          ? html`<button type="button" class="clear" aria-label="Clear search" @click=${() => {
              this.#clear();
            }}>
              <h-icon name="x" size="sm" aria-hidden="true"></h-icon>
            </button>`
          : nothing}
      </div>
    `;
  }
}

customElements.define('h-search', HSearch);
