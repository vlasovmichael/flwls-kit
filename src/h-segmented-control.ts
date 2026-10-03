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

    /* Дорожка-пилюля, по которой ездит подложка выбранного пункта. */
    .group {
      position: relative;
      display: inline-flex;
      gap: var(--space-1);
      padding: var(--space-1);
      border: var(--border-thin) solid var(--rule);
      border-radius: var(--radius-pill);
      background: var(--panel-sunk);
    }

    :host([stretch]) .group {
      display: flex;
      width: 100%;
      box-sizing: border-box;
    }

    /* Ездит трансформом, а не сменой left: transform считает композитор, переезд не дёргается. */
    .thumb {
      position: absolute;
      top: var(--space-1);
      bottom: var(--space-1);
      left: 0;
      width: var(--thumb-w, 0);
      border-radius: var(--radius-pill);
      background: var(--panel);
      /* Обводка держит контур в тёмной теме, где тень на тёмном фоне не видна. */
      box-shadow:
        var(--shadow),
        inset 0 0 0 var(--border-thin) var(--rule);
      opacity: 0;
      pointer-events: none;
      transform: translateX(var(--thumb-x, 0));
    }

    .thumb.is-ready {
      opacity: 1;
    }

    .thumb.is-moving {
      transition:
        transform 340ms var(--spring),
        width 340ms var(--spring),
        opacity 200ms ease;
    }

    button {
      position: relative;
      min-height: calc(var(--space-6) + var(--space-1));
      padding: var(--space-1) var(--space-3);
      border: 0;
      border-radius: var(--radius-pill);
      background: transparent;
      color: var(--ink-2);
      cursor: pointer;
      font: inherit;
      font-size: var(--text-small);
      font-weight: 600;
      line-height: 1;
      white-space: nowrap;
      transition: color 180ms ease;
    }

    :host([stretch]) button {
      flex: 1 1 0;
    }

    button:hover:not(:disabled),
    button[aria-checked='true'] {
      color: var(--ink);
    }

    /* Подложка ещё не измерена — выбор всё равно обязан читаться. */
    .thumb:not(.is-ready) ~ button[aria-checked='true'] {
      background: var(--panel);
      box-shadow: var(--shadow);
    }

    button:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    /* Кольцо фокуса внутрь: снаружи оно вылезает за дорожку и читается как отдельная кнопка. */
    button:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: -2px;
    }

    @media (prefers-reduced-motion: reduce) {
      .thumb.is-moving {
        transition: none;
      }
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

  #resize = new ResizeObserver(() => {
    this.#placeThumb(false);
  });

  disconnectedCallback() {
    this.#resize.disconnect();
    super.disconnectedCallback();
  }

  protected firstUpdated() {
    const group = this.renderRoot.querySelector('.group');
    if (group) this.#resize.observe(group);
  }

  /** Подложка встаёт под выбранный пункт; первый раз — без анимации, потом — переездом. */
  #placeThumb(animate: boolean) {
    const thumb = this.renderRoot.querySelector<HTMLElement>('.thumb');
    const button = this.#buttonFor(this.value);
    if (!thumb) return;

    if (!button) {
      thumb.classList.remove('is-ready');
      return;
    }

    thumb.classList.toggle('is-moving', animate && thumb.classList.contains('is-ready'));
    thumb.style.setProperty('--thumb-x', `${String(button.offsetLeft)}px`);
    thumb.style.setProperty('--thumb-w', `${String(button.offsetWidth)}px`);
    thumb.classList.add('is-ready');
  }

  protected updated(changed: Map<PropertyKey, unknown>) {
    this.#placeThumb(true);

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
        <span class="thumb" aria-hidden="true"></span>
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
