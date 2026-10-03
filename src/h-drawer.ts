import { LitElement, css, html } from 'lit';
import { EASE, GLIDE, play } from './motion.js';
import './h-icon.js';

export type DrawerPlacement = 'start' | 'end' | 'bottom';

export type DrawerSize = 'sm' | 'md' | 'lg';

export type DrawerCloseReason = 'escape' | 'backdrop' | 'button' | 'api';

/** Сдвиг панели за край экрана для каждой стороны; знак start/end зависит от направления письма. */
function offscreen(placement: DrawerPlacement, rtl: boolean) {
  if (placement === 'bottom') return 'translateY(100%)';
  const fromRight = (placement === 'end') !== rtl;
  return fromRight ? 'translateX(100%)' : 'translateX(-100%)';
}

/**
 * Боковая панель поверх страницы: фильтры, детали строки, форма без ухода со страницы.
 * Держится на нативном <dialog>: ловушку фокуса, inert фона и верхний слой даёт браузер.
 */
export class HDrawer extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    heading: { type: String },
    placement: { type: String, reflect: true },
    size: { type: String, reflect: true },
  };

  static styles = css`
    :host {
      display: contents;
    }

    dialog {
      box-sizing: border-box;
      position: fixed;
      inset: 0 0 0 auto;
      display: none;
      flex-direction: column;
      width: min(24rem, 100vw);
      max-width: 100vw;
      height: 100dvh;
      max-height: 100dvh;
      margin: 0;
      padding: 0;
      border: 0;
      border-inline-start: var(--border-thin) solid var(--rule);
      background: var(--panel);
      box-shadow: var(--shadow-float);
      color: var(--ink);
      font-family: var(--sans);
    }

    dialog[open] {
      display: flex;
    }

    dialog::backdrop {
      background: var(--scrim);
    }

    :host([size='sm']) dialog {
      width: min(20rem, 100vw);
    }

    :host([size='lg']) dialog {
      width: min(36rem, 100vw);
    }

    :host([placement='start']) dialog {
      inset: 0 auto 0 0;
      border-inline-start: 0;
      border-inline-end: var(--border-thin) solid var(--rule);
    }

    /* Снизу — лист на всю ширину с ограниченной высотой, как на телефоне. */
    :host([placement='bottom']) dialog {
      inset: auto 0 0;
      width: 100vw;
      height: auto;
      max-height: min(85dvh, 40rem);
      border: 0;
      border-top: var(--border-thin) solid var(--rule);
      border-radius: var(--radius) var(--radius) 0 0;
    }

    header {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4) var(--space-4) var(--space-4) var(--space-5);
      border-bottom: var(--border-thin) solid var(--rule-soft);
    }

    h2 {
      flex: 1;
      min-width: 0;
      margin: 0;
      font-family: var(--display);
      font-size: var(--text-lead);
      font-weight: 600;
      line-height: 1.3;
    }

    .close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: calc(var(--space-6) + var(--space-2));
      height: calc(var(--space-6) + var(--space-2));
      flex: none;
      padding: 0;
      border: var(--border-thin) solid transparent;
      border-radius: var(--radius-pill);
      background: transparent;
      color: var(--ink-3);
      cursor: pointer;
      transition: background 160ms ease, color 160ms ease;
    }

    .close:hover {
      border-color: var(--rule);
      background: var(--sheen);
      color: var(--ink);
    }

    .close:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: 2px;
    }

    /* Прокручивается только тело: шапка и подвал с кнопками остаются на месте. */
    .body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: var(--space-5);
      color: var(--ink-2);
      font-size: var(--text-base);
      line-height: 1.55;
    }

    ::slotted(p) {
      margin: 0 0 var(--space-3);
    }

    footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-2);
      padding: var(--space-4) var(--space-5);
      border-top: var(--border-thin) solid var(--rule-soft);
    }

    footer.is-empty {
      display: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .close {
        transition: none;
      }
    }
  `;

  declare open: boolean;

  declare heading: string;

  declare placement: DrawerPlacement;

  declare size: DrawerSize;

  #reason: DrawerCloseReason = 'api';

  /** Анимации ухода панели и подложки; пустой список — панель не уходит. */
  #leaving: Animation[] = [];

  #hasFooter = false;

  constructor() {
    super();
    this.open = false;
    this.heading = '';
    this.placement = 'end';
    this.size = 'md';
  }

  get #dialog() {
    return this.renderRoot.querySelector('dialog');
  }

  /** Закрыть с анимацией; `close` приходит с причиной после ухода панели. */
  hide(reason: DrawerCloseReason = 'api') {
    if (!this.open) return;
    this.#reason = reason;
    this.open = false;
  }

  updated(changed: Map<PropertyKey, unknown>) {
    if (!changed.has('open')) return;

    if (this.open) {
      this.#show(changed.get('open') !== undefined);
    } else if (changed.get('open') === true) {
      void this.#leave();
    }
  }

  disconnectedCallback() {
    document.body.classList.remove('is-modal-open');
    super.disconnectedCallback();
  }

  #show(animate: boolean) {
    const dialog = this.#dialog;
    if (!dialog) return;

    for (const animation of this.#leaving) animation.cancel();
    this.#leaving = [];
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('is-modal-open');
    this.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));

    if (!animate) return;

    const rtl = getComputedStyle(this).direction === 'rtl';
    play(dialog, [{ transform: offscreen(this.placement, rtl) }, { transform: 'none' }], {
      duration: 320,
      easing: GLIDE,
    });
    play(dialog, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 200,
      easing: EASE,
      pseudoElement: '::backdrop',
    });
  }

  async #leave() {
    const dialog = this.#dialog;
    if (!dialog?.open) return;

    const rtl = getComputedStyle(this).direction === 'rtl';
    const leaving = [
      play(dialog, [{ transform: 'none' }, { transform: offscreen(this.placement, rtl) }], {
        duration: 220,
        easing: EASE,
        fill: 'forwards',
      }),
      play(dialog, [{ opacity: 1 }, { opacity: 0 }], {
        duration: 220,
        easing: EASE,
        fill: 'forwards',
        pseudoElement: '::backdrop',
      }),
    ].filter((animation) => animation !== null);
    this.#leaving = leaving;

    await Promise.all(leaving.map((animation) => animation.finished.catch(() => undefined)));
    // Открыли снова, пока панель уезжала: #show уже отменил уход.
    if (this.#leaving !== leaving) return;

    this.#leaving = [];
    dialog.close();
    // С fill: forwards панель осталась бы за краем при следующем открытии.
    for (const animation of leaving) animation.cancel();
    document.body.classList.remove('is-modal-open');
    const reason = this.#reason;
    this.#reason = 'api';
    this.dispatchEvent(
      new CustomEvent('close', { bubbles: true, composed: true, detail: { reason } }),
    );
  }

  // Сам браузер закрыл бы окно по Escape без анимации; cancel ещё приходит от кнопки «назад».
  #onCancel = (event: Event) => {
    event.preventDefault();
    this.hide('escape');
  };

  #onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    this.hide('escape');
  };

  // Клик мимо панели попадает в сам <dialog>: подложка — его ::backdrop.
  #onPointerDown = (event: PointerEvent) => {
    const dialog = this.#dialog;
    if (!dialog || event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) this.hide('backdrop');
  };

  #onFooterSlot = (event: Event) => {
    const slot = event.target as HTMLSlotElement;
    this.#hasFooter = slot.assignedNodes({ flatten: true }).length > 0;
    this.requestUpdate();
  };

  render() {
    return html`
      <dialog
        aria-labelledby="heading"
        @cancel=${this.#onCancel}
        @keydown=${this.#onKeyDown}
        @pointerdown=${this.#onPointerDown}
      >
        <header>
          <h2 id="heading"><slot name="heading">${this.heading}</slot></h2>
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click=${() => {
              this.hide('button');
            }}
          >
            <h-icon name="x" aria-hidden="true"></h-icon>
          </button>
        </header>
        <div class="body"><slot></slot></div>
        <footer class=${this.#hasFooter ? '' : 'is-empty'}>
          <slot name="footer" @slotchange=${this.#onFooterSlot}></slot>
        </footer>
      </dialog>
    `;
  }
}

customElements.define('h-drawer', HDrawer);
