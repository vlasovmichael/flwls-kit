import { LitElement, css, html } from 'lit';
import type { ToastDismissReason, ToastTone } from './h-toast.js';
import './h-toast.js';

export type ToastPosition =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

export type ToastOptions = {
  id?: string;
  title?: string;
  message: string;
  tone?: ToastTone;
  duration?: number;
  dismissible?: boolean;
};

type ToastItem = Required<Omit<ToastOptions, 'id'>> & { id: string };

/** Стек владеет очередью: показывает ограниченное число и удаляет закрытые сообщения. */
export class HToastStack extends LitElement {
  static properties = {
    maxVisible: { type: Number, attribute: 'max-visible' },
    position: { type: String, reflect: true },
  };

  static styles = css`
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

  declare maxVisible: number;
  declare position: ToastPosition;

  #items: ToastItem[] = [];
  #sequence = 0;

  constructor() {
    super();
    this.maxVisible = 3;
    this.position = 'bottom-end';
  }

  /** Добавляет сообщение в конец очереди и возвращает его стабильный идентификатор. */
  show(options: ToastOptions) {
    const id = options.id ?? `toast-${String(++this.#sequence)}`;
    const item: ToastItem = {
      id,
      title: options.title ?? '',
      message: options.message,
      tone: options.tone ?? 'info',
      duration: options.duration ?? 2400,
      dismissible: options.dismissible ?? true,
    };

    this.#items = [...this.#items, item];
    this.requestUpdate();
    return id;
  }

  /** Убирает конкретное сообщение без ожидания его таймера. */
  dismiss(id: string, reason: ToastDismissReason = 'close') {
    const item = this.#items.find((candidate) => candidate.id === id);

    if (!item) {
      return;
    }

    this.#items = this.#items.filter((candidate) => candidate.id !== id);
    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent('dismiss', {
        bubbles: true,
        composed: true,
        detail: { id, reason },
      }),
    );
  }

  #onDismiss = (event: CustomEvent<{ reason: ToastDismissReason }>) => {
    const toast = event.currentTarget as HTMLElement;
    const id = toast.dataset.id;

    if (id) {
      this.dismiss(id, event.detail.reason);
    }
  };

  render() {
    return html`${this.#items.slice(0, this.maxVisible).map(
      (item) => html`
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
      `,
    )}`;
  }
}

customElements.define('h-toast-stack', HToastStack);
