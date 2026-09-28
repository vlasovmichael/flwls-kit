import { LitElement, html } from 'lit';
/** Левая граница ближайшего предка, который обрезает содержимое по горизонтали. */
function clipLeft(node) {
    for (let parent = node.parentElement; parent; parent = parent.parentElement) {
        if (getComputedStyle(parent).overflowX !== 'visible')
            return parent.getBoundingClientRect().left;
    }
    return 0;
}
export class HSelect extends LitElement {
    static properties = {
        options: { attribute: false },
        value: { type: String },
        label: { type: String },
    };
    #open = false;
    #active = 0;
    #typed = '';
    #typedAt = 0;
    #uid = `sel${Math.random().toString(36).slice(2, 8)}`;
    constructor() {
        super();
        this.options = [];
        this.value = '';
        this.label = '';
    }
    createRenderRoot() {
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
        this.className = 'select';
        this.dataset.uid = this.#uid;
        document.addEventListener('pointerdown', this.#outside);
    }
    disconnectedCallback() {
        document.removeEventListener('pointerdown', this.#outside);
        super.disconnectedCallback();
    }
    updated(changed) {
        if (changed.has('options') || changed.has('value')) {
            this.#active = Math.max(0, this.options.findIndex((option) => option.value === this.value));
        }
    }
    #setOpen(next) {
        this.#open = next;
        this.dataset.open = String(next);
        if (next)
            this.#active = Math.max(0, this.options.findIndex((option) => option.value === this.value));
        this.requestUpdate();
        if (next)
            void this.#place();
    }
    /** У края экрана или контейнера список разворачивается туда, где есть место. */
    async #place() {
        await this.updateComplete;
        const list = this.querySelector('.select-list');
        if (!list)
            return;
        this.classList.remove('is-up', 'is-start');
        if (window.innerHeight - list.getBoundingClientRect().bottom < 8)
            this.classList.add('is-up');
        if (list.getBoundingClientRect().left < clipLeft(this) + 8)
            this.classList.add('is-start');
        this.#showActive();
    }
    #showActive() {
        this.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
    }
    #choose(index) {
        const option = this.options[index];
        this.#setOpen(false);
        if (option.value === this.value)
            return;
        this.value = option.value;
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: this.value }));
    }
    #move(step) {
        if (!this.#open) {
            this.#setOpen(true);
            return;
        }
        this.#active = (this.#active + step + this.options.length) % this.options.length;
        this.requestUpdate();
        void this.updateComplete.then(() => {
            this.#showActive();
        });
    }
    #outside = (event) => {
        if (this.#open && !this.contains(event.target))
            this.#setOpen(false);
    };
    #keyDown = (event) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                {
                    this.#move(1);
                    return;
                }
            case 'ArrowUp':
                event.preventDefault();
                {
                    this.#move(-1);
                    return;
                }
            case 'Home':
                event.preventDefault();
                this.#active = 0;
                {
                    this.requestUpdate();
                    return;
                }
            case 'End':
                event.preventDefault();
                this.#active = this.options.length - 1;
                {
                    this.requestUpdate();
                    return;
                }
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (this.#open)
                    this.#choose(this.#active);
                else
                    this.#setOpen(true);
                return;
            case 'Escape':
            case 'Tab': {
                this.#setOpen(false);
                return;
            }
            default: break;
        }
        if (event.key.length !== 1)
            return undefined;
        const now = Date.now();
        this.#typed = now - this.#typedAt < 900 ? this.#typed + event.key : event.key;
        this.#typedAt = now;
        const found = this.options.findIndex((option) => option.label.toLowerCase().startsWith(this.#typed.toLowerCase()));
        if (found < 0)
            return undefined;
        this.#active = found;
        if (this.#open)
            this.requestUpdate();
        else
            this.#choose(found);
    };
    render() {
        const selected = this.options.find((option) => option.value === this.value)?.label ?? '';
        return html `
      <button type="button" class="select-button" aria-haspopup="listbox" aria-expanded=${String(this.#open)} aria-label=${this.label || null} @click=${() => { this.#setOpen(!this.#open); }} @keydown=${this.#keyDown}>
        <span>${selected}</span><svg viewBox="0 0 24 24" class="icon chevron" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>
      </button>
      <ul class="select-list" role="listbox" ?hidden=${!this.#open} aria-activedescendant=${this.#open ? `${this.#uid}-o${String(this.#active)}` : null}>
        ${this.options.map((option, index) => html `<li class="select-option${index === this.#active ? ' is-active' : ''}" role="option" aria-selected=${String(option.value === this.value)} id=${`${this.#uid}-o${String(index)}`} @mouseenter=${() => { this.#active = index; this.requestUpdate(); }} @pointerdown=${(event) => { event.preventDefault(); this.#choose(index); }}>${option.label}<svg viewBox="0 0 24 24" class="icon tick" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg></li>`)}
      </ul>
    `;
    }
}
customElements.define('h-select', HSelect);
