import { LitElement, css, html } from 'lit';

export type ButtonVariant =
  | 'neutral'
  | 'primary'
  | 'danger'
  | 'ghost'
  | 'positive'
  | 'negative';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

/** Кнопка сохраняет нативную семантику и связывается с ближайшей формой. */
export class HButton extends LitElement {
  static formAssociated = true;

  static properties = {
    variant: { type: String, reflect: true },
    size: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    loading: { type: Boolean, reflect: true },
    block: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
  };

  static styles = [css`
    :host {
      display: inline-block;
    }

    :host([block]) {
      display: block;
    }

    button {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      min-height: calc(var(--space-6) + var(--space-3));
      padding: var(--space-2) var(--space-4);
      border: var(--border-thin) solid var(--rule-strong);
      border-radius: var(--radius-pill);
      background: var(--panel);
      color: var(--ink);
      cursor: pointer;
      font-family: var(--sans);
      font-size: var(--text-base);
      font-weight: 500;
      line-height: 1;
    }

    :host([size='sm']) button {
      min-height: var(--space-6);
      padding: var(--space-1) var(--space-3);
      font-size: var(--text-small);
    }

    :host([size='lg']) button {
      min-height: calc(var(--space-8) + var(--space-2));
      padding: var(--space-3) var(--space-5);
      font-size: var(--text-lead);
    }

    :host([block]) button {
      width: 100%;
    }

    :host([variant='primary']) button {
      border-color: var(--accent);
      background: var(--accent);
      color: var(--accent-ink);
    }

    :host([variant='danger']) button,
    :host([variant='negative']) button {
      border-color: var(--loss);
      background: var(--panel);
      color: var(--loss);
    }

    :host([variant='positive']) button {
      border-color: var(--gain);
      background: var(--panel);
      color: var(--gain);
    }

    :host([variant='ghost']) button {
      border-color: transparent;
      background: transparent;
      color: var(--ink-2);
    }

    button:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    button:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: var(--space-1);
    }

    .spinner {
      width: var(--space-4);
      height: var(--space-4);
      box-sizing: border-box;
      border: var(--border-thick) solid currentColor;
      border-right-color: transparent;
      border-radius: var(--radius-pill);
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(1turn);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation: none;
      }
    }
  `];

  declare variant: ButtonVariant;
  declare size: ButtonSize;
  declare disabled: boolean;
  declare loading: boolean;
  declare block: boolean;
  declare type: ButtonType;

  #internals: ElementInternals | null = null;

  constructor() {
    super();
    this.variant = 'neutral';
    this.size = 'md';
    this.disabled = false;
    this.loading = false;
    this.block = false;
    this.type = 'button';

    if ('attachInternals' in this) {
      this.#internals = this.attachInternals();
    }
  }

  /** Браузер сообщает form-associated состоянию доступность контрола. */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  #submitForm(event: MouseEvent) {
    if (this.type === 'button') {
      return;
    }

    event.preventDefault();
    const form = this.#internals?.form ?? this.closest('form');

    if (!form) {
      return;
    }

    if (this.type === 'reset') {
      form.reset();
      return;
    }

    form.requestSubmit();
  }

  protected onClick(event: MouseEvent) {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.#submitForm(event);
  }

  protected renderButton(content: unknown) {
    return html`
      <button
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loading ? 'true' : 'false'}
        @click=${(event: MouseEvent) => {
          this.onClick(event);
        }}
      >
        ${content}
      </button>
    `;
  }

  render() {
    const content = html`
      <slot name="icon-start"></slot>
      ${this.loading ? html`<span class="spinner" aria-label="Loading"></span>` : null}
      <slot></slot>
      <slot name="icon-end"></slot>
    `;

    return this.renderButton(content);
  }
}

customElements.define('h-button', HButton);

/** Иконка-кнопка требует текстовую метку, доступную программе чтения. */
export class HIconButton extends HButton {
  static properties = {
    ...HButton.properties,
    label: { type: String },
  };

  static styles = [
    ...HButton.styles,
    css`
      button {
        width: calc(var(--space-6) + var(--space-3));
        padding: var(--space-2);
      }

      :host([size='sm']) button {
        width: var(--space-6);
        padding: var(--space-1);
      }

      :host([size='lg']) button {
        width: calc(var(--space-8) + var(--space-2));
        padding: var(--space-3);
      }
    `,
  ];

  declare label: string;

  constructor() {
    super();
    this.label = '';
  }

  render() {
    const content = this.loading
      ? html`<span class="spinner" aria-label="Loading"></span>`
      : html`<slot></slot>`;

    return html`
      <button
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        aria-label=${this.label}
        aria-busy=${this.loading ? 'true' : 'false'}
        @click=${(event: MouseEvent) => {
          this.onClick(event);
        }}
      >
        ${content}
      </button>
    `;
  }
}

customElements.define('h-icon-button', HIconButton);
