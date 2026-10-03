import { LitElement, css, html } from 'lit';
import './h-icon.js';
import { EASE, SPRING, play } from './motion.js';

export type ToastTone = 'info' | 'success' | 'warning' | 'error' | 'ok' | 'bad';
export type ToastDismissReason = 'timeout' | 'close' | 'action';

/** Короткое сообщение о результате действия с понятным способом закрыть его. */
export class HToast extends LitElement {
  static properties = {
    title: { type: String },
    message: { type: String },
    tone: { type: String, reflect: true },
    open: { type: Boolean, reflect: true },
    duration: { type: Number },
    dismissible: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .toast {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: start;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border: var(--border-thin) solid var(--rule);
      border-radius: var(--radius);
      background: var(--panel);
      box-shadow: var(--shadow-float);
      color: var(--ink);
      font-family: var(--sans);
    }

    .mark {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--space-5);
      height: var(--space-5);
      border-radius: var(--radius-pill);
      background: var(--wash);
      color: var(--accent);
    }

    :host([tone='success']) .mark,
    :host([tone='ok']) .mark {
      background: var(--data-wash);
      color: var(--data);
    }

    :host([tone='warning']) .mark {
      background: var(--attn-wash);
      color: var(--attn);
    }

    :host([tone='error']) .mark,
    :host([tone='bad']) .mark {
      background: var(--loss-wash);
      color: var(--loss);
    }

    .content {
      min-width: 0;
    }

    .title {
      margin: 0;
      font-size: var(--text-base);
      font-weight: 600;
      line-height: 1.35;
    }

    .message {
      margin: 0;
      color: var(--ink-2);
      font-size: var(--text-body);
      line-height: 1.45;
    }

    .title + .message {
      margin-top: var(--space-1);
    }

    ::slotted([slot='action']) {
      margin-top: var(--space-2);
    }

    .close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--space-5);
      height: var(--space-5);
      padding: 0;
      border: var(--border-thin) solid transparent;
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--ink-3);
      cursor: pointer;
    }

    .close:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: var(--space-1);
    }
  `;

  declare title: string;
  declare message: string;
  declare tone: ToastTone;
  declare open: boolean;
  declare duration: number;
  declare dismissible: boolean;

  #timer: ReturnType<typeof setTimeout> | null = null;
  #leaving = false;

  constructor() {
    super();
    this.title = '';
    this.message = '';
    this.tone = 'info';
    this.open = false;
    this.duration = 5000;
    this.dismissible = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('pointerenter', this.#pause);
    this.addEventListener('focusin', this.#pause);
    this.addEventListener('pointerleave', this.#resume);
    this.addEventListener('focusout', this.#resume);
    this.#schedule();
  }

  disconnectedCallback() {
    this.#clearTimer();
    super.disconnectedCallback();
  }

  updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has('open') || changed.has('duration')) {
      this.#schedule();
    }

    // Первая отрисовка тоже вход: прежнее значение там undefined, а не false.
    if (changed.has('open') && this.open && changed.get('open') !== true) {
      this.#enter();
    }
  }

  // Под курсором и при фокусе таймер стоит: сообщение должно успеть прочитаться (WCAG 2.2.1).
  #pause = () => {
    this.#clearTimer();
  };

  #resume = () => {
    if (!this.matches(':hover') && !this.matches(':focus-within')) {
      this.#schedule();
    }
  };

  #clearTimer() {
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
  }

  #schedule() {
    this.#clearTimer();

    if (this.open && this.duration > 0) {
      this.#timer = setTimeout(() => {
        this.dismiss('timeout');
      }, this.duration);
    }
  }

  #enter() {
    const card = this.renderRoot.querySelector('.toast');

    if (card) {
      play(
        card,
        [
          { opacity: 0, transform: 'translateY(12px) scale(.98)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 240, easing: SPRING },
      );
    }
  }

  /** Ошибку и предупреждение диктор читает сразу, остальное — в паузе. */
  #urgent() {
    return ['warning', 'error', 'bad'].includes(this.tone);
  }

  #iconName() {
    if (this.tone === 'success' || this.tone === 'ok') {
      return 'check';
    }

    if (this.tone === 'warning' || this.tone === 'error' || this.tone === 'bad') {
      return 'triangle-alert';
    }

    return 'info';
  }

  /** Закрывает уведомление и сообщает стеку, почему оно ушло. */
  dismiss(reason: ToastDismissReason = 'close') {
    if (this.#leaving || !this.open) {
      return;
    }

    this.#leaving = true;
    this.#clearTimer();

    const done = () => {
      this.#leaving = false;
      this.open = false;
      this.dispatchEvent(
        new CustomEvent('dismiss', {
          bubbles: true,
          composed: true,
          detail: { reason },
        }),
      );
    };
    // Уход сначала доигрывает анимацию, и только потом карточка исчезает и стек её убирает.
    const card = this.renderRoot.querySelector('.toast');
    const out = card
      ? play(
          card,
          [{ opacity: 1 }, { opacity: 0, transform: 'translateY(8px) scale(.98)' }],
          { duration: 180, easing: EASE, fill: 'forwards' },
        )
      : null;

    if (!out) {
      done();
      return;
    }

    // Скрытая вкладка может не доиграть анимацию: страховка по времени, событие — один раз.
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      done();
      // fill: forwards оставил бы карточку прозрачной при следующем открытии.
      // cancel() до конца анимации отклоняет finished — это ожидаемо, не ошибка.
      out.finished.catch(() => undefined);
      out.cancel();
    };
    out.onfinish = finish;
    setTimeout(finish, 260);
  }

  #onAction(event: Event) {
    const target = event.composedPath()[0] as HTMLElement;

    if (target.slot === 'action') {
      this.dismiss('action');
    }
  }

  render() {
    return html`
      <section
        class="toast"
        role=${this.#urgent() ? 'alert' : 'status'}
        @click=${this.#onAction}
      >
        <span class="mark">
          <slot name="icon"><h-icon name=${this.#iconName()}></h-icon></slot>
        </span>
        <div class="content">
          ${this.title ? html`<p class="title">${this.title}</p>` : null}
          <p class="message"><slot>${this.message}</slot></p>
          <slot name="action"></slot>
        </div>
        ${this.dismissible
          ? html`
              <button
                class="close"
                type="button"
                aria-label="Close notification"
                @click=${() => {
                  this.dismiss('close');
                }}
              >
                <h-icon name="x"></h-icon>
              </button>
            `
          : null}
      </section>
    `;
  }
}

customElements.define('h-toast', HToast);
