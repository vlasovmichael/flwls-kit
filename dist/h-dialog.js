import { LitElement, css, html, svg } from 'lit';
import { EASE, GLYPHS, SPRING, play } from './glyphs.js';
const icon = (paths) => html `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
/** Окно подтверждения: `confirm` или `cancel` приходят после анимации ухода. */
export class HDialog extends LitElement {
    static properties = {
        open: { type: Boolean, reflect: true },
        title: { type: String },
        danger: { type: Boolean, reflect: true },
    };
    static styles = css `
    :host {
      display: none;
    }
    :host([open]) {
      display: block;
    }
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
      background: color-mix(in srgb, var(--ink) 45%, transparent);
    }
    section {
      position: relative;
      width: min(24rem, 100%);
      padding: 1.25rem;
      border: 1px solid var(--rule);
      border-radius: 16px;
      background: var(--panel);
      box-shadow: var(--shadow-float);
      color: var(--ink);
      font-family: var(--sans);
    }
    header {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      margin-bottom: 0.65rem;
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
    .icon {
      width: 1rem;
      height: 1rem;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    h2 {
      margin: 0;
      font-size: 1.0625rem;
      line-height: 1.3;
    }
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      border: 1px solid var(--rule);
      border-radius: 999px;
      background: var(--panel);
      color: var(--ink-2);
      cursor: pointer;
      font: inherit;
      font-size: 0.875rem;
      padding: 0.45rem 0.9rem;
    }
    .close {
      margin-left: auto;
      flex: none;
      padding: 0.3rem;
      border-color: transparent;
      background: transparent;
      color: var(--ink-3);
    }
    .close .icon {
      width: 0.95rem;
      height: 0.95rem;
    }
    ::slotted(p),
    .text {
      margin: 0 0 1.1rem;
      color: var(--ink-2);
      line-height: 1.55;
    }
    footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
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
    #opener = null;
    #leaving = false;
    constructor() {
        super();
        this.open = false;
        this.title = '';
        this.danger = false;
    }
    #escape = (event) => {
        if (event.key === 'Escape' && this.open)
            this.close('cancel');
    };
    updated(changed) {
        if (!changed.has('open'))
            return;
        if (this.open) {
            this.#opener = document.activeElement;
            document.body.classList.add('is-modal-open');
            document.addEventListener('keydown', this.#escape);
            const root = this.renderRoot;
            const backdrop = root.querySelector('.backdrop');
            const card = root.querySelector('section');
            if (backdrop)
                play(backdrop, [{ opacity: 0 }, { opacity: 1 }], {
                    duration: 160,
                    easing: EASE,
                });
            if (card) {
                play(card, [
                    { opacity: 0, transform: 'translateY(14px) scale(.97)' },
                    { opacity: 1, transform: 'none' },
                ], {
                    duration: 260,
                    easing: SPRING,
                });
            }
            root.querySelector('.cancel')?.focus();
        }
        else if (changed.get('open') === true) {
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
    }
    /** Закрыть окно: уход анимируется, событие приходит после него. */
    close(kind) {
        if (this.#leaving)
            return;
        this.#leaving = true;
        const done = () => {
            this.#leaving = false;
            this.open = false;
            this.#opener?.focus();
            this.dispatchEvent(new CustomEvent(kind, { bubbles: true, composed: true }));
        };
        const backdrop = this.renderRoot.querySelector('.backdrop');
        const out = backdrop
            ? play(backdrop, [{ opacity: 1 }, { opacity: 0 }], {
                duration: 140,
                easing: EASE,
                fill: 'forwards',
            })
            : null;
        if (out)
            out.onfinish = done;
        else
            done();
    }
    render() {
        return html `<div
      class="backdrop"
      @pointerdown=${(event) => {
            if (event.target === event.currentTarget)
                this.close("cancel");
        }}
    >
      <section role="dialog" aria-modal="true" aria-label=${this.title}>
        <header>
          <span class="glyph">${icon(GLYPHS.warn)}</span>
          <h2>${this.title}</h2>
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click=${() => {
            this.close("cancel");
        }}
          >
            ${icon(GLYPHS.close)}
          </button>
        </header>
        <slot></slot>
        <footer>
          <button
            type="button"
            class="cancel"
            @click=${() => {
            this.close("cancel");
        }}
          >
            <slot name="cancel">Отмена</slot>
          </button>
          <button
            type="button"
            class="confirm"
            @click=${() => {
            this.close("confirm");
        }}
          >
            ${this.danger ? icon(GLYPHS.trash) : icon(GLYPHS.check)}<slot
              name="confirm"
              >Подтвердить</slot
            >
          </button>
        </footer>
      </section>
    </div>`;
    }
}
customElements.define('h-dialog', HDialog);
