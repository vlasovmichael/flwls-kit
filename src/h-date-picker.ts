import { LitElement, css, html, nothing } from 'lit';
import { EASE, SPRING, play } from './motion.js';
import './h-icon.js';

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Ключ дня в местном времени: toISOString сдвинул бы дату на часовой пояс. */
export const dayKey = (d: Date) =>
  `${String(d.getFullYear())}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** «2026-10-03» → полночь этого дня в местном времени; мусор → null. */
export function parseDay(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return dayKey(date) === match[0] ? date : null;
}

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Тот же день через n месяцев; 31-е в коротком месяце становится последним днём. */
function addMonths(d: Date, n: number) {
  const last = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), last));
}

/** Первый день недели по локали: 1 — понедельник, 7 — воскресенье. */
export function firstWeekday(locale: string) {
  try {
    const info = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    return info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay ?? 1;
  } catch {
    return 1;
  }
}

// Без Popover API (старый Safari, тестовый DOM) календарь показывается атрибутом hidden.
const hasPopover = (el: HTMLElement) => typeof el.showPopover === 'function';
const isShown = (el: HTMLElement) => (hasPopover(el) ? el.matches(':popover-open') : !el.hidden);

function show(el: HTMLElement) {
  if (hasPopover(el)) el.showPopover();
  else el.hidden = false;
}

function hide(el: HTMLElement) {
  if (hasPopover(el)) el.hidePopover();
  else el.hidden = true;
}

/** Шесть недель всегда: при листании месяцев сетка не меняет высоту. */
export function monthGrid(year: number, month: number, weekStart: number) {
  const first = new Date(year, month, 1);
  const shift = (first.getDay() - (weekStart % 7) + 7) % 7;
  return Array.from({ length: 42 }, (_, i) => addDays(first, i - shift));
}

/** Поле даты с календарём. Значение — `YYYY-MM-DD`, с атрибутом `time` — `YYYY-MM-DDTHH:MM`. */
export class HDatePicker extends LitElement {
  static properties = {
    value: { type: String, reflect: true },
    min: { type: String },
    max: { type: String },
    time: { type: Boolean, reflect: true },
    label: { type: String },
    placeholder: { type: String },
    locale: { type: String },
    disabled: { type: Boolean, reflect: true },
    open: { type: Boolean, reflect: true },
    _view: { state: true },
    _focus: { state: true },
  };

  static styles = css`
    :host {
      display: inline-block;
      color: var(--ink);
      font-family: var(--sans);
    }

    .trigger {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      min-width: 12rem;
      min-height: calc(var(--space-6) + var(--space-3));
      padding: 0 var(--space-4) 0 var(--space-3);
      border: var(--border-thin) solid var(--ink-3);
      border-radius: var(--radius-sm);
      background: var(--panel);
      color: var(--ink);
      cursor: pointer;
      font: var(--text-base) / 1 var(--sans);
      font-variant-numeric: tabular-nums;
      text-align: left;
      transition: border-color 160ms ease, background 160ms ease;
    }

    .trigger:hover,
    :host([open]) .trigger {
      border-color: var(--ink-2);
      background: var(--panel-raised);
    }

    .trigger h-icon {
      color: var(--ink-3);
    }

    .placeholder {
      color: var(--ink-3);
    }

    .trigger:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    button:focus-visible,
    input:focus-visible,
    td:focus-visible {
      outline: var(--border-thick) solid var(--accent);
      outline-offset: 2px;
    }

    /* Календарь в верхнем слое: его не обрезает overflow: hidden у предков поля. */
    .pop {
      position: fixed;
      inset: auto;
      top: var(--y, 0);
      left: var(--x, 0);
      box-sizing: border-box;
      width: 18.5rem;
      margin: 0;
      padding: var(--space-3);
      border: var(--border-thin) solid var(--rule);
      border-radius: var(--radius);
      background: var(--panel);
      box-shadow: var(--shadow-float);
      color: var(--ink);
      font-family: var(--sans);
      overflow: visible;
    }

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
    }

    .title {
      font-family: var(--display);
      font-size: var(--text-base);
      font-weight: 600;
      text-transform: capitalize;
    }

    .nav {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--space-8);
      height: var(--space-8);
      padding: 0;
      border: var(--border-thin) solid transparent;
      border-radius: var(--radius-pill);
      background: transparent;
      color: var(--ink-2);
      cursor: pointer;
    }

    .nav:hover {
      border-color: var(--rule);
      background: var(--sheen);
      color: var(--ink);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    th {
      padding: var(--space-1) 0 var(--space-2);
      color: var(--ink-3);
      font-size: var(--text-label);
      font-weight: 500;
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
    }

    td {
      position: relative;
      height: calc(var(--space-8) + var(--space-1));
      padding: 0;
      border-radius: var(--radius-pill);
      color: var(--ink);
      cursor: pointer;
      font-size: var(--text-body);
      font-variant-numeric: tabular-nums;
      text-align: center;
      transition: background 120ms ease;
    }

    td:hover:not([aria-disabled='true'], [aria-selected='true']) {
      background: var(--sheen);
      box-shadow: inset 0 0 0 var(--border-thin) var(--rule);
    }

    td.outside {
      color: var(--ink-3);
    }

    /* Сегодня — точка под числом, чтобы не спорить с выбранным днём. */
    td[aria-current='date']::after {
      position: absolute;
      bottom: var(--space-1);
      left: 50%;
      width: var(--space-1);
      height: var(--space-1);
      border-radius: var(--radius-pill);
      background: var(--accent);
      content: '';
      transform: translateX(-50%);
    }

    td[aria-selected='true'] {
      background: var(--accent);
      color: var(--accent-ink);
      font-weight: 600;
    }

    td[aria-selected='true']::after {
      background: var(--accent-ink);
    }

    td[aria-disabled='true'] {
      cursor: not-allowed;
      opacity: var(--opacity-disabled);
    }

    .foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
      margin-top: var(--space-2);
      padding-top: var(--space-3);
      border-top: var(--border-thin) solid var(--rule-soft);
    }

    .foot input {
      box-sizing: border-box;
      height: calc(var(--space-6) + var(--space-2));
      padding: 0 var(--space-2);
      border: var(--border-thin) solid var(--ink-3);
      border-radius: var(--radius-sm);
      background: var(--panel);
      color: var(--ink);
      font: var(--text-base) var(--mono);
      color-scheme: inherit;
    }

    .text-button {
      margin-left: auto;
      padding: var(--space-2) var(--space-3);
      border: var(--border-thin) solid var(--rule-strong);
      border-radius: var(--radius-pill);
      background: var(--panel);
      color: var(--ink);
      cursor: pointer;
      font: 500 var(--text-small) / 1 var(--sans);
    }

    .text-button:hover {
      background: var(--panel-raised);
    }

    @media (prefers-reduced-motion: reduce) {
      .trigger,
      td {
        transition: none;
      }
    }
  `;

  declare value: string;

  declare min: string;

  declare max: string;

  declare time: boolean;

  declare label: string;

  declare placeholder: string;

  declare locale: string;

  declare disabled: boolean;

  declare open: boolean;

  /** Первое число показанного месяца. */
  declare _view: Date;

  /** День с фокусом клавиатуры: по нему ходят стрелки. */
  declare _focus: Date;

  #leaving: Animation | null = null;

  constructor() {
    super();
    this.value = '';
    this.min = '';
    this.max = '';
    this.time = false;
    this.label = 'Date';
    this.placeholder = 'Pick a date';
    this.locale = '';
    this.disabled = false;
    this.open = false;
    const today = new Date();
    this._focus = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    this._view = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('pointerdown', this.#onOutside);
  }

  disconnectedCallback() {
    document.removeEventListener('pointerdown', this.#onOutside);
    this.#unfollow();
    super.disconnectedCallback();
  }

  get #lang() {
    return this.locale || document.documentElement.lang || navigator.language || 'en';
  }

  get #pop() {
    return this.renderRoot.querySelector<HTMLElement>('.pop');
  }

  get #trigger() {
    return this.renderRoot.querySelector<HTMLButtonElement>('.trigger');
  }

  get #clock() {
    return this.time ? this.value.slice(11, 16) : '';
  }

  #allowed(day: Date) {
    const key = dayKey(day);
    return !(this.min && key < this.min.slice(0, 10)) && !(this.max && key > this.max.slice(0, 10));
  }

  /** Ближайший допустимый день: фокус не уходит за min и max. */
  #clamp(day: Date) {
    const min = parseDay(this.min);
    const max = parseDay(this.max);
    if (min && day < min) return min;
    if (max && day > max) return max;
    return day;
  }

  #commit(day: Date, clock = this.#clock) {
    const date = dayKey(day);
    const now = new Date();
    const time = clock || `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
    this.value = this.time ? `${date}T${time}` : date;
    this.dispatchEvent(
      new CustomEvent('change', { bubbles: true, composed: true, detail: { value: this.value } }),
    );
  }

  #moveFocus(day: Date) {
    const next = this.#clamp(day);
    this._focus = next;
    this._view = new Date(next.getFullYear(), next.getMonth(), 1);
    void this.updateComplete.then(() => {
      this.renderRoot.querySelector<HTMLElement>('td[tabindex="0"]')?.focus();
    });
  }

  #toggle(next: boolean) {
    if (next && this.disabled) return;
    if (this.open === next) return;
    this.open = next;
  }

  #today() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  // Открытие любым путём — кнопкой или свойством — показывает месяц выбранного дня.
  willUpdate(changed: Map<PropertyKey, unknown>) {
    if (!changed.has('open') || !this.open) return;
    const start = this.#clamp(parseDay(this.value) ?? this.#today());
    this._focus = start;
    this._view = new Date(start.getFullYear(), start.getMonth(), 1);
  }

  firstUpdated() {
    const pop = this.#pop;
    if (pop && !hasPopover(pop)) pop.hidden = true;
  }

  updated(changed: Map<PropertyKey, unknown>) {
    if (!changed.has('open')) return;
    // Открыто с первого рендера: показать без анимации и без кражи фокуса.
    if (changed.get('open') === undefined) {
      if (this.open) this.#enter(false);
      return;
    }
    if (this.open) this.#enter(true);
    else void this.#leave();
  }

  #enter(interactive: boolean) {
    const pop = this.#pop;
    if (!pop) return;
    this.#leaving?.cancel();
    this.#leaving = null;
    if (!isShown(pop)) show(pop);
    this.#place();
    this.#follow();
    if (!interactive) return;
    const up = pop.dataset.side === 'top';
    play(
      pop,
      [
        { opacity: 0, transform: `translateY(${up ? '6px' : '-6px'}) scale(0.98)` },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 200, easing: SPRING },
    );
    pop.querySelector<HTMLElement>('td[tabindex="0"]')?.focus();
  }

  async #leave() {
    const pop = this.#pop;
    this.#unfollow();
    if (!pop || !isShown(pop)) return;
    const out = play(pop, [{ opacity: 1 }, { opacity: 0 }], {
      duration: 120,
      easing: EASE,
      fill: 'forwards',
    });
    this.#leaving = out;
    if (out) {
      await out.finished.catch(() => undefined);
      // Открыли снова, пока календарь уходил: уход отменён в #enter.
      if (this.#leaving !== out) return;
      out.cancel();
    }
    this.#leaving = null;
    hide(pop);
  }

  /** Под полем, если влезает; иначе над ним. По горизонтали прижат к окну. */
  #place = () => {
    const pop = this.#pop;
    const trigger = this.#trigger;
    if (!pop || !trigger) return;
    const margin = 8;
    const gap = 6;
    const from = trigger.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = pop;

    const left = Math.min(Math.max(margin, from.left), window.innerWidth - margin - width);
    const fitsBelow = from.bottom + gap + height <= window.innerHeight - margin;
    const up = !fitsBelow && from.top - gap - height >= margin;
    const top = up ? from.top - gap - height : from.bottom + gap;

    pop.dataset.side = up ? 'top' : 'bottom';
    pop.style.setProperty('--x', `${String(Math.round(left))}px`);
    pop.style.setProperty('--y', `${String(Math.round(top))}px`);
  };

  // Страница под календарём живёт: при прокрутке он едет вместе с полем.
  #follow() {
    window.addEventListener('scroll', this.#place, true);
    window.addEventListener('resize', this.#place);
  }

  #unfollow() {
    window.removeEventListener('scroll', this.#place, true);
    window.removeEventListener('resize', this.#place);
  }

  #onOutside = (event: PointerEvent) => {
    if (this.open && !event.composedPath().includes(this)) this.#toggle(false);
  };

  #close(returnFocus: boolean) {
    this.#toggle(false);
    if (returnFocus) this.#trigger?.focus();
  }

  #onPopKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.#close(true);
    }
  };

  // Фокус ушёл из календаря табом — закрываем без возврата фокуса, человек уже идёт дальше.
  #onPopFocusOut = (event: FocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (this.open && next && !this.renderRoot.contains(next)) this.#toggle(false);
  };

  #onGridKeyDown = (event: KeyboardEvent) => {
    const day = this._focus;
    const weekStart = firstWeekday(this.#lang);
    const offset = (day.getDay() - (weekStart % 7) + 7) % 7;
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(day, -1),
      ArrowRight: () => addDays(day, 1),
      ArrowUp: () => addDays(day, -7),
      ArrowDown: () => addDays(day, 7),
      Home: () => addDays(day, -offset),
      End: () => addDays(day, 6 - offset),
      PageUp: () => addMonths(day, event.shiftKey ? -12 : -1),
      PageDown: () => addMonths(day, event.shiftKey ? 12 : 1),
    };
    if (event.key in moves) {
      event.preventDefault();
      this.#moveFocus(moves[event.key]());
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.#pick(day);
    }
  };

  #pick(day: Date) {
    if (!this.#allowed(day)) return;
    this.#commit(day);
    this._focus = day;
    // С временем календарь остаётся открытым: следующим шагом обычно правят час.
    if (!this.time) this.#close(true);
  }

  #onTime = (event: Event) => {
    const clock = (event.target as HTMLInputElement).value;
    if (!clock) return;
    this.#commit(parseDay(this.value) ?? this.#today(), clock);
  };

  #caption() {
    const day = parseDay(this.value);
    if (!day) return html`<span class="placeholder">${this.placeholder}</span>`;
    const date = new Intl.DateTimeFormat(this.#lang, { dateStyle: 'medium' }).format(day);
    return html`<span>${this.time && this.#clock ? `${date}, ${this.#clock}` : date}</span>`;
  }

  #grid() {
    const lang = this.#lang;
    const weekStart = firstWeekday(lang);
    const days = monthGrid(this._view.getFullYear(), this._view.getMonth(), weekStart);
    const full = new Intl.DateTimeFormat(lang, { dateStyle: 'full' });
    const short = new Intl.DateTimeFormat(lang, { weekday: 'short' });
    const long = new Intl.DateTimeFormat(lang, { weekday: 'long' });
    const today = dayKey(new Date());
    const selected = this.value.slice(0, 10);
    const focus = dayKey(this._focus);
    const weeks = Array.from({ length: 6 }, (_, w) => days.slice(w * 7, w * 7 + 7));

    return html`
      <table role="grid" aria-labelledby="title" @keydown=${this.#onGridKeyDown}>
        <thead>
          <tr>
            ${days.slice(0, 7).map(
              (d) => html`<th scope="col" abbr=${long.format(d)}>${short.format(d)}</th>`,
            )}
          </tr>
        </thead>
        <tbody>
          ${weeks.map(
            (week) => html`<tr>
              ${week.map((d) => {
                const key = dayKey(d);
                const allowed = this.#allowed(d);
                return html`<td
                  class=${d.getMonth() === this._view.getMonth() ? '' : 'outside'}
                  data-day=${key}
                  tabindex=${key === focus ? '0' : '-1'}
                  aria-label=${full.format(d)}
                  aria-selected=${String(key === selected)}
                  aria-current=${key === today ? 'date' : nothing}
                  aria-disabled=${allowed ? nothing : 'true'}
                  @click=${() => {
                    this.#pick(d);
                  }}
                >
                  ${d.getDate()}
                </td>`;
              })}
            </tr>`,
          )}
        </tbody>
      </table>
    `;
  }

  render() {
    const title = new Intl.DateTimeFormat(this.#lang, { month: 'long', year: 'numeric' }).format(
      this._view,
    );
    const shift = (n: number) => () => {
      this._view = addMonths(this._view, n);
      this._focus = this.#clamp(addMonths(this._focus, n));
    };

    return html`
      <button
        type="button"
        class="trigger"
        aria-haspopup="dialog"
        aria-expanded=${String(this.open)}
        aria-label=${`${this.label}: ${this.value ? this.#captionText() : this.placeholder}`}
        ?disabled=${this.disabled}
        @click=${() => {
          this.#toggle(!this.open);
        }}
      >
        <h-icon name="calendar" aria-hidden="true"></h-icon>
        ${this.#caption()}
      </button>
      <div
        class="pop"
        popover="manual"
        role="dialog"
        aria-label=${this.label}
        @keydown=${this.#onPopKeyDown}
        @focusout=${this.#onPopFocusOut}
      >
        <div class="head">
          <button type="button" class="nav" aria-label="Previous month" @click=${shift(-1)}>
            <h-icon name="chevron-left" aria-hidden="true"></h-icon>
          </button>
          <span id="title" class="title" aria-live="polite">${title}</span>
          <button type="button" class="nav" aria-label="Next month" @click=${shift(1)}>
            <h-icon name="chevron-right" aria-hidden="true"></h-icon>
          </button>
        </div>
        ${this.#grid()}
        <div class="foot">
          ${this.time
            ? html`<input
                type="time"
                aria-label="Time"
                .value=${this.#clock}
                @change=${this.#onTime}
              />`
            : nothing}
          ${this.time
            ? html`<button type="button" class="text-button" @click=${() => {
                this.#close(true);
              }}>Done</button>`
            : html`<button type="button" class="text-button" @click=${() => {
                this.#pick(this.#clamp(this.#today()));
              }}>Today</button>`}
        </div>
      </div>
    `;
  }

  #captionText() {
    const day = parseDay(this.value);
    if (!day) return '';
    const date = new Intl.DateTimeFormat(this.#lang, { dateStyle: 'long' }).format(day);
    return this.time && this.#clock ? `${date}, ${this.#clock}` : date;
  }
}

customElements.define('h-date-picker', HDatePicker);
