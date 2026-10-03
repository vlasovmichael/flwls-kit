import { LitElement, css, html } from 'lit';

export type FieldSize = 'sm' | 'md' | 'lg';

type ControlElement = HTMLInputElement | HTMLTextAreaElement;

/** Поле собирает подпись, нативный контрол и служебный текст в доступную группу. */
export class HField extends LitElement {
  static formAssociated = true;

  static properties = {
    value: { type: String },
    name: { type: String },
    label: { type: String },
    description: { type: String },
    error: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean, reflect: true },
    readonly: { type: Boolean, reflect: true },
    required: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    type: { type: String },
    inputmode: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--ink);
      font-family: var(--sans);
    }

    label {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .label {
      font-size: var(--text-small);
      font-weight: 500;
    }

    .control {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border: var(--border-thin) solid var(--rule-strong);
      border-radius: var(--radius-sm);
      background: var(--panel);
    }

    .control:focus-within {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: var(--space-1);
    }

    :host([error]) .control {
      border-color: var(--loss);
    }

    input,
    textarea {
      min-width: 0;
      width: 100%;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--ink);
      font: inherit;
      font-size: var(--text-base);
    }

    textarea {
      min-height: calc(var(--space-10) + var(--space-10));
      resize: vertical;
    }

    input::placeholder,
    textarea::placeholder {
      color: var(--ink-3);
    }

    input:disabled,
    textarea:disabled {
      cursor: not-allowed;
    }

    :host([disabled]) {
      opacity: var(--opacity-disabled);
    }

    .description {
      color: var(--ink-2);
      font-size: var(--text-small);
    }

    .error {
      color: var(--loss);
      font-size: var(--text-small);
    }

    .description:empty,
    .error:empty {
      display: none;
    }

    :host([size='sm']) .control {
      padding: var(--space-1) var(--space-2);
    }

    :host([size='sm']) input,
    :host([size='sm']) textarea {
      font-size: var(--text-small);
    }

    :host([size='lg']) .control {
      padding: var(--space-3) var(--space-4);
    }

    :host([size='lg']) input,
    :host([size='lg']) textarea {
      font-size: var(--text-lead);
    }
  `;

  declare value: string;
  declare name: string;
  declare label: string;
  declare description: string;
  declare error: string;
  declare placeholder: string;
  declare disabled: boolean;
  declare readonly: boolean;
  declare required: boolean;
  declare size: FieldSize;
  declare type: string;
  declare inputmode: string;

  #internals: ElementInternals | null = null;

  #uid = `field-${Math.random().toString(36).slice(2, 8)}`;

  constructor() {
    super();
    this.value = '';
    this.name = '';
    this.label = '';
    this.description = '';
    this.error = '';
    this.placeholder = '';
    this.disabled = false;
    this.readonly = false;
    this.required = false;
    this.size = 'md';
    this.type = 'text';
    this.inputmode = '';

    if ('attachInternals' in this) {
      this.#internals = this.attachInternals();
    }
  }

  updated() {
    this.#internals?.setFormValue(this.disabled ? null : this.value);
  }

  /** Форма выключает контрол через platform callback. */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  protected renderControl() {
    const describedBy = this.error ? `${this.#uid}-error` : `${this.#uid}-description`;

    return html`
      <input
        .value=${this.value}
        name=${this.name}
        type=${this.type}
        inputmode=${this.inputmode || null}
        placeholder=${this.placeholder}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?required=${this.required}
        aria-invalid=${this.error ? 'true' : 'false'}
        aria-describedby=${this.description || this.error ? describedBy : null}
        @input=${this.#input}
      >
    `;
  }

  #input(event: InputEvent) {
    this.value = (event.currentTarget as ControlElement).value;
  }

  protected get descriptionId() {
    return `${this.#uid}-description`;
  }

  protected get errorId() {
    return `${this.#uid}-error`;
  }

  render() {
    return html`
      <label>
        <span class="label"><slot name="label">${this.label}</slot></span>
        <span class="control">
          <slot name="prefix"></slot>
          ${this.renderControl()}
          <slot name="suffix"></slot>
        </span>
        <span id=${this.descriptionId} class="description">
          <slot name="description">${this.description}</slot>
        </span>
        <span id=${this.errorId} class="error">
          <slot name="error">${this.error}</slot>
        </span>
      </label>
    `;
  }
}

customElements.define('h-field', HField);

/** Многострочный вариант сохраняет те же свойства и нативные события поля. */
export class HTextarea extends HField {
  protected override renderControl() {
    const describedBy = this.error ? this.errorId : this.descriptionId;

    return html`
      <textarea
        .value=${this.value}
        name=${this.name}
        inputmode=${this.inputmode || null}
        placeholder=${this.placeholder}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?required=${this.required}
        aria-invalid=${this.error ? 'true' : 'false'}
        aria-describedby=${this.description || this.error ? describedBy : null}
        @input=${this.#inputTextarea}
      ></textarea>
    `;
  }

  #inputTextarea(event: InputEvent) {
    this.value = (event.currentTarget as HTMLTextAreaElement).value;
  }

}

customElements.define('h-textarea', HTextarea);
