import { LitElement, css, html } from 'lit';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export type TooltipAlign = 'start' | 'center' | 'end';

/** Короткая подсказка поясняет элемент, не заменяя видимую подпись. */
export class HTooltip extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
    side: { type: String, reflect: true },
    align: { type: String, reflect: true },
    delay: { type: Number },
    disabled: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: contents;
      color: var(--ink);
      font-family: var(--sans);
    }

    .tooltip {
      position: fixed;
      z-index: var(--layer-popover);
      box-sizing: border-box;
      max-width: calc(var(--space-10) * 6);
      padding: var(--space-2) var(--space-3);
      border: var(--border-thin) solid var(--rule-strong);
      border-radius: var(--radius-sm);
      background: var(--panel-raised);
      box-shadow: var(--shadow-float);
      color: var(--ink);
      font-size: var(--text-small);
      line-height: 1.4;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }

    :host([open]) .tooltip {
      opacity: 1;
      visibility: visible;
    }

    @media (prefers-reduced-motion: no-preference) {
      .tooltip {
        transition: opacity 160ms ease;
      }
    }
  `;

  declare open: boolean;

  declare side: TooltipSide;

  declare align: TooltipAlign;

  declare delay: number;

  declare disabled: boolean;

  #id = `tooltip-${Math.random().toString(36).slice(2, 8)}`;

  #openTimer: ReturnType<typeof setTimeout> | null = null;

  #triggers = new Map<HTMLElement, string | null>();

  constructor() {
    super();
    this.open = false;
    this.side = 'top';
    this.align = 'center';
    this.delay = 400;
    this.disabled = false;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this.#onKeyDown);
    window.addEventListener('resize', this.#position);
    window.addEventListener('scroll', this.#position, true);
  }

  disconnectedCallback() {
    this.#clearOpenTimer();
    this.#restoreTriggers();
    document.removeEventListener('keydown', this.#onKeyDown);
    window.removeEventListener('resize', this.#position);
    window.removeEventListener('scroll', this.#position, true);
    super.disconnectedCallback();
  }

  firstUpdated() {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="trigger"]');

    slot?.addEventListener('slotchange', () => {
      this.#syncTriggers();
    });
    this.#syncTriggers();
  }

  updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has('disabled') && this.disabled) {
      this.#close();
    }

    if (changed.has('open')) {
      if (this.open) {
        this.#position();
      }

      if (changed.get('open') !== undefined) {
        this.dispatchEvent(
          new CustomEvent(this.open ? 'open' : 'close', {
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
  }

  // Слот хранит исходный aria-describedby, чтобы не испортить чужую связь.
  #syncTriggers() {
    const slot = this.renderRoot.querySelector<HTMLSlotElement>('slot[name="trigger"]');
    const current = new Set(slot?.assignedElements().filter(this.#isHtmlElement) ?? []);

    for (const [trigger, describedBy] of this.#triggers) {
      if (!current.has(trigger)) {
        this.#restoreTrigger(trigger, describedBy);
        this.#triggers.delete(trigger);
      }
    }

    for (const trigger of current) {
      if (this.#triggers.has(trigger)) {
        continue;
      }

      const describedBy = trigger.getAttribute('aria-describedby');
      this.#triggers.set(trigger, describedBy);
      const ids = describedBy?.split(/\s+/).filter(Boolean) ?? [];

      if (!ids.includes(this.#id)) {
        ids.push(this.#id);
        trigger.setAttribute('aria-describedby', ids.join(' '));
      }

      trigger.addEventListener('mouseenter', this.#onMouseEnter);
      trigger.addEventListener('mouseleave', this.#onMouseLeave);
      trigger.addEventListener('focusin', this.#onFocusIn);
      trigger.addEventListener('focusout', this.#onFocusOut);
      trigger.addEventListener('pointerdown', this.#onPointerDown);
    }

    this.#position();
  }

  #isHtmlElement(element: Element): element is HTMLElement {
    return element instanceof HTMLElement;
  }

  #restoreTriggers() {
    for (const [trigger, describedBy] of this.#triggers) {
      this.#restoreTrigger(trigger, describedBy);
    }

    this.#triggers.clear();
  }

  #restoreTrigger(trigger: HTMLElement, describedBy: string | null) {
    trigger.removeEventListener('mouseenter', this.#onMouseEnter);
    trigger.removeEventListener('mouseleave', this.#onMouseLeave);
    trigger.removeEventListener('focusin', this.#onFocusIn);
    trigger.removeEventListener('focusout', this.#onFocusOut);
    trigger.removeEventListener('pointerdown', this.#onPointerDown);

    if (describedBy === null) {
      trigger.removeAttribute('aria-describedby');
      return;
    }

    trigger.setAttribute('aria-describedby', describedBy);
  }

  #onMouseEnter = () => {
    this.#openAfterDelay();
  };

  #onMouseLeave = () => {
    this.#close();
  };

  #onFocusIn = () => {
    this.#openNow();
  };

  #onFocusOut = (event: FocusEvent) => {
    const trigger = event.currentTarget as HTMLElement;
    const next = event.relatedTarget as Node | null;

    if (!next || !trigger.contains(next)) {
      this.#close();
    }
  };

  // На сенсорном экране hover нет, поэтому касание переключает подсказку.
  #onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'touch') {
      return;
    }

    if (this.open) {
      this.#close();
      return;
    }

    this.#openNow();
  };

  #onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.open) {
      this.#close();
    }
  };

  #clearOpenTimer() {
    if (this.#openTimer === null) {
      return;
    }

    clearTimeout(this.#openTimer);
    this.#openTimer = null;
  }

  #openAfterDelay() {
    this.#clearOpenTimer();

    if (this.disabled || this.open) {
      return;
    }

    if (this.delay <= 0) {
      this.#openNow();
      return;
    }

    this.#openTimer = setTimeout(() => {
      this.#openTimer = null;
      this.#openNow();
    }, this.delay);
  }

  #openNow() {
    this.#clearOpenTimer();

    if (!this.disabled) {
      this.open = true;
    }
  }

  #close() {
    this.#clearOpenTimer();
    this.open = false;
  }

  // Координаты берём у trigger, а отступ — из шкалы токенов, а не из константы.
  #position = () => {
    if (!this.open) {
      return;
    }

    const trigger = this.#triggers.keys().next().value;
    const tooltip = this.renderRoot.querySelector<HTMLElement>('.tooltip');

    if (!trigger || !tooltip) {
      return;
    }

    const gap = Number.parseFloat(getComputedStyle(this).getPropertyValue('--space-2'));
    const safeGap = Number.isFinite(gap) ? gap : 0;
    const triggerBox = trigger.getBoundingClientRect();
    const tooltipBox = tooltip.getBoundingClientRect();
    let left = triggerBox.left;
    let top = triggerBox.bottom + safeGap;

    if (this.side === 'top' || this.side === 'bottom') {
      top = this.side === 'top'
        ? triggerBox.top - tooltipBox.height - safeGap
        : triggerBox.bottom + safeGap;
      left = this.#alignedPosition(
        triggerBox.left,
        triggerBox.width,
        tooltipBox.width,
      );
    } else {
      left = this.side === 'left'
        ? triggerBox.left - tooltipBox.width - safeGap
        : triggerBox.right + safeGap;
      top = this.#alignedPosition(
        triggerBox.top,
        triggerBox.height,
        tooltipBox.height,
      );
    }

    const clampedLeft = this.#clamp(left, tooltipBox.width, safeGap, window.innerWidth);
    const clampedTop = this.#clamp(top, tooltipBox.height, safeGap, window.innerHeight);

    tooltip.style.left = `${String(clampedLeft)}px`;
    tooltip.style.top = `${String(clampedTop)}px`;
  };

  #alignedPosition(start: number, length: number, tooltipLength: number) {
    if (this.align === 'start') {
      return start;
    }

    if (this.align === 'end') {
      return start + length - tooltipLength;
    }

    return start + (length - tooltipLength) / 2;
  }

  #clamp(position: number, tooltipLength: number, gap: number, viewportLength: number) {
    const limit = Math.max(gap, viewportLength - tooltipLength - gap);

    return Math.max(gap, Math.min(position, limit));
  }

  render() {
    return html`
      <slot name="trigger"></slot>
      <span id=${this.#id} class="tooltip" role="tooltip"><slot></slot></span>
    `;
  }
}

customElements.define('h-tooltip', HTooltip);
