import { LitElement, css, html } from 'lit';
export class HStat extends LitElement {
    static properties = {
        label: { type: String },
        value: { type: String },
        note: { type: String },
        tone: { type: String, reflect: true },
    };
    static styles = css `
    :host { display: flex; flex-direction: column; gap: .25rem; min-width: 0; }
    :host([tone="attn"]) .value { color: var(--attn); }
    :host([tone="data"]) .value { color: var(--data); }
    .label { color: var(--ink-3); font: 500 11px/1.4 var(--sans); letter-spacing: .04em; text-transform: uppercase; }
    .value { color: var(--ink); font: 500 clamp(1.5rem, 4vw, 2rem)/1.1 var(--display); font-variant-numeric: tabular-nums; }
    .note { color: var(--ink-2); font: 400 12px/1.45 var(--sans); }
    .note:empty { display: none; }
  `;
    render() {
        return html `<span class="label">${this.label}</span><span class="value">${this.value}</span><span class="note">${this.note}</span>`;
    }
}
customElements.define('h-stat', HStat);
