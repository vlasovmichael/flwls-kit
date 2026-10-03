import { LitElement, css, html, nothing } from 'lit';
/** Линия между группами. С подписью — «или», «Сегодня» посреди линии. */
export class HDivider extends LitElement {
    static properties = {
        orientation: { type: String, reflect: true },
        label: { type: String },
    };
    static styles = css `
    :host {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin: var(--space-4) 0;
      color: var(--ink-3);
      font: 500 var(--text-label) / 1 var(--sans);
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
    }

    .line {
      flex: 1;
      height: var(--border-thin);
      background: var(--rule);
    }

    :host([orientation='vertical']) {
      display: inline-block;
      align-self: stretch;
      width: var(--border-thin);
      min-height: 1em;
      margin: 0 var(--space-2);
      background: var(--rule);
      vertical-align: middle;
    }
  `;
    constructor() {
        super();
        this.orientation = 'horizontal';
        this.label = '';
    }
    connectedCallback() {
        super.connectedCallback();
        this.setAttribute('role', 'separator');
    }
    updated() {
        this.setAttribute('aria-orientation', this.orientation);
    }
    render() {
        if (this.orientation === 'vertical')
            return nothing;
        if (!this.label)
            return html `<span class="line"></span>`;
        return html `<span class="line"></span><span>${this.label}</span><span class="line"></span>`;
    }
}
customElements.define('h-divider', HDivider);
