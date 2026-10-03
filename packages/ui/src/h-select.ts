import { LitElement, html } from 'lit';
import './h-icon.js';

export type SelectOption = { label: string; value: string };

/** Левая граница ближайшего предка, который обрезает содержимое по горизонтали. */
function clipLeft(node: HTMLElement) {
  for (let parent = node.parentElement; parent; parent = parent.parentElement) {
    if (getComputedStyle(parent).overflowX !== 'visible') {
      return parent.getBoundingClientRect().left;
    }
  }

  return 0;
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

  declare options: SelectOption[];
  declare value: string;
  declare label: string;
  declare name: string;
  declare placeholder: string;
  declare disabled: boolean;

  #active = 0;

  #internals: ElementInternals | null = null;

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

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.className = 'select';
    this.dataset.uid = this.#uid;
    document.addEventListener('pointerdown', this.#outside);
  }

  disconnectedCallback() {
    document.removeEventListener('pointerdown', this.#outside);
    super.disconnectedCallback();
  }

  updated(changed: Map<PropertyKey, unknown>) {
    this.#internals?.setFormValue(this.disabled ? null : this.value);

    if (changed.has('options') || changed.has('value')) {
      this.#active = Math.max(0, this.options.findIndex((option) => option.value === this.value));
    }
  }

  /** Форма выключает контрол через platform callback. */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  #setOpen(next: boolean) {
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
    const list = this.querySelector<HTMLElement>('.select-list');

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

  #choose(index: number) {
    const option = this.options[index];

    this.#setOpen(false);

    if (option.value === this.value) {
      return;
    }

    this.value = option.value;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: option.value, option },
      }),
    );
  }

  #move(step: number) {
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

  #outside = (event: PointerEvent) => {
    if (this.#open && !this.contains(event.target as Node)) {
      this.#setOpen(false);
    }
  };

  #keyDown = (event: KeyboardEvent) => {
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
        } else {
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
    } else {
      this.#choose(found);
    }
  };

  render() {
    const selected = this.options.find((option) => option.value === this.value)?.label;
    const listId = `${this.#uid}-listbox`;

    return html`
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
        ${this.options.map(
          (option, index) => html`
            <li
              class="select-option${index === this.#active ? ' is-active' : ''}"
              role="option"
              aria-selected=${String(option.value === this.value)}
              id=${`${this.#uid}-option-${String(index)}`}
              @mouseenter=${() => {
                this.#active = index;
                this.requestUpdate();
              }}
              @pointerdown=${(event: PointerEvent) => {
                event.preventDefault();
                this.#choose(index);
              }}
            >
              ${option.label}
              <h-icon name="check" class="icon tick"></h-icon>
            </li>
          `,
        )}
      </ul>
    `;
  }
}

customElements.define('h-select', HSelect);
