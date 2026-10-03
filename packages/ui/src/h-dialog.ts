import { LitElement, css, html } from 'lit';
import './h-icon.js';
import { EASE, SPRING, play } from './motion.js';

const FOCUSABLE = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/** Окно подтверждения: `confirm` или `cancel` приходят после анимации ухода. */
export class HDialog extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    title: { type: String },
    description: { type: String },
    danger: { type: Boolean, reflect: true },
    size: { type: String, reflect: true },
    confirmLabel: { type: String, attribute: 'confirm-label' },
    cancelLabel: { type: String, attribute: 'cancel-label' },
  };

  static styles = css`
    :host {
      display: none;
    }
    :host([open]) {
      display: block;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: var(--layer-dialog);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-5);
      background: var(--scrim);
    }
    section {
      position: relative;
      width: min(24rem, 100%);
      padding: var(--space-5);
      border: var(--border-thin) solid var(--rule);
      border-radius: var(--radius);
      background: var(--panel);
      box-shadow: var(--shadow-float);
      color: var(--ink);
      font-family: var(--sans);
    }
    :host([size='sm']) section {
      width: min(20rem, 100%);
    }
    :host([size='lg']) section {
      width: min(36rem, 100%);
    }
    header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-bottom: var(--space-3);
    }
    .glyph {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.9rem;
      height: 1.9rem;
      flex: none;
      border-radius: 50%;
      background: var(--attn-wash);
      color: var(--attn);
    }
    h2 {
      margin: 0;
      font-family: var(--display);
      font-size: var(--text-lead);
      line-height: 1.3;
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      border: var(--border-thin) solid var(--rule);
      border-radius: var(--radius-pill);
      background: var(--panel);
      color: var(--ink-2);
      cursor: pointer;
      font: inherit;
      font-size: var(--text-base);
      padding: var(--space-2) var(--space-4);
    }
    button:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: 2px;
    }
    .close {
      margin-left: auto;
      flex: none;
      padding: 0.3rem;
      border-color: transparent;
      background: transparent;
      color: var(--ink-3);
    }
    .close h-icon {
      width: var(--space-4);
      height: var(--space-4);
    }
    /* Отступ до кнопок держит разметка компонента: текст в слоте бывает голой строкой. */
    .body {
      margin-bottom: var(--space-5);
      color: var(--ink-2);
      font-size: var(--text-base);
      line-height: 1.55;
    }
    ::slotted(p) {
      margin: 0;
    }
    footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-2);
    }
    .confirm {
      font-weight: 500;
      border-color: var(--data);
      background: var(--data-wash);
      color: var(--ink);
    }
    :host([danger]) .confirm {
      border-color: var(--attn);
      background: var(--attn-wash);
      color: var(--attn);
    }
    @media (width <= 26rem) {
      footer {
        flex-direction: column-reverse;
      }
      footer > button {
        width: 100%;
      }
    }
  `;

  declare open: boolean;
  declare title: string;
  declare description: string;
  declare danger: boolean;
  declare size: 'sm' | 'md' | 'lg';
  declare confirmLabel: string;
  declare cancelLabel: string;

  #opener: HTMLElement | null = null;
  #leaving = false;

  #uid = `dialog-${Math.random().toString(36).slice(2, 8)}`;

  constructor() {
    super();
    this.open = false;
    this.title = '';
    this.description = '';
    this.danger = false;
    this.size = 'md';
    this.confirmLabel = 'Confirm';
    this.cancelLabel = 'Cancel';
  }

  #escape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.open) this.close('cancel');
  };

  // Фокус живёт в двух деревьях: кнопки окна — в shadow DOM, поля из слотов — в light DOM.
  #trapFocus = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    const card = this.renderRoot.querySelector('section');
    const ownFocusable = [...(card?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])];
    const slotted = [...this.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const footerSlotted = this.querySelector('[slot="footer"]') !== null;
    const first = ownFocusable.at(0) ?? slotted.at(0);
    const last = footerSlotted ? slotted.at(-1) : (ownFocusable.at(-1) ?? slotted.at(-1));
    if (!first || !last) return;
    // document.activeElement видит только хост; внутренний фокус — у shadowRoot.
    const active = this.shadowRoot?.activeElement ?? document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  updated(changed: Map<PropertyKey, unknown>) {
    if (!changed.has('open')) return;
    if (this.open) {
      this.#opener = document.activeElement as HTMLElement | null;
      document.body.classList.add('is-modal-open');
      document.addEventListener('keydown', this.#escape);
      document.addEventListener('keydown', this.#trapFocus);
      const root = this.renderRoot;
      const backdrop = root.querySelector('.backdrop');
      const card = root.querySelector('section');
      if (backdrop)
        play(backdrop, [{ opacity: 0 }, { opacity: 1 }], {
          duration: 160,
          easing: EASE,
        });
      if (card) {
        play(
          card,
          [
            { opacity: 0, transform: 'translateY(14px) scale(.97)' },
            { opacity: 1, transform: 'none' },
          ],
          {
            duration: 260,
            easing: SPRING,
          },
        );
      }
      root.querySelector<HTMLButtonElement>('.cancel')?.focus();
    } else if (changed.get('open') === true) {
      this.#release();
    }
  }

  disconnectedCallback() {
    this.#release();
    super.disconnectedCallback();
  }

  #release() {
    document.body.classList.remove('is-modal-open');
    document.removeEventListener('keydown', this.#escape);
    document.removeEventListener('keydown', this.#trapFocus);
  }

  /** Закрыть окно: уход анимируется, событие приходит после него. */
  close(kind: 'confirm' | 'cancel') {
    if (this.#leaving) return;
    this.#leaving = true;
    const done = () => {
      this.#leaving = false;
      this.open = false;
      this.#opener?.focus();
      this.dispatchEvent(
        new CustomEvent(kind, { bubbles: true, composed: true }),
      );
    };
    const backdrop = this.renderRoot.querySelector('.backdrop');
    const out = backdrop
      ? play(backdrop, [{ opacity: 1 }, { opacity: 0 }], {
          duration: 140,
          easing: EASE,
          fill: 'forwards',
        })
      : null;
    // Анимацию ухода снимаем после конца: с fill: forwards прозрачность 0 пережила бы
    // закрытие и погасила окно при следующем открытии.
    if (out) {
      out.onfinish = () => {
        done();
        out.finished.catch(() => undefined);
        out.cancel();
      };
    } else {
      done();
    }
  }

  render() {
    return html`<div
      class="backdrop"
      @pointerdown=${(event: PointerEvent) => {
        if (event.target === event.currentTarget) this.close("cancel");
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby=${`${this.#uid}-title`}
        aria-describedby=${this.description ? `${this.#uid}-description` : null}
      >
        <slot name="header">
          <header>
            ${this.danger
              ? html`<span class="glyph"><h-icon name="triangle-alert"></h-icon></span>`
              : ''}
            <h2 id=${`${this.#uid}-title`}>${this.title}</h2>
            <button
              type="button"
              class="close"
              aria-label="Close"
              @click=${() => {
                this.close("cancel");
              }}
            >
              <h-icon name="x"></h-icon>
            </button>
          </header>
        </slot>
        <div id=${`${this.#uid}-description`} class="body">
          <slot>${this.description}</slot>
        </div>
        <slot name="footer">
          <footer>
          <button
            type="button"
            class="cancel"
            @click=${() => {
              this.close("cancel");
            }}
          >
            <slot name="cancel">${this.cancelLabel}</slot>
          </button>
          <button
            type="button"
            class="confirm"
            @click=${() => {
              this.close("confirm");
            }}
          >
            <h-icon name=${this.danger ? 'trash-2' : 'check'}></h-icon>
            <slot name="confirm">${this.confirmLabel}</slot>
          </button>
          </footer>
        </slot>
      </section>
    </div>`;
  }
}

customElements.define('h-dialog', HDialog);
