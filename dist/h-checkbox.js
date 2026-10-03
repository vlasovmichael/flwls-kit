import { LitElement, css, html } from 'lit';
let controlId = 0;
/** Общая основа связывает переключатель с формой. */
class HCheckControl extends LitElement {
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
    // Нативный input остаётся ради формы и клавиатуры; рисунок — свой, размеры — из переменных.
    static styles = [css `
    :host {
      --box: 18px;
      --gap: var(--space-2);
      display: block;
      color: var(--ink);
      font-family: var(--sans);
    }

    :host([size='sm']) {
      --box: 16px;
    }

    :host([size='lg']) {
      --box: 22px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .control {
      display: inline-flex;
      align-items: center;
      gap: var(--gap);
      width: fit-content;
      cursor: pointer;
    }

    .box {
      position: relative;
      flex: none;
      display: inline-grid;
      width: var(--box-w, var(--box));
      height: var(--box);
    }

    input {
      appearance: none;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      margin: 0;
      /* Граница контрола — не тоньше 3:1 к фону (WCAG 1.4.11), поэтому --ink-3, а не --rule. */
      border: var(--border-thin) solid var(--ink-3);
      background: var(--panel);
      cursor: pointer;
      transition:
        background-color 140ms ease,
        border-color 140ms ease;
    }

    .control:hover input:not(:disabled) {
      border-color: var(--ink-2);
    }

    input:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: 2px;
    }

    input[aria-invalid='true'] {
      border-color: var(--loss);
    }

    :host([disabled]) .control {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    input:disabled {
      cursor: not-allowed;
    }

    .label {
      font-size: var(--text-base);
      line-height: 1.35;
    }

    :host([size='sm']) .label {
      font-size: var(--text-small);
    }

    :host([size='lg']) .label {
      font-size: var(--text-lead);
    }

    /* Описание и ошибка начинаются там же, где текст подписи. */
    .description,
    .error {
      padding-left: calc(var(--box-w, var(--box)) + var(--gap));
      font-size: var(--text-small);
      line-height: 1.4;
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

    @media (prefers-reduced-motion: reduce) {
      * {
        transition: none !important;
      }
    }
  `];
    #defaultChecked = false;
    #descriptionId = `h-check-description-${String(controlId += 1)}`;
    #errorId = `h-check-error-${String(controlId)}`;
    #internals = null;
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
    firstUpdated() {
        this.#defaultChecked = this.checked;
        this.#syncFormState();
    }
    updated() {
        this.#syncFormState();
    }
    /** Браузер передаёт form-disabled состояние. */
    formDisabledCallback(disabled) {
        this.disabled = disabled;
    }
    /** Сброс формы возвращает исходное состояние. */
    formResetCallback() {
        this.checked = this.#defaultChecked;
    }
    get describedBy() {
        if (this.error) {
            return this.#errorId;
        }
        return this.description ? this.#descriptionId : null;
    }
    get descriptionId() {
        return this.#descriptionId;
    }
    get errorId() {
        return this.#errorId;
    }
    /** Нативное change обновляет хост и выходит из тени. */
    change(event) {
        this.checked = event.currentTarget.checked;
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
    renderMessages() {
        return html `
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
    static styles = [
        ...HCheckControl.styles,
        css `
      input {
        border-radius: 5px;
      }

      input:checked,
      input:indeterminate {
        border-color: var(--accent);
        background: var(--accent);
      }

      /* Галочка дорисовывается линией: штрих выезжает из нуля за 180 мс. */
      .mark {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        fill: none;
        stroke: var(--accent-ink);
        stroke-width: 2.4;
        stroke-linecap: round;
        stroke-linejoin: round;
        pointer-events: none;
      }

      .mark path {
        stroke-dasharray: 14;
        stroke-dashoffset: 14;
        transition: stroke-dashoffset 180ms ease-out;
      }

      input:checked:not(:indeterminate) ~ .mark .tick,
      input:indeterminate ~ .mark .dash {
        stroke-dashoffset: 0;
      }
    `,
    ];
    static properties = {
        ...HCheckControl.properties,
        indeterminate: { type: Boolean, reflect: true },
    };
    constructor() {
        super();
        this.indeterminate = false;
    }
    updated() {
        super.updated();
        const input = this.shadowRoot?.querySelector('input');
        if (input) {
            input.indeterminate = this.indeterminate;
        }
    }
    /** Действие пользователя снимает indeterminate. */
    change(event) {
        this.indeterminate = false;
        super.change(event);
    }
    render() {
        return html `
      <span class="field">
        <label class="control">
          <span class="box">
          <input
            type="checkbox"
            .checked=${this.checked}
            name=${this.name}
            value=${this.value}
            ?disabled=${this.disabled}
            ?required=${this.required}
            aria-invalid=${this.error ? 'true' : 'false'}
            aria-describedby=${this.describedBy}
            @change=${(event) => {
            this.change(event);
        }}
          >
          <svg class="mark" viewBox="0 0 18 18" aria-hidden="true">
            <path class="tick" d="M4.5 9.2 7.6 12.2 13.5 6" />
            <path class="dash" d="M5 9h8" />
          </svg>
          </span>
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
    // Геометрия из трёх переменных: бегунок и его ход считаются от ширины и высоты трека.
    static styles = [
        ...HCheckControl.styles,
        css `
      :host {
        --box-w: 36px;
        --box: 20px;
        --pad: 2px;
      }

      :host([size='sm']) {
        --box-w: 28px;
        --box: 16px;
      }

      :host([size='lg']) {
        --box-w: 44px;
        --box: 24px;
      }

      input {
        border-radius: var(--radius-pill);
        background: var(--panel-sunk);
      }

      input:checked {
        border-color: var(--accent);
        background: var(--accent);
      }

      .thumb {
        --inset: calc(var(--pad) + var(--border-thin));
        position: absolute;
        top: var(--inset);
        left: var(--inset);
        width: calc(var(--box) - 2 * var(--inset));
        height: calc(var(--box) - 2 * var(--inset));
        border-radius: var(--radius-pill);
        background: var(--ink-3);
        pointer-events: none;
        transition:
          transform 200ms var(--spring),
          background-color 140ms ease;
      }

      input:checked + .thumb {
        background: var(--accent-ink);
        transform: translateX(calc(var(--box-w) - var(--box)));
      }
    `,
    ];
    render() {
        return html `
      <span class="field">
        <label class="control">
          <span class="box">
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
            @change=${(event) => {
            this.change(event);
        }}
          >
          <span class="thumb" aria-hidden="true"></span>
          </span>
          <span class="label">${this.label}</span>
        </label>
        ${this.renderMessages()}
      </span>
    `;
    }
}
customElements.define('h-switch', HSwitch);
