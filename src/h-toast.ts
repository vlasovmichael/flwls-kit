import { LitElement, css, html } from 'lit';

export class HToast extends LitElement {
  static properties = {
    message: { type: String },
    open: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host { display: none; }
    :host([open]) { display: block; }
    article { align-items: center; background: var(--panel); border: 1px solid var(--rule); border-radius: var(--radius-sm); box-shadow: var(--shadow-float); color: var(--ink); display: flex; font: 400 .875rem/1.4 var(--sans); gap: .75rem; padding: .75rem 1rem; }
    button { background: none; border: 0; color: var(--ink-2); cursor: pointer; font: inherit; padding: .25rem; }
  `;

  declare message: string;
  declare open: boolean;

  connectedCallback() {
    super.connectedCallback();
    this.open = true;
  }

  #dismiss() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('dismiss', { bubbles: true, composed: true }));
  }

  render() {
    return html`<article role="status"><slot>${this.message}</slot><button type="button" aria-label="Close" @click=${this.#dismiss}>×</button></article>`;
  }
}

customElements.define('h-toast', HToast);
