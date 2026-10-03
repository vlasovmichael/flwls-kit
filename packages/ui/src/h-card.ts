import { LitElement, css, html } from 'lit';

export type CardVariant = 'surface' | 'raised' | 'outlined';

/** Карточка группирует связанное содержимое и необязательные области. */
export class HCard extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--ink);
      font-family: var(--sans);
    }

    article {
      box-sizing: border-box;
      overflow: hidden;
      border: var(--border-thin) solid var(--rule);
      border-radius: var(--radius);
      background: var(--panel);
      box-shadow: var(--shadow);
    }

    :host([variant='raised']) article {
      background: var(--panel-raised);
      box-shadow: var(--shadow-lift);
    }

    :host([variant='outlined']) article {
      box-shadow: none;
    }

    /* Заголовок в шапке — из токенов; поля браузера у h2/p не должны раздувать карточку. */
    ::slotted([slot='header']) {
      margin: 0;
      font-family: var(--display);
      font-size: var(--text-lead);
      font-weight: 600;
      line-height: 1.3;
    }

    .content ::slotted(:first-child) {
      margin-top: 0;
    }

    .content ::slotted(:last-child) {
      margin-bottom: 0;
    }

    header {
      padding: var(--space-4);
      border-bottom: var(--border-thin) solid var(--rule-soft);
    }

    .content {
      padding: var(--space-4);
    }

    footer {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
      border-top: var(--border-thin) solid var(--rule-soft);
    }

    slot[name='actions'] {
      margin-left: auto;
    }
  `;

  declare variant: CardVariant;

  #hasHeader = false;

  #hasFooter = false;

  #observer = new MutationObserver(() => {
    this.#syncSlots();
  });

  constructor() {
    super();
    this.variant = 'surface';
  }

  connectedCallback() {
    super.connectedCallback();
    this.#observer.observe(this, {
      attributes: true,
      attributeFilter: ['slot'],
      childList: true,
    });
    this.#syncSlots();
  }

  disconnectedCallback() {
    this.#observer.disconnect();
    super.disconnectedCallback();
  }

  // Обновляем границы секций, когда потребитель добавляет или переносит слот.
  #syncSlots() {
    const hasHeader = this.querySelector('[slot="header"]') !== null;
    const hasFooter = this.querySelector('[slot="footer"], [slot="actions"]') !== null;

    if (hasHeader === this.#hasHeader && hasFooter === this.#hasFooter) {
      return;
    }

    this.#hasHeader = hasHeader;
    this.#hasFooter = hasFooter;
    this.requestUpdate();
  }

  render() {
    return html`
      <article>
        ${this.#hasHeader ? html`<header><slot name="header"></slot></header>` : null}
        <div class="content"><slot></slot></div>
        ${this.#hasFooter
          ? html`
              <footer>
                <slot name="footer"></slot>
                <slot name="actions"></slot>
              </footer>
            `
          : null}
      </article>
    `;
  }
}

customElements.define('h-card', HCard);
