import { LitElement, css, html } from 'lit';

export class HDialog extends LitElement {
  static properties = { open: { type: Boolean, reflect: true }, title: { type: String }, danger: { type: Boolean, reflect: true } };
  static styles = css`
    :host { display: none; } :host([open]) { display: block; } .backdrop { inset: 0; position: fixed; z-index: 10; background: rgb(0 0 0 / 35%); display: grid; place-items: center; padding: 1rem; }
    section { background: var(--panel); box-shadow: var(--shadow-float); border-radius: var(--radius); color: var(--ink); max-width: 28rem; padding: 1.25rem; width: 100%; }
    footer { display: flex; gap: .5rem; justify-content: end; margin-top: 1rem; } button { border: 0; border-radius: var(--radius-sm); font: 500 .875rem/1.2 var(--sans); padding: .65rem .9rem; } .cancel { background: var(--panel-sunk); color: var(--ink); } .confirm { background: var(--data); color: var(--accent-ink); } :host([danger]) .confirm { background: var(--attn); }
  `;
  declare open: boolean;
  declare title: string;
  declare danger: boolean;
  #close(kind: 'confirm' | 'cancel') { this.dispatchEvent(new CustomEvent(kind, { bubbles: true, composed: true })); }
  render() { return html`<div class="backdrop" @click=${(event: MouseEvent) => { if (event.target === event.currentTarget) this.#close('cancel'); }}><section role="dialog" aria-modal="true" aria-label=${this.title}><h2>${this.title}</h2><slot></slot><footer><button class="cancel" @click=${() => { this.#close('cancel'); }}><slot name="cancel">Отмена</slot></button><button class="confirm" @click=${() => { this.#close('confirm'); }}><slot name="confirm">Подтвердить</slot></button></footer></section></div>`; }
}
customElements.define('h-dialog', HDialog);
