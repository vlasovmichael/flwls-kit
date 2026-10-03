import { LitElement, css, html } from 'lit';
import './h-icon.js';
import { EASE, play } from './motion.js';

let disclosureId = 0;

/**
 * Раскрывающийся блок показывает дополнительное содержание по запросу.
 */
export class HDisclosure extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--ink);
      font-family: var(--sans);
    }

    button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      min-height: calc(var(--space-6) + var(--space-3));
      padding: var(--space-2) var(--space-3);
      border: var(--border-thin) solid var(--rule);
      border-radius: var(--radius-sm);
      background: var(--panel);
      color: var(--ink);
      cursor: pointer;
      font: inherit;
      font-size: var(--text-base);
      font-weight: 500;
      text-align: left;
    }

    button:hover {
      background: var(--panel-raised);
    }

    button:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    button:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: var(--space-1);
    }

    .indicator {
      flex: 0 0 auto;
      margin-left: var(--space-3);
      color: var(--ink-3);
      transition: transform 260ms var(--spring);
    }

    :host([open]) .indicator {
      transform: rotate(180deg);
    }

    .region {
      box-sizing: border-box;
      overflow: hidden;
      padding: var(--space-3);
      border: var(--border-thin) solid var(--rule-soft);
      border-top: 0;
      border-radius: 0 0 var(--radius-sm) var(--radius-sm);
      background: var(--panel-raised);
      color: var(--ink-2);
      font-size: var(--text-body);
      line-height: 1.5;
    }

    @media (prefers-reduced-motion: reduce) {
      .indicator {
        transition: none;
      }
    }
  `;

  declare open: boolean;
  declare disabled: boolean;

  #regionId = `h-disclosure-region-${String(disclosureId += 1)}`;

  #buttonId = `h-disclosure-button-${String(disclosureId)}`;

  constructor() {
    super();
    this.open = false;
    this.disabled = false;
  }

  /** Переключаем состояние только по действию пользователя. */
  // Высота анимируется от измеренной: CSS не умеет переходить к height: auto.
  updated(changed: Map<PropertyKey, unknown>) {
    if (!changed.has('open') || changed.get('open') === undefined) return;
    const region = this.renderRoot.querySelector<HTMLElement>('.region');
    if (!region) return;

    if (this.open) {
      const height = `${String(region.scrollHeight)}px`;
      play(region, [{ height: '0px', opacity: 0 }, { height, opacity: 1 }], {
        duration: 240,
        easing: EASE,
      });
      return;
    }

    // Свернуть: секция видна, пока сжимается, и прячется только по концу анимации.
    region.hidden = false;
    const height = `${String(region.scrollHeight)}px`;
    const out = play(region, [{ height, opacity: 1 }, { height: '0px', opacity: 0 }], {
      duration: 200,
      easing: EASE,
    });
    const hide = () => {
      if (!this.open) region.hidden = true;
    };
    if (out) out.onfinish = hide;
    else hide();
  }

  #toggle() {
    if (this.disabled) {
      return;
    }

    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { open: this.open },
      }),
    );
  }

  render() {
    return html`
      <button
        id=${this.#buttonId}
        type="button"
        aria-controls=${this.#regionId}
        aria-expanded=${String(this.open)}
        ?disabled=${this.disabled}
        @click=${this.#toggle}
      >
        <slot name="summary">Details</slot>
        <h-icon class="indicator" name="chevron-down"></h-icon>
      </button>
      <div
        id=${this.#regionId}
        class="region"
        role="region"
        aria-labelledby=${this.#buttonId}
        ?hidden=${!this.open}
      >
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('h-disclosure', HDisclosure);
