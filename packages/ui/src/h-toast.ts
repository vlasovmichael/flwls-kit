import { LitElement, css, html } from 'lit';
import { EASE, GLYPHS, SPRING, play } from './glyphs.js';

/** Короткое уведомление: появляется с пружиной, клик или `dismiss()` убирают его. */
export class HToast extends LitElement {
  static properties = {
    message: { type: String },
    tone: { type: String, reflect: true },
    open: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: none;
    }
    :host([open]) {
      display: block;
    }
    article {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 0.95rem;
      border: 1px solid var(--rule);
      border-radius: 999px;
      background: var(--panel);
      box-shadow: var(--shadow-float);
      color: var(--ink);
      cursor: pointer;
      font: 500 0.9375rem/1.4 var(--sans);
      pointer-events: auto;
    }
    .icon {
      width: 1rem;
      height: 1rem;
      flex: none;
      fill: none;
      stroke: var(--data);
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    :host([tone='bad']) .icon {
      stroke: var(--attn);
    }
  `;

  declare message: string;
  declare tone: 'ok' | 'bad';
  declare open: boolean;

  #leaving = false;

  constructor() {
    super();
    this.message = '';
    this.tone = 'ok';
    this.open = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.open = true;
  }

  firstUpdated() {
    const card = this.renderRoot.querySelector('article');
    if (card) {
      play(
        card,
        [
          { opacity: 0, transform: 'translateY(10px) scale(.96)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: 280,
          easing: SPRING,
        },
      );
    }
  }

  /** Убрать уведомление: уход анимируется, `dismiss` приходит после него. */
  dismiss() {
    if (this.#leaving || !this.open) return;
    this.#leaving = true;
    const done = () => {
      this.#leaving = false;
      this.open = false;
      this.dispatchEvent(
        new CustomEvent('dismiss', { bubbles: true, composed: true }),
      );
    };
    const card = this.renderRoot.querySelector('article');
    const out = card
      ? play(
          card,
          [{ opacity: 1 }, { opacity: 0, transform: 'translateY(6px)' }],
          { duration: 180, easing: EASE, fill: 'forwards' },
        )
      : null;
    if (out) out.onfinish = done;
    else done();
  }

  render() {
    return html`<article
      role="status"
      @click=${() => {
        this.dismiss();
      }}
    >
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
        ${this.tone === 'bad' ? GLYPHS.warn : GLYPHS.check}
      </svg>
      <slot>${this.message}</slot>
    </article>`;
  }
}

customElements.define('h-toast', HToast);
