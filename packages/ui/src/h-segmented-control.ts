import { LitElement, css, html } from 'lit';

export type SegmentedControlSize = 'sm' | 'md' | 'lg';

export type SegmentedControlOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

/** Группа сегментов выбирает ровно одно значение из небольшого списка. */
export class HSegmentedControl extends LitElement {
  static properties = {
    value: { type: String },
    options: { attribute: false },
    label: { type: String },
    disabled: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    stretch: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-block;
      font-family: var(--sans);
    }

    :host([stretch]) {
      display: block;
    }

    .group {
      display: inline-flex;
      gap: var(--space-1);
      padding: var(--space-1);
      border: var(--border-thin) solid var(--rule);
      border-radius: var(--radius);
      background: var(--panel-sunk);
    }

    :host([stretch]) .group {
      display: flex;
      width: 100%;
    }

    button {
      min-height: calc(var(--space-6) + var(--space-1));
      padding: var(--space-1) var(--space-3);
      border: var(--border-thin) solid transparent;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--ink-2);
      cursor: pointer;
      font: inherit;
      font-size: var(--text-small);
      font-weight: 500;
      line-height: 1;
    }

    :host([stretch]) button {
      flex: 1 1 0;
    }

    button[aria-checked='true'] {
      border-color: var(--rule-strong);
      background: var(--panel);
      box-shadow: var(--shadow);
      color: var(--ink);
    }

    button:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    button:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: var(--space-1);
    }

    :host([size='sm']) button {
      min-height: var(--space-6);
      padding: var(--space-1) var(--space-2);
      font-size: var(--text-micro);
    }

    :host([size='lg']) button {
      min-height: calc(var(--space-6) + var(--space-4));
      padding: var(--space-2) var(--space-4);
      font-size: var(--text-base);
    }
  `;

  declare value: string;
  declare options: SegmentedControlOption[];
  declare label: string;
  declare disabled: boolean;
  declare size: SegmentedControlSize;
  declare stretch: boolean;

  constructor() {
    super();
    this.value = '';
    this.options = [];
    this.label = 'Options';
    this.disabled = false;
    this.size = 'md';
    this.stretch = false;
  }

  protected updated(changed: Map<PropertyKey, unknown>) {
    if (!changed.has('options') && !changed.has('value')) {
      return;
    }

    if (this.#selectedOption() || this.options.length === 0) {
      return;
    }

    const first = this.options.find((option) => !option.disabled);

    if (first) {
      this.value = first.value;
    }
  }

  /** Возвращает выбранный сегмент только среди доступных вариантов. */
  #selectedOption() {
    return this.options.find((option) => {
      return option.value === this.value && !option.disabled;
    });
  }

  /** Смена уведомляет владельца только о действительно новом выборе. */
  #select(option: SegmentedControlOption) {
    if (this.disabled || option.disabled || option.value === this.value) {
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

  /** Стрелки переходят по кругу, пропуская недоступные сегменты. */
  #move(current: number, direction: number) {
    const available = this.options.filter((option) => !option.disabled);

    if (this.disabled || available.length === 0) {
      return;
    }

    const next = (current + direction + available.length) % available.length;
    const option = available[next];
    this.#select(option);
    void this.updateComplete.then(() => {
      this.#buttonFor(option.value)?.focus();
    });
  }

  /** Home и End сразу выбирают крайний доступный сегмент. */
  #selectEdge(last: boolean) {
    const available = this.options.filter((option) => !option.disabled);
    const option = available.at(last ? -1 : 0);

    if (!option) {
      return;
    }

    this.#select(option);
    void this.updateComplete.then(() => {
      this.#buttonFor(option.value)?.focus();
    });
  }

  #buttonFor(value: string) {
    const buttons = this.shadowRoot?.querySelectorAll<HTMLButtonElement>('button') ?? [];
    return [...buttons].find((button) => button.dataset.value === value);
  }

  #keyDown(event: KeyboardEvent, option: SegmentedControlOption) {
    if (this.disabled || option.disabled) {
      return;
    }

    const current = this.options.filter((item) => !item.disabled).indexOf(option);

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.#move(current, 1);
        return;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.#move(current, -1);
        return;
      case 'Home':
        event.preventDefault();
        this.#selectEdge(false);
        return;
      case 'End':
        event.preventDefault();
        this.#selectEdge(true);
        return;
      default:
        return;
    }
  }

  render() {
    return html`
      <div class="group" role="radiogroup" aria-label=${this.label}>
        ${this.options.map((option) => {
          const selected = option.value === this.value;
          const unavailable = this.disabled || Boolean(option.disabled);

          return html`
            <button
              type="button"
              role="radio"
              data-value=${option.value}
              aria-checked=${String(selected)}
              tabindex=${selected ? '0' : '-1'}
              ?disabled=${unavailable}
              @click=${() => {
                this.#select(option);
              }}
              @keydown=${(event: KeyboardEvent) => {
                this.#keyDown(event, option);
              }}
            >
              ${option.label}
            </button>
          `;
        })}
      </div>
    `;
  }
}

customElements.define('h-segmented-control', HSegmentedControl);
