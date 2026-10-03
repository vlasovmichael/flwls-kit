import { LitElement, css, html, nothing } from 'lit';
import { EASE, SPRING, play } from './motion.js';
import './h-icon.js';
let dropdownMenuId = 0;
/** Меню действий: открывается кнопкой и ничего не хранит, в отличие от h-select. */
export class HDropdownMenu extends LitElement {
    static properties = {
        items: { attribute: false },
        label: { type: String },
        icon: { type: String },
        iconOnly: { type: Boolean, attribute: 'icon-only', reflect: true },
        size: { type: String, reflect: true },
        align: { type: String, reflect: true },
        open: { type: Boolean, reflect: true },
        disabled: { type: Boolean, reflect: true },
    };
    static styles = css `
    :host {
      position: relative;
      display: inline-block;
      color: var(--ink);
      font-family: var(--sans);
    }

    .trigger {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      min-height: calc(var(--space-6) + var(--space-3));
      padding: var(--space-2) var(--space-3) var(--space-2) var(--space-4);
      border: var(--border-thin) solid var(--rule-strong);
      border-radius: var(--radius-pill);
      background: var(--panel);
      color: var(--ink);
      cursor: pointer;
      font: 500 var(--text-base) / 1 var(--sans);
      transition: background 160ms ease, border-color 160ms ease;
    }

    :host([size='sm']) .trigger {
      min-height: var(--space-6);
      padding: var(--space-1) var(--space-2) var(--space-1) var(--space-3);
      font-size: var(--text-small);
    }

    .trigger:hover,
    :host([open]) .trigger {
      border-color: var(--ink-3);
      background: var(--panel-raised);
    }

    /* Только иконка: круглая кнопка без рамки, как «⋯» в строке таблицы. */
    :host([icon-only]) .trigger {
      justify-content: center;
      width: calc(var(--space-6) + var(--space-3));
      padding: 0;
      border-color: transparent;
      background: transparent;
      color: var(--ink-2);
    }

    :host([icon-only][size='sm']) .trigger {
      width: var(--space-6);
    }

    :host([icon-only]) .trigger:hover,
    :host([icon-only][open]) .trigger {
      background: var(--sheen);
      color: var(--ink);
      border-color: var(--rule);
    }

    .trigger:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    .trigger:focus-visible,
    .item:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: 2px;
    }

    .chevron {
      color: var(--ink-3);
      transition: transform 220ms var(--spring);
    }

    :host([open]) .chevron {
      transform: rotate(180deg);
    }

    .menu {
      position: absolute;
      z-index: var(--layer-popover);
      top: calc(100% + var(--space-1));
      left: 0;
      box-sizing: border-box;
      min-width: max(100%, 11rem);
      width: max-content;
      margin: 0;
      padding: var(--space-1);
      border: var(--border-thin) solid var(--rule);
      border-radius: var(--radius-sm);
      background: var(--panel);
      box-shadow: var(--shadow-float);
      list-style: none;
      transform-origin: top left;
    }

    .menu:focus {
      outline: none;
    }

    .menu[hidden] {
      display: none;
    }

    /* Сторону и край выбирает #place: align — пожелание, у края окна меню переворачивается. */
    :host([data-x='end']) .menu {
      right: 0;
      left: auto;
      transform-origin: top right;
    }

    :host([data-side='top']) .menu {
      top: auto;
      bottom: calc(100% + var(--space-1));
      transform-origin: bottom left;
    }

    :host([data-side='top'][data-x='end']) .menu {
      transform-origin: bottom right;
    }

    .divider {
      height: var(--border-thin);
      margin: var(--space-1) calc(-1 * var(--space-1));
      background: var(--rule);
    }

    .item {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: var(--space-2);
      width: 100%;
      padding: var(--space-2) var(--space-3);
      border: 0;
      border-radius: calc(var(--radius-sm) - 3px);
      background: transparent;
      color: var(--ink);
      cursor: pointer;
      font: inherit;
      font-size: var(--text-base);
      line-height: 1.4;
      text-align: left;
      white-space: nowrap;
    }

    .item h-icon {
      color: var(--ink-3);
    }

    /* Фокус идёт за курсором, поэтому подсветка одна — на :focus. */
    .item:focus {
      background: var(--wash);
      outline: none;
    }

    .item.danger,
    .item.danger h-icon {
      color: var(--loss);
    }

    .item.danger:focus {
      background: var(--loss-wash);
    }

    .item:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    @media (prefers-reduced-motion: reduce) {
      .chevron,
      .trigger {
        transition: none;
      }
    }
  `;
    #id = `h-dropdown-menu-${String((dropdownMenuId += 1))}`;
    #closeReason = 'toggle';
    /** Пункт, который получит фокус при открытии; -1 — фокус на самом меню. */
    #focusOnOpen = -1;
    #leaving = null;
    #typed = '';
    #typedAt = 0;
    constructor() {
        super();
        this.items = [];
        this.label = 'Actions';
        this.icon = '';
        this.iconOnly = false;
        this.size = 'md';
        this.align = 'start';
        this.open = false;
        this.disabled = false;
    }
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('pointerdown', this.#onOutsidePointerDown);
    }
    disconnectedCallback() {
        document.removeEventListener('pointerdown', this.#onOutsidePointerDown);
        super.disconnectedCallback();
    }
    updated(changed) {
        if (changed.has('disabled') && this.disabled && this.open) {
            this.#close('toggle');
        }
        if (!changed.has('open'))
            return;
        // Открыто с первого рендера: показать без анимации, события и кражи фокуса.
        if (changed.get('open') === undefined) {
            if (this.open)
                this.#enter(false);
            return;
        }
        if (this.open) {
            this.#enter(true);
        }
        else {
            void this.#leave();
        }
        this.dispatchEvent(new CustomEvent(this.open ? 'open' : 'close', {
            bubbles: true,
            composed: true,
            detail: this.open ? undefined : { reason: this.#closeReason },
        }));
    }
    get #menu() {
        return this.renderRoot.querySelector('.menu');
    }
    get #trigger() {
        return this.renderRoot.querySelector('.trigger');
    }
    #buttons() {
        return [...this.renderRoot.querySelectorAll('.item')];
    }
    #enabled() {
        return this.#buttons().filter((button) => !button.disabled);
    }
    #enter(interactive) {
        const menu = this.#menu;
        if (!menu)
            return;
        this.#leaving?.cancel();
        this.#leaving = null;
        menu.hidden = false;
        this.#place(menu);
        if (!interactive)
            return;
        const up = this.dataset.side === 'top';
        play(menu, [
            { opacity: 0, transform: `translateY(${up ? '4px' : '-4px'}) scale(0.97)` },
            { opacity: 1, transform: 'none' },
        ], { duration: 180, easing: SPRING });
        const target = this.#focusOnOpen < 0 ? undefined : this.#enabled().at(this.#focusOnOpen);
        (target ?? menu).focus();
    }
    async #leave() {
        const menu = this.#menu;
        if (!menu || menu.hidden)
            return;
        const out = play(menu, [{ opacity: 1 }, { opacity: 0 }], {
            duration: 120,
            easing: EASE,
            fill: 'forwards',
        });
        this.#leaving = out;
        if (out) {
            await out.finished.catch(() => undefined);
            // Открыли заново, пока меню уходило: уход отменён в #enter.
            if (this.#leaving !== out)
                return;
            out.cancel();
        }
        this.#leaving = null;
        menu.hidden = true;
    }
    /** Меню переворачивается вверх или к другому краю, если упирается в край окна. */
    #place(menu) {
        const margin = 8;
        delete this.dataset.side;
        this.dataset.x = this.align;
        let rect = menu.getBoundingClientRect();
        if (this.align === 'start' && rect.right > window.innerWidth - margin)
            this.dataset.x = 'end';
        if (this.align === 'end' && rect.left < margin)
            this.dataset.x = 'start';
        rect = menu.getBoundingClientRect();
        const above = this.getBoundingClientRect().top;
        if (rect.bottom > window.innerHeight - margin && above > rect.height + margin) {
            this.dataset.side = 'top';
        }
    }
    #toggle(next, focusIndex, reason = 'toggle') {
        if (next && this.disabled)
            return;
        if (this.open === next)
            return;
        this.#focusOnOpen = focusIndex;
        this.#closeReason = reason;
        this.open = next;
    }
    #close(reason, returnFocus = false) {
        if (!this.open)
            return;
        this.#toggle(false, -1, reason);
        if (returnFocus)
            this.#trigger?.focus();
    }
    #focusAt(index) {
        const enabled = this.#enabled();
        if (enabled.length === 0)
            return;
        const wrapped = (index + enabled.length) % enabled.length;
        enabled[wrapped].focus();
    }
    #move(step) {
        const enabled = this.#enabled();
        const current = enabled.indexOf(this.#focusedItem());
        if (current < 0) {
            this.#focusAt(step > 0 ? 0 : -1);
            return;
        }
        this.#focusAt(current + step);
    }
    #focusedItem() {
        const active = this.shadowRoot?.activeElement;
        return active instanceof HTMLButtonElement && active.classList.contains('item') ? active : null;
    }
    #select(index) {
        const item = this.items.at(index);
        if (!item || item.disabled)
            return;
        this.dispatchEvent(new CustomEvent('select', {
            bubbles: true,
            composed: true,
            detail: { item, value: item.value },
        }));
        this.#close('select', true);
    }
    /** Набор букв подряд в пределах секунды ищет пункт по началу подписи. */
    #typeAhead(key) {
        const now = Date.now();
        this.#typed = now - this.#typedAt < 900 ? this.#typed + key : key;
        this.#typedAt = now;
        const enabled = this.#enabled();
        const start = enabled.indexOf(this.#focusedItem()) + 1;
        const query = this.#typed.toLowerCase();
        for (let offset = 0; offset < enabled.length; offset += 1) {
            const button = enabled[(start + offset) % enabled.length];
            if (button.textContent.trim().toLowerCase().startsWith(query)) {
                button.focus();
                return;
            }
        }
    }
    #onTriggerClick = (event) => {
        // Клик мышью открывает без подсветки пункта, Enter и Space с клавиатуры — с первым пунктом.
        const fromKeyboard = event.detail === 0;
        this.#toggle(!this.open, fromKeyboard ? 0 : -1);
    };
    #onTriggerKeyDown = (event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const index = event.key === 'ArrowDown' ? 0 : this.#enabled().length - 1;
            if (this.open)
                this.#focusAt(index);
            else
                this.#toggle(true, index);
        }
    };
    #onMenuKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.#move(1);
                return;
            case 'ArrowUp':
                event.preventDefault();
                this.#move(-1);
                return;
            case 'Home':
                event.preventDefault();
                this.#focusAt(0);
                return;
            case 'End':
                event.preventDefault();
                this.#focusAt(-1);
                return;
            case 'Escape':
                event.preventDefault();
                event.stopPropagation();
                this.#close('escape', true);
                return;
            case 'Tab':
                this.#close('tab');
                return;
            default:
                break;
        }
        if (event.key.length === 1 && event.key !== ' ' && !event.metaKey && !event.ctrlKey) {
            this.#typeAhead(event.key);
        }
    };
    #onOutsidePointerDown = (event) => {
        if (this.open && !event.composedPath().includes(this)) {
            this.#close('outside');
        }
    };
    #renderItem(item, index) {
        return html `
      ${item.divider ? html `<li role="separator" class="divider"></li>` : nothing}
      <li role="none">
        <button
          class="item${item.danger ? ' danger' : ''}"
          type="button"
          role="menuitem"
          tabindex="-1"
          ?disabled=${item.disabled ?? false}
          @pointermove=${(event) => {
            event.currentTarget.focus({ preventScroll: true });
        }}
          @click=${() => {
            this.#select(index);
        }}
        >
          ${item.icon ? html `<h-icon name=${item.icon} aria-hidden="true"></h-icon>` : nothing}
          ${item.label}
        </button>
      </li>
    `;
    }
    render() {
        const menuId = `${this.#id}-menu`;
        const icon = this.icon || (this.iconOnly ? 'ellipsis' : '');
        return html `
      <button
        type="button"
        class="trigger"
        aria-haspopup="menu"
        aria-expanded=${String(this.open)}
        aria-controls=${menuId}
        aria-label=${this.iconOnly ? this.label : nothing}
        ?disabled=${this.disabled}
        @click=${this.#onTriggerClick}
        @keydown=${this.#onTriggerKeyDown}
      >
        ${icon ? html `<h-icon name=${icon} aria-hidden="true"></h-icon>` : nothing}
        ${this.iconOnly
            ? nothing
            : html `
              ${this.label}
              <h-icon class="chevron" name="chevron-down" size="sm" aria-hidden="true"></h-icon>
            `}
      </button>
      <ul
        id=${menuId}
        class="menu"
        role="menu"
        tabindex="-1"
        aria-label=${this.label}
        hidden
        @keydown=${this.#onMenuKeyDown}
        @pointerleave=${() => {
            if (this.open)
                this.#menu?.focus();
        }}
      >
        ${this.items.map((item, index) => this.#renderItem(item, index))}
      </ul>
    `;
    }
}
customElements.define('h-dropdown-menu', HDropdownMenu);
