import './h-icon.js';
import { LitElement, css, html } from 'lit';

export type EmptyStateTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';

/** Пустое состояние объясняет отсутствие данных и даёт следующий шаг.
 *
 * Иконка и действие передаются слотами, чтобы состояние подходило разным разделам.
 */
export class HEmptyState extends LitElement {
  static properties = {
    title: { type: String },
    description: { type: String },
    tone: { type: String, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      padding: var(--space-8) var(--space-4);
      border: var(--border-thin) solid var(--rule-soft);
      border-radius: var(--radius);
      background: var(--panel);
      color: var(--ink);
      font-family: var(--sans);
      text-align: center;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--space-10);
      height: var(--space-10);
      margin: 0 auto var(--space-4);
      border-radius: var(--radius-pill);
      background: var(--panel-raised);
      color: var(--ink-3);
      font-size: var(--text-h2);
    }

    :host([tone='info']) .icon {
      background: var(--wash);
      color: var(--accent);
    }

    :host([tone='success']) .icon {
      background: var(--gain-wash);
      color: var(--gain);
    }

    :host([tone='warning']) .icon {
      background: var(--caution-wash);
      color: var(--caution);
    }

    :host([tone='error']) .icon {
      background: var(--loss-wash);
      color: var(--loss);
    }

    h2 {
      margin: 0;
      font-family: var(--display);
      font-size: var(--text-h2);
      font-weight: 600;
      letter-spacing: var(--tracking-snug);
      line-height: 1.2;
    }

    p {
      max-width: var(--breakpoint-sm);
      margin: var(--space-2) auto 0;
      color: var(--ink-2);
      font-size: var(--text-base);
      line-height: 1.5;
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: var(--space-2);
      margin-top: var(--space-4);
    }
  `;

  declare title: string;
  declare description: string;
  declare tone: EmptyStateTone;

  #hasAction = false;

  #observer = new MutationObserver(() => {
    this.#syncAction();
  });

  constructor() {
    super();
    this.title = 'Nothing here yet';
    this.description = '';
    this.tone = 'neutral';
  }

  connectedCallback() {
    super.connectedCallback();
    this.#observer.observe(this, {
      attributes: true,
      attributeFilter: ['slot'],
      childList: true,
    });
    this.#syncAction();
  }

  disconnectedCallback() {
    this.#observer.disconnect();
    super.disconnectedCallback();
  }

  // Убираем пустой отступ, когда потребитель не передал следующий шаг.
  #syncAction() {
    const hasAction = this.querySelector('[slot="action"]') !== null;

    if (hasAction !== this.#hasAction) {
      this.#hasAction = hasAction;
      this.requestUpdate();
    }
  }

  render() {
    return html`
      <section aria-labelledby="title">
        <div class="icon" aria-hidden="true">
          <slot name="icon"><h-icon name="inbox"></h-icon></slot>
        </div>
        <h2 id="title">${this.title}</h2>
        ${this.description ? html`<p>${this.description}</p>` : null}
        <div class="actions" ?hidden=${!this.#hasAction}>
          <slot name="action"></slot>
        </div>
      </section>
    `;
  }
}

customElements.define('h-empty-state', HEmptyState);
