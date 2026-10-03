import { LitElement, css, html } from 'lit';

export type RadioGroupSize = 'sm' | 'md' | 'lg';

export type RadioGroupOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

let radioGroupId = 0;

/** Группа радио выбирает один вариант. */
export class HRadioGroup extends LitElement {
  static formAssociated = true;

  static properties = {
    value: { type: String },
    options: { attribute: false },
    name: { type: String, reflect: true },
    label: { type: String },
    description: { type: String },
    error: { type: String },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--ink);
      font-family: var(--sans);
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .label {
      font-size: var(--text-small);
      font-weight: 500;
    }

    .group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    button {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--ink);
      cursor: pointer;
      font: inherit;
      font-size: var(--text-base);
      text-align: left;
    }

    .indicator {
      box-sizing: border-box;
      flex: 0 0 auto;
      width: var(--space-5);
      height: var(--space-5);
      border: var(--border-thin) solid var(--rule-strong);
      border-radius: var(--radius-pill);
      background: var(--panel);
    }

    button[aria-checked='true'] .indicator {
      border: var(--border-thick) solid var(--accent);
      background: var(--panel);
      box-shadow: inset 0 0 0 var(--space-1) var(--accent);
    }

    button:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    button:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: var(--space-1);
    }

    .description,
    .error {
      font-size: var(--text-small);
    }

    .description {
      color: var(--ink-2);
    }

    .error {
      color: var(--loss);
    }

    .description:empty,
    .error:empty {
      display: none;
    }

    :host([size='sm']) button {
      font-size: var(--text-small);
    }

    :host([size='sm']) .indicator {
      width: var(--space-4);
      height: var(--space-4);
    }

    :host([size='lg']) button {
      font-size: var(--text-lead);
    }

    :host([size='lg']) .indicator {
      width: var(--space-6);
      height: var(--space-6);
    }
  `;

  declare value: string;
  declare options: RadioGroupOption[];
  declare name: string;
  declare label: string;
  declare description: string;
  declare error: string;
  declare disabled: boolean;
  declare required: boolean;
  declare size: RadioGroupSize;

  #defaultValue = '';

  #descriptionId = `h-radio-description-${String(radioGroupId += 1)}`;

  #errorId = `h-radio-error-${String(radioGroupId)}`;

  #internals: ElementInternals | null = null;

  constructor() {
    super();
    this.value = '';
    this.options = [];
    this.name = '';
    this.label = '';
    this.description = '';
    this.error = '';
    this.disabled = false;
    this.required = false;
    this.size = 'md';

    if ('attachInternals' in this) {
      this.#internals = this.attachInternals();
    }
  }

  protected firstUpdated() {
    this.#defaultValue = this.value;
    this.#syncFormState();
  }

  protected updated() {
    this.#syncFormState();
  }

  /** Браузер сообщает, что fieldset стал недоступен. */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  /** Сброс формы возвращает исходное значение. */
  formResetCallback() {
    this.value = this.#defaultValue;
  }

  /** Новый выбор всплывает как composed change. */
  #select(option: RadioGroupOption) {
    if (this.disabled || option.disabled || this.value === option.value) {
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

  /** Стрелки обходят доступные варианты. */
  #move(option: RadioGroupOption, direction: number) {
    const available = this.options.filter((item) => !item.disabled);
    const current = available.indexOf(option);

    if (this.disabled || current === -1 || available.length === 0) {
      return;
    }

    const next = (current + direction + available.length) % available.length;
    const selected = available[next];
    this.#select(selected);
    void this.updateComplete.then(() => {
      this.#buttonFor(selected.value)?.focus();
    });
  }

  /** Home и End выбирают крайнее доступное радио. */
  #selectEdge(last: boolean) {
    const available = this.options.filter((item) => !item.disabled);
    const option = available.at(last ? -1 : 0);

    if (!option || this.disabled) {
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

  #keyDown(event: KeyboardEvent, option: RadioGroupOption) {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.#move(option, 1);
        return;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.#move(option, -1);
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

  #syncFormState() {
    this.#internals?.setFormValue(this.value || null);

    if (this.required && !this.value) {
      this.#internals?.setValidity({ valueMissing: true }, 'Choose an option.');
      return;
    }

    this.#internals?.setValidity({});
  }

  render() {
    const describedBy = this.error
      ? this.#errorId
      : this.description
        ? this.#descriptionId
        : null;

    return html`
      <span class="field">
        <span class="label">${this.label}</span>
        <span
          class="group"
          role="radiogroup"
          aria-label=${this.label}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-describedby=${describedBy}
        >
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
                <span class="indicator" aria-hidden="true"></span>
                <span>${option.label}</span>
              </button>
            `;
          })}
        </span>
        <span id=${this.#descriptionId} class="description">${this.description}</span>
        <span id=${this.#errorId} class="error">${this.error}</span>
      </span>
    `;
  }
}

customElements.define('h-radio-group', HRadioGroup);
