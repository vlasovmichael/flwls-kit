import { LitElement, css, html } from 'lit';

export type CheckControlSize = 'sm' | 'md' | 'lg';

let controlId = 0;

/** Общая основа связывает переключатель с формой. */
abstract class HCheckControl extends LitElement {
  static formAssociated = true;

  static properties = {
    checked: { type: Boolean, reflect: true },
    value: { type: String },
    name: { type: String, reflect: true },
    label: { type: String },
    description: { type: String },
    error: { type: String },
    disabled: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
  };

  static styles = [css`
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

    .control {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
      cursor: pointer;
    }

    input {
      flex: 0 0 auto;
      width: var(--space-5);
      height: var(--space-5);
      margin: 0;
      accent-color: var(--accent);
      cursor: pointer;
    }

    input:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: var(--space-1);
    }

    input:disabled,
    :host([disabled]) .control {
      cursor: not-allowed;
    }

    input:disabled {
      opacity: var(--opacity-disabled);
    }

    .label {
      padding-top: var(--space-1);
      font-size: var(--text-base);
      line-height: 1.3;
    }

    .description,
    .error {
      padding-left: calc(var(--space-5) + var(--space-2));
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

    :host([size='sm']) input {
      width: var(--space-4);
      height: var(--space-4);
    }

    :host([size='sm']) .label {
      font-size: var(--text-small);
    }

    :host([size='sm']) .description,
    :host([size='sm']) .error {
      padding-left: calc(var(--space-4) + var(--space-2));
    }

    :host([size='lg']) input {
      width: var(--space-6);
      height: var(--space-6);
    }

    :host([size='lg']) .label {
      font-size: var(--text-lead);
    }

    :host([size='lg']) .description,
    :host([size='lg']) .error {
      padding-left: calc(var(--space-6) + var(--space-2));
    }
  `];

  declare checked: boolean;
  declare value: string;
  declare name: string;
  declare label: string;
  declare description: string;
  declare error: string;
  declare disabled: boolean;
  declare required: boolean;
  declare size: CheckControlSize;

  #defaultChecked = false;

  #descriptionId = `h-check-description-${String(controlId += 1)}`;

  #errorId = `h-check-error-${String(controlId)}`;

  #internals: ElementInternals | null = null;

  constructor() {
    super();
    this.checked = false;
    this.value = 'on';
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
    this.#defaultChecked = this.checked;
    this.#syncFormState();
  }

  protected updated() {
    this.#syncFormState();
  }

  /** Браузер передаёт form-disabled состояние. */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  /** Сброс формы возвращает исходное состояние. */
  formResetCallback() {
    this.checked = this.#defaultChecked;
  }

  protected get describedBy() {
    if (this.error) {
      return this.#errorId;
    }

    return this.description ? this.#descriptionId : null;
  }

  protected get descriptionId() {
    return this.#descriptionId;
  }

  protected get errorId() {
    return this.#errorId;
  }

  /** Нативное change обновляет хост и выходит из тени. */
  protected change(event: Event) {
    this.checked = (event.currentTarget as HTMLInputElement).checked;
    this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  }

  protected renderMessages() {
    return html`
      <span id=${this.descriptionId} class="description">${this.description}</span>
      <span id=${this.errorId} class="error">${this.error}</span>
    `;
  }

  #syncFormState() {
    this.#internals?.setFormValue(this.checked ? this.value : null);

    if (this.required && !this.checked) {
      this.#internals?.setValidity({ valueMissing: true }, 'Select this option.');
      return;
    }

    this.#internals?.setValidity({});
  }
}

/** Чекбокс выбирает независимую опцию. */
export class HCheckbox extends HCheckControl {
  static properties = {
    ...HCheckControl.properties,
    indeterminate: { type: Boolean, reflect: true },
  };

  declare indeterminate: boolean;

  constructor() {
    super();
    this.indeterminate = false;
  }

  protected updated() {
    super.updated();
    const input = this.shadowRoot?.querySelector('input');

    if (input) {
      input.indeterminate = this.indeterminate;
    }
  }

  /** Действие пользователя снимает indeterminate. */
  protected override change(event: Event) {
    this.indeterminate = false;
    super.change(event);
  }

  render() {
    return html`
      <span class="field">
        <label class="control">
          <input
            type="checkbox"
            .checked=${this.checked}
            name=${this.name}
            value=${this.value}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-invalid=${this.error ? 'true' : 'false'}
            aria-describedby=${this.describedBy}
            @change=${(event: Event) => {
              this.change(event);
            }}
          >
          <span class="label">${this.label}</span>
        </label>
        ${this.renderMessages()}
      </span>
    `;
  }
}

customElements.define('h-checkbox', HCheckbox);

/** Переключатель сообщает бинарное состояние. */
export class HSwitch extends HCheckControl {
  static styles = [
    ...HCheckControl.styles,
    css`
      input {
        appearance: none;
        width: calc(var(--space-8) + var(--space-2));
        height: var(--space-5);
        border: var(--border-thin) solid var(--rule-strong);
        border-radius: var(--radius-pill);
        background: var(--panel-sunk);
        transition: background 150ms var(--spring);
      }

      input::after {
        display: block;
        width: calc(var(--space-3) + var(--space-1));
        height: calc(var(--space-3) + var(--space-1));
        margin: var(--space-1);
        border-radius: var(--radius-pill);
        background: var(--panel);
        box-shadow: var(--shadow);
        content: '';
        transition: transform 150ms var(--spring);
      }

      input:checked {
        border-color: var(--accent);
        background: var(--accent);
      }

      input:checked::after {
        transform: translateX(var(--space-4));
      }

      :host([size='sm']) input {
        width: calc(var(--space-6) + var(--space-2));
        height: var(--space-4);
      }

      :host([size='sm']) input::after {
        width: var(--space-2);
        height: var(--space-2);
      }

      :host([size='sm']) input:checked::after {
        transform: translateX(var(--space-4));
      }

      :host([size='lg']) input {
        width: calc(var(--space-8) + var(--space-4));
        height: var(--space-6);
      }

      :host([size='lg']) input::after {
        width: var(--space-4);
        height: var(--space-4);
      }

      :host([size='lg']) input:checked::after {
        transform: translateX(calc(var(--space-5) + var(--space-1)));
      }

      @media (prefers-reduced-motion: reduce) {
        input,
        input::after {
          transition: none;
        }
      }
    `,
  ];

  render() {
    return html`
      <span class="field">
        <label class="control">
          <input
            type="checkbox"
            role="switch"
            .checked=${this.checked}
            name=${this.name}
            value=${this.value}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-invalid=${this.error ? 'true' : 'false'}
            aria-describedby=${this.describedBy}
            @change=${(event: Event) => {
              this.change(event);
            }}
          >
          <span class="label">${this.label}</span>
        </label>
        ${this.renderMessages()}
      </span>
    `;
  }
}

customElements.define('h-switch', HSwitch);
