import { LitElement, css, html } from 'lit';

/** Базовая кнопка сохраняет нативную семантику и отправляет форму через `type`. */
export class HButton extends LitElement {
  static properties = {
    variant: { type: String, reflect: true }, size: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true }, loading: { type: Boolean, reflect: true },
    block: { type: Boolean, reflect: true }, type: { type: String },
  };
  static styles = [css`
    :host { display: inline-block; } :host([block]) { display: block; }
    button { box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2); min-height: calc(var(--space-6) + var(--space-3)); padding: var(--space-2) var(--space-4); border: var(--border-thin) solid var(--rule-strong); border-radius: var(--radius-pill); background: var(--panel); color: var(--ink); cursor: pointer; font: 500 var(--text-base)/1 var(--sans); }
    :host([size="sm"]) button { min-height: var(--space-6); padding: var(--space-1) var(--space-3); font-size: var(--text-small); }
    :host([size="lg"]) button { min-height: calc(var(--space-8) + var(--space-2)); padding: var(--space-3) var(--space-5); font-size: var(--text-lead); }
    :host([block]) button { width: 100%; } :host([variant="primary"]) button { border-color: var(--accent); background: var(--accent); color: var(--accent-ink); }
    :host([variant="danger"]) button, :host([variant="negative"]) button { border-color: var(--loss); background: var(--loss-wash); color: var(--ink); }
    :host([variant="positive"]) button { border-color: var(--gain); background: var(--gain-wash); color: var(--gain); }
    :host([variant="ghost"]) button { border-color: transparent; background: transparent; color: var(--ink-2); }
    button:disabled { cursor: not-allowed; opacity: var(--opacity-disabled); } button:focus-visible { outline: var(--border-thick) solid var(--accent); outline-offset: var(--space-1); }
    .spinner { width: 1rem; height: 1rem; border: var(--border-thick) solid currentColor; border-right-color: transparent; border-radius: var(--radius-pill); animation: spin var(--spring) 1s infinite; }
    @keyframes spin { to { transform: rotate(1turn); } } @media (prefers-reduced-motion: reduce) { .spinner { animation: none; } }
  `];
  declare variant: 'neutral' | 'primary' | 'danger' | 'ghost' | 'positive' | 'negative'; declare size: 'sm' | 'md' | 'lg'; declare disabled: boolean; declare loading: boolean; declare block: boolean; declare type: 'button' | 'submit' | 'reset';
  constructor() { super(); this.variant = 'neutral'; this.size = 'md'; this.disabled = false; this.loading = false; this.block = false; this.type = 'button'; }
  render() { return html`<button type=${this.type} ?disabled=${this.disabled || this.loading} aria-busy=${this.loading ? 'true' : 'false'}><slot name="icon-start"></slot>${this.loading ? html`<span class="spinner" aria-label="Loading"></span>` : ''}<slot></slot><slot name="icon-end"></slot></button>`; }
}
customElements.define('h-button', HButton);

/** Кнопка только с иконкой требует текстовую метку для читалок экрана. */
export class HIconButton extends HButton {
  static properties = { ...HButton.properties, label: { type: String } };
  static styles = [...HButton.styles, css`button { width: calc(var(--space-6) + var(--space-3)); padding: var(--space-2); } :host([size="sm"]) button { width: var(--space-6); padding: var(--space-1); } :host([size="lg"]) button { width: calc(var(--space-8) + var(--space-2)); padding: var(--space-3); }`];
  declare label: string;
  constructor() { super(); this.label = ''; }
  render() { return html`<button type=${this.type} ?disabled=${this.disabled || this.loading} aria-label=${this.label} aria-busy=${this.loading ? 'true' : 'false'}>${this.loading ? html`<span class="spinner" aria-label="Loading"></span>` : html`<slot></slot>`}</button>`; }
}
customElements.define('h-icon-button', HIconButton);
