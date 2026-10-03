import { LitElement, css, html } from 'lit';
import './h-icon.js';
/** Встроенный баннер сообщает о состоянии. */
export class HAlert extends LitElement {
    static properties = {
        title: { type: String },
        tone: { type: String, reflect: true },
        dismissible: { type: Boolean, reflect: true },
    };
    static styles = css `
    :host {
      display: block;
      box-sizing: border-box;
      border: var(--border-thin) solid var(--rule-strong);
      border-radius: var(--radius-sm);
      background: var(--panel-raised);
      color: var(--ink);
      font-family: var(--sans);
    }

    :host([hidden]) {
      display: none;
    }

    .alert {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: start;
      gap: var(--space-3);
      padding: var(--space-3);
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

    :host([tone='success']) {
      border-color: var(--gain-line);
      background: var(--gain-wash);
    }

    :host([tone='success']) .mark {
      background: var(--panel);
      color: var(--gain);
    }

    :host([tone='warning']) {
      border-color: var(--caution);
      background: var(--caution-wash);
    }

    :host([tone='warning']) .mark {
      background: var(--panel);
      color: var(--caution);
    }

    :host([tone='error']) {
      border-color: var(--loss-line);
      background: var(--loss-wash);
    }

    :host([tone='error']) .mark {
      background: var(--panel);
      color: var(--loss);
    }

    .content {
      min-width: 0;
    }

    h2 {
      margin: 0;
      font-size: var(--text-base);
      font-weight: 600;
      line-height: 1.35;
    }

    .message {
      margin: 0;
      color: var(--ink-2);
      font-size: var(--text-body);
      line-height: 1.5;
    }

    h2 + .message {
      margin-top: var(--space-1);
    }

    .action {
      margin-top: var(--space-3);
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
      color: var(--ink-2);
      cursor: pointer;
    }

    .close:hover {
      background: var(--panel);
      color: var(--ink);
    }

    .close:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: var(--space-1);
    }
  `;
    #hasAction = false;
    constructor() {
        super();
        this.title = '';
        this.tone = 'info';
        this.dismissible = false;
    }
    // Выбираем смысловую иконку для каждого тона.
    #iconName() {
        if (this.tone === 'success') {
            return 'check';
        }
        if (this.tone === 'warning' || this.tone === 'error') {
            return 'triangle-alert';
        }
        return 'info';
    }
    // Баннер скрывается и сообщает контейнеру.
    #dismiss() {
        this.hidden = true;
        this.dispatchEvent(new CustomEvent('dismiss', {
            bubbles: true,
            composed: true,
        }));
    }
    // Убираем пустой отступ, когда слот действия не занят.
    #onActionSlotChange(event) {
        const slot = event.target;
        const hasAction = slot.assignedElements().length > 0;
        if (hasAction !== this.#hasAction) {
            this.#hasAction = hasAction;
            this.requestUpdate();
        }
    }
    render() {
        const role = this.tone === 'warning' || this.tone === 'error' ? 'alert' : 'status';
        return html `
      <section class="alert" role=${role}>
        <span class="mark" aria-hidden="true">
          <h-icon name=${this.#iconName()}></h-icon>
        </span>
        <div class="content">
          ${this.title ? html `<h2>${this.title}</h2>` : null}
          <p class="message"><slot></slot></p>
          <div class="action" ?hidden=${!this.#hasAction}>
            <slot name="action" @slotchange=${this.#onActionSlotChange}></slot>
          </div>
        </div>
        ${this.dismissible
            ? html `
              <button
                class="close"
                type="button"
                aria-label="Dismiss alert"
                @click=${this.#dismiss}
              >
                <h-icon name="x"></h-icon>
              </button>
            `
            : null}
      </section>
    `;
    }
}
customElements.define('h-alert', HAlert);
