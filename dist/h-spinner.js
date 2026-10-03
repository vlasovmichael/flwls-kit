import { LitElement, css, html } from 'lit';
/** Индикатор без известного процента завершения. */
export class HSpinner extends LitElement {
    static properties = {
        size: { type: String, reflect: true },
        label: { type: String },
    };
    static styles = css `
    :host {
      display: inline-block;
      color: var(--accent);
      font-family: var(--sans);
    }

    .status {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--ink-2);
      font-size: var(--text-body);
      line-height: 1;
    }

    .indicator {
      box-sizing: border-box;
      width: var(--space-5);
      height: var(--space-5);
      border: var(--border-thick) solid var(--rule-strong);
      border-right-color: var(--accent);
      border-radius: var(--radius-pill);
      animation: spinner-rotate 1s linear infinite;
    }

    :host([size='sm']) .status {
      font-size: var(--text-small);
    }

    :host([size='sm']) .indicator {
      width: var(--space-4);
      height: var(--space-4);
    }

    :host([size='lg']) .status {
      font-size: var(--text-lead);
    }

    :host([size='lg']) .indicator {
      width: var(--space-6);
      height: var(--space-6);
    }

    @keyframes spinner-rotate {
      to {
        transform: rotate(1turn);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .indicator {
        animation: none;
      }
    }
  `;
    constructor() {
        super();
        this.size = 'md';
        this.label = 'Loading';
    }
    render() {
        return html `
      <span class="status" role="status" aria-label=${this.label}>
        <span class="indicator" aria-hidden="true"></span>
        <span aria-hidden="true">${this.label}</span>
      </span>
    `;
    }
}
customElements.define('h-spinner', HSpinner);
