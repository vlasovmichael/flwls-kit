import { LitElement, css, html } from 'lit';
/** Клавиша в тексте подсказки: `<h-kbd>Ctrl</h-kbd> + <h-kbd>K</h-kbd>`. */
export class HKbd extends LitElement {
    static styles = css `
    :host {
      display: inline-block;
      vertical-align: baseline;
    }

    kbd {
      display: inline-block;
      box-sizing: border-box;
      min-width: 1.6em;
      padding: 0.15em 0.4em;
      border: var(--border-thin) solid var(--rule-strong);
      border-bottom-width: var(--border-thick);
      border-radius: calc(var(--radius-sm) - 3px);
      background: var(--panel-raised);
      color: var(--ink);
      font: 500 0.85em / 1.2 var(--mono);
      text-align: center;
      white-space: nowrap;
    }
  `;
    render() {
        return html `<kbd><slot></slot></kbd>`;
    }
}
customElements.define('h-kbd', HKbd);
