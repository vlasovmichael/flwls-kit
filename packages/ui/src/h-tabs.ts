import { LitElement, css, html } from 'lit';

export type TabsOrientation = 'horizontal' | 'vertical';

export type TabsActivation = 'automatic' | 'manual';

export type TabsVariant = 'contained' | 'wrap';

type TabState = {
  controls?: string;
  selected: boolean;
  tabIndex: number;
  variant: string;
  orientation: string;
};

type PanelState = {
  labelledBy?: string;
  selected: boolean;
};

let tabsCount = 0;

/** Отдельная вкладка получает выбор и связи ARIA от родительского контейнера. */
export class HTab extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      min-height: calc(var(--space-6) + var(--space-2));
      padding: var(--space-2) var(--space-3);
      border: var(--border-thick) solid transparent;
      border-radius: var(--radius-sm);
      color: var(--ink-2);
      cursor: pointer;
      font-family: var(--sans);
      font-size: var(--text-base);
      font-weight: 500;
      line-height: 1;
      user-select: none;
    }

    :host(:hover) {
      color: var(--ink);
    }

    :host([aria-selected='true']) {
      color: var(--ink);
    }

    /* contained: выбранная вкладка — подложка на дорожке, как у SegmentedControl. */
    :host([data-variant='contained']) {
      border-radius: var(--radius-pill);
    }

    :host([data-variant='contained'][aria-selected='true']) {
      background: var(--panel);
      box-shadow:
        var(--shadow),
        inset 0 0 0 var(--border-thin) var(--rule);
    }

    :host([data-variant='contained'][data-orientation='vertical']) {
      border-radius: var(--radius-sm);
    }

    /* wrap: подчёркивание акцентом поверх линии списка. */
    :host([data-variant='wrap']) {
      margin-bottom: calc(-1 * var(--border-thin));
      border-width: 0 0 var(--border-thick);
      border-radius: 0;
    }

    :host([data-variant='wrap'][aria-selected='true']) {
      border-bottom-color: var(--accent);
    }

    :host([aria-disabled='true']) {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    :host(:focus-visible) {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: -2px;
    }
  `;

  declare value: string;

  declare disabled: boolean;

  constructor() {
    super();
    this.value = '';
    this.disabled = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'tab');
  }

  /** Родитель задаёт roving tabindex и указывает связанную панель. */
  setState(state: TabState) {
    if (state.controls) {
      this.setAttribute('aria-controls', state.controls);
    } else {
      this.removeAttribute('aria-controls');
    }

    this.setAttribute('aria-selected', String(state.selected));
    this.setAttribute('aria-disabled', String(this.disabled));
    // Вид задаёт родитель атрибутом: :host-context() не работает в Firefox и Safari.
    this.dataset.variant = state.variant;
    this.dataset.orientation = state.orientation;
    this.tabIndex = state.tabIndex;
    this.requestUpdate();
  }

  updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has('disabled')) {
      this.setAttribute('aria-disabled', String(this.disabled));
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('h-tab', HTab);

/** Панель видна только для выбранной вкладки с тем же значением. */
export class HTabPanel extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--ink);
      font-family: var(--sans);
    }

    :host([hidden]) {
      display: none;
    }
  `;

  declare value: string;

  constructor() {
    super();
    this.value = '';
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'tabpanel');
    this.tabIndex = 0;
  }

  /** Родитель связывает панель с вкладкой и скрывает неактивное содержимое. */
  setState(state: PanelState) {
    if (state.labelledBy) {
      this.setAttribute('aria-labelledby', state.labelledBy);
    } else {
      this.removeAttribute('aria-labelledby');
    }

    this.hidden = !state.selected;
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('h-tab-panel', HTabPanel);

/** Контейнер реализует паттерн ARIA tabs с roving tabindex. */
export class HTabs extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    orientation: { type: String, reflect: true },
    activation: { type: String, reflect: true },
    variant: { type: String, reflect: true },
    label: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    .tablist {
      display: flex;
      gap: var(--space-1);
    }

    :host([orientation='vertical']) .tablist {
      flex-direction: column;
      align-items: stretch;
    }

    :host([variant='wrap']) .tablist {
      flex-wrap: wrap;
      border-bottom: var(--border-thin) solid var(--rule);
    }

    :host([variant='contained']) .tablist {
      width: fit-content;
      padding: var(--space-1);
      border: var(--border-thin) solid var(--rule);
      border-radius: var(--radius-pill);
      background: var(--panel-sunk);
    }

    /* Высокая дорожка с радиусом-пилюлей превращается в овал. */
    :host([variant='contained'][orientation='vertical']) .tablist {
      border-radius: calc(var(--radius-sm) + var(--space-1));
    }

    .panels {
      padding-top: var(--space-3);
    }

    /* Вертикальный список стоит слева от панели, а не над ней. */
    :host([orientation='vertical']) {
      display: flex;
      gap: var(--space-4);
      align-items: flex-start;
    }

    :host([orientation='vertical']) .tablist {
      flex: none;
    }

    :host([orientation='vertical']) .panels {
      flex: 1;
      min-width: 0;
      padding-top: 0;
    }
  `;

  declare value: string;

  declare orientation: TabsOrientation;

  declare activation: TabsActivation;

  declare variant: TabsVariant;

  declare label: string;

  #id = `tabs-${String(++tabsCount)}`;

  #focusedValue = '';

  #observer = new MutationObserver(() => {
    this.#syncChildren();
  });

  constructor() {
    super();
    this.value = '';
    this.orientation = 'horizontal';
    this.activation = 'automatic';
    this.variant = 'contained';
    this.label = 'Tabs';
  }

  connectedCallback() {
    super.connectedCallback();
    this.#observer.observe(this, {
      attributes: true,
      attributeFilter: ['disabled', 'value'],
      childList: true,
    });
    this.addEventListener('click', this.#onClick);
    this.addEventListener('focusin', this.#onFocusIn);
    this.addEventListener('keydown', this.#onKeyDown);
    this.#syncChildren();
  }

  disconnectedCallback() {
    this.#observer.disconnect();
    this.removeEventListener('click', this.#onClick);
    this.removeEventListener('focusin', this.#onFocusIn);
    this.removeEventListener('keydown', this.#onKeyDown);
    super.disconnectedCallback();
  }

  updated() {
    this.#syncChildren();
  }

  /** Проставляем служебные слоты, чтобы потребителю не нужен был лишний атрибут. */
  #assignSlots() {
    for (const tab of this.#tabs()) {
      if (tab.slot !== 'tab') {
        tab.slot = 'tab';
      }
    }

    for (const panel of this.#panels()) {
      if (panel.slot !== 'panel') {
        panel.slot = 'panel';
      }
    }
  }

  #tabs() {
    return [...this.querySelectorAll<HTab>(':scope > h-tab')];
  }

  #panels() {
    return [...this.querySelectorAll<HTabPanel>(':scope > h-tab-panel')];
  }

  #tabId(tab: HTab, index: number) {
    if (!tab.id) {
      tab.id = `${this.#id}-tab-${String(index + 1)}`;
    }

    return tab.id;
  }

  #panelId(panel: HTabPanel, index: number) {
    if (!panel.id) {
      panel.id = `${this.#id}-panel-${String(index + 1)}`;
    }

    return panel.id;
  }

  /** Выбранной может стать только существующая доступная вкладка. */
  #syncChildren() {
    this.#assignSlots();
    const tabs = this.#tabs();
    const panels = this.#panels();
    const selected = tabs.find((tab) => tab.value === this.value && !tab.disabled)
      ?? tabs.find((tab) => !tab.disabled);
    const nextValue = selected?.value ?? '';

    if (this.value !== nextValue) {
      this.value = nextValue;
    }

    const focused = tabs.find((tab) => {
      return tab.value === this.#focusedValue && !tab.disabled;
    }) ?? selected;

    this.#focusedValue = focused?.value ?? '';

    tabs.forEach((tab) => {
      const panel = panels.find((item) => item.value === tab.value);
      tab.setState({
        controls: panel ? this.#panelId(panel, panels.indexOf(panel)) : undefined,
        selected: tab === selected,
        tabIndex: tab === focused ? 0 : -1,
        variant: this.variant,
        orientation: this.orientation,
      });
    });

    panels.forEach((panel) => {
      const tab = tabs.find((item) => item.value === panel.value);
      panel.setState({
        labelledBy: tab ? this.#tabId(tab, tabs.indexOf(tab)) : undefined,
        selected: panel.value === nextValue,
      });
    });
  }

  #tabFromEvent(event: Event) {
    return event.composedPath().find((node): node is HTab => node instanceof HTab);
  }

  #onClick = (event: MouseEvent) => {
    const tab = this.#tabFromEvent(event);

    if (!tab) {
      return;
    }

    if (tab.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    this.#select(tab);
  };

  /** Фокус меняет единственную вкладку, доступную по Tab. */
  #onFocusIn = (event: FocusEvent) => {
    const tab = this.#tabFromEvent(event);

    if (!tab || tab.disabled || this.#focusedValue === tab.value) {
      return;
    }

    this.#focusedValue = tab.value;
    this.#syncChildren();
  };

  #onKeyDown = (event: KeyboardEvent) => {
    const tab = this.#tabFromEvent(event);

    if (!tab || tab.disabled) {
      return;
    }

    const tabs = this.#tabs().filter((item) => !item.disabled);
    const index = tabs.indexOf(tab);
    const horizontal = this.orientation === 'horizontal';
    const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';
    const previousKey = horizontal ? 'ArrowLeft' : 'ArrowUp';

    if (event.key === nextKey || event.key === previousKey) {
      event.preventDefault();
      const direction = event.key === nextKey ? 1 : -1;
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      this.#focusTab(next);
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      this.#focusTab(event.key === 'Home' ? tabs[0] : tabs.at(-1));
      return;
    }

    if (this.activation === 'manual' && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.#select(tab);
    }
  };

  #focusTab(tab: HTab | undefined) {
    if (!tab) {
      return;
    }

    this.#focusedValue = tab.value;
    this.#syncChildren();
    tab.focus();

    if (this.activation === 'automatic') {
      this.#select(tab);
    }
  }

  #select(tab: HTab) {
    if (tab.disabled || this.value === tab.value) {
      return;
    }

    this.value = tab.value;
    this.#focusedValue = tab.value;
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: tab.value, tab },
      }),
    );
  }

  render() {
    const label = this.label || 'Tabs';

    return html`
      <div
        class="tablist"
        role="tablist"
        aria-label=${label}
        aria-orientation=${this.orientation}
      >
        <slot name="tab"></slot>
      </div>
      <div class="panels"><slot name="panel"></slot></div>
    `;
  }
}

customElements.define('h-tabs', HTabs);
