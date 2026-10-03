import { LitElement, css, html } from 'lit';
import './h-icon.js';
/** Левая граница ближайшего предка, который обрезает содержимое по горизонтали. */
function clipLeft(node) {
    for (let parent = node.parentElement; parent; parent = parent.parentElement) {
        if (getComputedStyle(parent).overflowX !== 'visible') {
            return parent.getBoundingClientRect().left;
        }
    }
    return 0;
}
// Вид по умолчанию: компонент в light DOM, поэтому стили кладутся в документ один раз
// под селектор h-select. Проект может переопределить их своими правилами.
const DEFAULT_STYLES = css `
  h-select {
    position: relative;
    display: inline-block;
    font-family: var(--sans);
  }

  h-select .select-button {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    min-width: 9rem;
    min-height: calc(var(--space-6) + var(--space-3));
    padding: 0 var(--space-3) 0 var(--space-4);
    border: var(--border-thin) solid var(--rule);
    border-radius: var(--radius-sm);
    background: var(--panel);
    color: var(--ink);
    font: inherit;
    font-size: var(--text-base);
    cursor: pointer;
    transition: border-color 160ms ease, background 160ms ease;
  }

  h-select .select-button:hover {
    border-color: var(--rule-strong);
    background: var(--panel-raised);
  }

  h-select .select-button:focus-visible {
    outline: var(--border-thick) solid var(--accent);
    outline-offset: 2px;
  }

  h-select .select-button:disabled {
    cursor: not-allowed;
    opacity: var(--opacity-disabled);
  }

  h-select .chevron {
    color: var(--ink-3);
    transition: transform 220ms var(--spring);
  }

  h-select[data-open='true'] .chevron {
    transform: rotate(180deg);
  }

  h-select .select-list {
    position: absolute;
    top: calc(100% + var(--space-1));
    right: 0;
    z-index: var(--layer-popover);
    box-sizing: border-box;
    min-width: 100%;
    width: max-content;
    max-height: 16rem;
    overflow-y: auto;
    margin: 0;
    padding: var(--space-1);
    list-style: none;
    border: var(--border-thin) solid var(--rule);
    border-radius: var(--radius-sm);
    background: var(--panel);
    box-shadow: var(--shadow-float);
    transform-origin: top right;
    animation: h-select-drop 180ms var(--spring);
  }

  h-select .select-list[hidden] {
    display: none;
  }

  h-select.is-up .select-list {
    top: auto;
    bottom: calc(100% + var(--space-1));
    transform-origin: bottom right;
  }

  h-select.is-start .select-list {
    right: auto;
    left: 0;
    transform-origin: top left;
  }

  h-select .select-option {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-radius: calc(var(--radius-sm) - 3px);
    color: var(--ink);
    font-size: var(--text-base);
    white-space: nowrap;
    cursor: pointer;
  }

  h-select .select-option.is-active {
    background: var(--wash);
  }

  h-select .select-option[aria-selected='true'] {
    color: var(--accent);
    font-weight: 500;
  }

  h-select .tick {
    margin-left: auto;
    opacity: 0;
    transition: opacity 120ms ease;
  }

  h-select .select-option[aria-selected='true'] .tick {
    opacity: 1;
  }

  @keyframes h-select-drop {
    from {
      opacity: 0;
      transform: scale(0.96) translateY(-4px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    h-select .select-list,
    h-select .chevron {
      animation: none;
      transition: none;
    }
  }
`;
/** Кладёт стили по умолчанию в документ один раз на страницу. */
function adoptDefaultStyles() {
    const sheet = DEFAULT_STYLES.styleSheet;
    if (!sheet || document.adoptedStyleSheets.includes(sheet))
        return;
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
}
/** Селект использует light DOM, чтобы проекты могли оформлять список в своих слоях. */
export class HSelect extends LitElement {
    static formAssociated = true;
    static properties = {
        options: { attribute: false },
        value: { type: String },
        label: { type: String },
        name: { type: String },
        placeholder: { type: String },
        disabled: { type: Boolean, reflect: true },
    };
    #active = 0;
    #internals = null;
    #open = false;
    #typed = '';
    #typedAt = 0;
    #uid = `select-${Math.random().toString(36).slice(2, 8)}`;
    constructor() {
        super();
        this.options = [];
        this.value = '';
        this.label = '';
        this.name = '';
        this.placeholder = 'Select an option';
        this.disabled = false;
        if ('attachInternals' in this) {
            this.#internals = this.attachInternals();
        }
    }
    createRenderRoot() {
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
        adoptDefaultStyles();
        this.classList.add('select');
        this.dataset.uid = this.#uid;
        document.addEventListener('pointerdown', this.#outside);
    }
    disconnectedCallback() {
        document.removeEventListener('pointerdown', this.#outside);
        super.disconnectedCallback();
    }
    updated(changed) {
        this.#internals?.setFormValue(this.disabled ? null : this.value);
        if (changed.has('options') || changed.has('value')) {
            this.#active = Math.max(0, this.options.findIndex((option) => option.value === this.value));
        }
    }
    /** Форма выключает контрол через platform callback. */
    formDisabledCallback(disabled) {
        this.disabled = disabled;
    }
    #setOpen(next) {
        if (this.disabled) {
            return;
        }
        this.#open = next;
        this.dataset.open = String(next);
        if (next) {
            this.#active = Math.max(0, this.options.findIndex((option) => option.value === this.value));
        }
        this.requestUpdate();
        if (next) {
            void this.#place();
        }
    }
    /** У края экрана или контейнера список разворачивается туда, где есть место. */
    async #place() {
        await this.updateComplete;
        const list = this.querySelector('.select-list');
        if (!list) {
            return;
        }
        this.classList.remove('is-up', 'is-start');
        if (window.innerHeight - list.getBoundingClientRect().bottom < 8) {
            this.classList.add('is-up');
        }
        if (list.getBoundingClientRect().left < clipLeft(this) + 8) {
            this.classList.add('is-start');
        }
        this.#showActive();
    }
    #showActive() {
        this.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
    }
    #choose(index) {
        const option = this.options[index];
        this.#setOpen(false);
        if (option.value === this.value) {
            return;
        }
        this.value = option.value;
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: { value: option.value, option },
        }));
    }
    #move(step) {
        if (!this.#open) {
            this.#setOpen(true);
            return;
        }
        if (this.options.length === 0) {
            return;
        }
        this.#active = (this.#active + step + this.options.length) % this.options.length;
        this.requestUpdate();
        void this.updateComplete.then(() => {
            this.#showActive();
        });
    }
    #outside = (event) => {
        if (this.#open && !this.contains(event.target)) {
            this.#setOpen(false);
        }
    };
    #keyDown = (event) => {
        if (this.disabled) {
            return;
        }
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.#move(1);
                return;
            case 'ArrowUp':
                event.preventDefault();
                this.#move(-1);
                return;
            case 'Home':
                event.preventDefault();
                this.#active = 0;
                this.requestUpdate();
                return;
            case 'End':
                event.preventDefault();
                this.#active = this.options.length - 1;
                this.requestUpdate();
                return;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (this.#open) {
                    this.#choose(this.#active);
                }
                else {
                    this.#setOpen(true);
                }
                return;
            case 'Escape':
            case 'Tab':
                this.#setOpen(false);
                return;
            default:
                break;
        }
        if (event.key.length !== 1) {
            return;
        }
        const now = Date.now();
        this.#typed = now - this.#typedAt < 900 ? this.#typed + event.key : event.key;
        this.#typedAt = now;
        const found = this.options.findIndex((option) => {
            return option.label.toLowerCase().startsWith(this.#typed.toLowerCase());
        });
        if (found < 0) {
            return;
        }
        this.#active = found;
        if (this.#open) {
            this.requestUpdate();
        }
        else {
            this.#choose(found);
        }
    };
    render() {
        const selected = this.options.find((option) => option.value === this.value)?.label;
        const listId = `${this.#uid}-listbox`;
        return html `
      <button
        type="button"
        class="select-button"
        aria-haspopup="listbox"
        aria-expanded=${String(this.#open)}
        aria-controls=${listId}
        aria-label=${this.label || null}
        ?disabled=${this.disabled}
        @click=${() => {
            this.#setOpen(!this.#open);
        }}
        @keydown=${this.#keyDown}
      >
        <span>${selected || this.placeholder}</span>
        <h-icon name="chevron-down" class="icon chevron"></h-icon>
      </button>
      <ul
        id=${listId}
        class="select-list"
        role="listbox"
        ?hidden=${!this.#open}
        aria-activedescendant=${this.#open ? `${this.#uid}-option-${String(this.#active)}` : null}
      >
        ${this.options.map((option, index) => html `
            <li
              class="select-option${index === this.#active ? ' is-active' : ''}"
              role="option"
              aria-selected=${String(option.value === this.value)}
              id=${`${this.#uid}-option-${String(index)}`}
              @mouseenter=${() => {
            this.#active = index;
            this.requestUpdate();
        }}
              @pointerdown=${(event) => {
            event.preventDefault();
            this.#choose(index);
        }}
            >
              ${option.label}
              <h-icon name="check" class="icon tick"></h-icon>
            </li>
          `)}
      </ul>
    `;
    }
}
customElements.define('h-select', HSelect);
