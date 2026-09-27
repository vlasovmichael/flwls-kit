import { LitElement, css, html } from 'lit';

export type SelectOption = { label: string; value: string };

export class HSelect extends LitElement {
  static properties = { options: { attribute: false }, value: { type: String } };

  static styles = css`
    :host { display: block; }
    select { appearance: none; background: var(--panel); border: 1px solid var(--rule); border-radius: var(--radius-sm); color: var(--ink); font: inherit; min-width: 100%; padding: .65rem 2rem .65rem .8rem; }
  `;

  declare options: SelectOption[];
  declare value: string;

  constructor() {
    super();
    this.options = [];
    this.value = '';
  }

  #change(event: Event) {
    this.value = (event.target as HTMLSelectElement).value;
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: this.value }));
  }

  render() {
    return html`<select .value=${this.value} @change=${this.#change}>${this.options.map(
      (option) => html`<option value=${option.value}>${option.label}</option>`,
    )}</select>`;
  }
}

customElements.define('h-select', HSelect);
