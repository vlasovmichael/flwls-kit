import { LitElement, css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import './h-toast.js';
import { SPRING, play } from './motion.js';
/** Стек владеет очередью: показывает ограниченное число и удаляет закрытые сообщения. */
export class HToastStack extends LitElement {
    static properties = {
        maxVisible: { type: Number, attribute: 'max-visible' },
        position: { type: String, reflect: true },
    };
    static styles = css `
    :host {
      position: fixed;
      z-index: var(--layer-toast);
      display: grid;
      gap: var(--space-2);
      width: min(calc(var(--space-10) * 6), calc(100% - var(--space-6)));
      pointer-events: none;
    }

    :host([position='top-start']) {
      top: var(--space-4);
      left: var(--space-4);
    }

    :host([position='top-end']) {
      top: var(--space-4);
      right: var(--space-4);
    }

    :host([position='bottom-start']) {
      bottom: var(--space-4);
      left: var(--space-4);
    }

    :host([position='bottom-end']) {
      right: var(--space-4);
      bottom: var(--space-4);
    }

    h-toast {
      pointer-events: auto;
    }
  `;
    #items = [];
    #sequence = 0;
    constructor() {
        super();
        this.maxVisible = 3;
        this.position = 'bottom-end';
    }
    /** Добавляет сообщение в конец очереди и возвращает его стабильный идентификатор. */
    show(options) {
        const id = options.id ?? `toast-${String(++this.#sequence)}`;
        const item = {
            id,
            title: options.title ?? '',
            message: options.message,
            tone: options.tone ?? 'info',
            duration: options.duration ?? 5000,
            dismissible: options.dismissible ?? true,
        };
        this.#reflow(() => {
            this.#items = [...this.#items, item];
        });
        return id;
    }
    /** Убирает конкретное сообщение без ожидания его таймера. */
    dismiss(id, reason = 'close') {
        const item = this.#items.find((candidate) => candidate.id === id);
        if (!item) {
            return;
        }
        this.#reflow(() => {
            this.#items = this.#items.filter((candidate) => candidate.id !== id);
        });
        this.dispatchEvent(new CustomEvent('dismiss', {
            bubbles: true,
            composed: true,
            detail: { id, reason },
        }));
    }
    // Соседи не прыгают при появлении и уходе: запоминаем их место и доводим из него (FLIP).
    #reflow(change) {
        const before = new Map();
        // До первой отрисовки корня ещё нет — сдвигать некого.
        const root = this.shadowRoot;
        for (const toast of root?.querySelectorAll('h-toast') ?? []) {
            before.set(toast.dataset.id ?? '', toast.getBoundingClientRect().top);
        }
        change();
        this.requestUpdate();
        void this.updateComplete.then(() => {
            for (const toast of this.renderRoot.querySelectorAll('h-toast')) {
                const was = before.get(toast.dataset.id ?? '');
                if (was === undefined)
                    continue;
                const shift = was - toast.getBoundingClientRect().top;
                if (Math.abs(shift) < 1)
                    continue;
                play(toast, [{ transform: `translateY(${String(shift)}px)` }, { transform: 'none' }], { duration: 260, easing: SPRING });
            }
        });
    }
    #onDismiss = (event) => {
        const toast = event.currentTarget;
        const id = toast.dataset.id;
        if (id) {
            this.dismiss(id, event.detail.reason);
        }
    };
    render() {
        // Ключ по id: без него Lit переиспользует ушедший элемент для соседа, и сосед пропадает.
        return html `${repeat(this.#items.slice(0, this.maxVisible), (item) => item.id, (item) => html `
        <h-toast
          data-id=${item.id}
          .title=${item.title}
          .message=${item.message}
          .tone=${item.tone}
          .duration=${item.duration}
          .dismissible=${item.dismissible}
          .open=${true}
          @dismiss=${this.#onDismiss}
        ></h-toast>
      `)}`;
    }
}
customElements.define('h-toast-stack', HToastStack);
