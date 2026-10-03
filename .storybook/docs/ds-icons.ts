import { ICON_NAMES } from '../../packages/ui/src/h-icon.ts';

/** Сетка показывает только зарегистрированные иконки, которые попадут в бандл. */
class DsIcons extends HTMLElement {
  #grid = document.createElement('div');

  #search = document.createElement('input');

  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    const label = document.createElement('label');

    style.textContent = `
      :host {
        display: block;
        color: var(--ink);
        font-family: var(--sans);
      }

      input {
        box-sizing: border-box;
        width: 100%;
        max-width: calc(var(--space-10) * 8);
        padding: var(--space-2) var(--space-3);
        border: var(--border-thin) solid var(--rule-strong);
        border-radius: var(--radius-sm);
        background: var(--panel);
        color: var(--ink);
        font: inherit;
      }

      input:focus-visible {
        outline: var(--border-thick) solid var(--accent);
        outline-offset: var(--space-1);
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(calc(var(--space-10) * 4), 1fr));
        gap: var(--space-2);
        margin-top: var(--space-4);
      }

      .icon {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        min-height: var(--space-8);
        padding: var(--space-2);
        border: var(--border-thin) solid var(--rule);
        border-radius: var(--radius-sm);
        background: var(--panel);
        color: var(--ink-2);
        font-family: var(--mono);
        font-size: var(--text-small);
      }
    `;
    label.textContent = 'Search icons';
    this.#search.type = 'search';
    this.#search.placeholder = 'Search registered icons';
    this.#search.setAttribute('aria-label', 'Search icons');
    this.#search.addEventListener('input', this.#render);
    this.#grid.className = 'grid';
    root.append(style, label, this.#search, this.#grid);
    this.#render();
  }

  disconnectedCallback() {
    this.#search.removeEventListener('input', this.#render);
  }

  #render = () => {
    const query = this.#search.value.toLowerCase();
    const names = ICON_NAMES.filter((name) => name.includes(query));
    const cards = names.map((name) => this.#card(name));

    this.#grid.replaceChildren(...cards);
  };

  #card(name: string) {
    const card = document.createElement('div');
    const icon = document.createElement('h-icon');
    const label = document.createElement('span');

    card.className = 'icon';
    icon.setAttribute('name', name);
    label.textContent = name;
    card.append(icon, label);
    return card;
  }
}

customElements.define('ds-icons', DsIcons);
