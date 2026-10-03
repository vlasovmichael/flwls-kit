// Образцы токенов для Style Guide: значения читаются из живой темы, поэтому страница
// не расходится с tokens.css и перекрашивается вместе с ней. Клик по имени копирует var().
import { LitElement, css, html, unsafeCSS, type TemplateResult } from 'lit';
import {
  BORDER, BREAKPOINT, COLOR, FONT, LAYER, MOTION, OPACITY, PALETTE, RADIUS, SHADOW, SPACE, TEXT,
  TRACKING, type Token,
} from './catalog.ts';

const read = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Правило на каждый токен: образец красится классом, а не атрибутом style. */
const rules = (tokens: Token[], decl: (name: string) => string) =>
  tokens.map((t, i) => `.t${String(i)} { ${decl(t.name)} }`).join('\n');

const ROWS: Record<string, { tokens: Token[]; decl: (n: string) => string; sample: (i: string) => TemplateResult }> = {
  font: {
    tokens: FONT,
    decl: (n) => `font-family: var(${n});`,
    sample: (c) => html`<div class="sample ${c}">Profit 1,234.56 — Прибыль</div>`,
  },
  text: {
    tokens: TEXT,
    decl: (n) => `font-size: var(${n});`,
    sample: (c) => html`<div class="sample ${c}">Open interest 12,480</div>`,
  },
  tracking: {
    tokens: TRACKING,
    decl: (n) => `letter-spacing: var(${n});`,
    sample: (c) => html`<div class="sample caps ${c}">Open interest</div>`,
  },
  space: { tokens: SPACE, decl: (n) => `width: var(${n});`, sample: (c) => html`<div class="bar ${c}"></div>` },
  radius: { tokens: RADIUS, decl: (n) => `border-radius: var(${n});`, sample: (c) => html`<div class="box ${c}"></div>` },
  shadow: { tokens: SHADOW, decl: (n) => `box-shadow: var(${n});`, sample: (c) => html`<div class="box flat ${c}"></div>` },
  border: { tokens: BORDER, decl: (n) => `border-width: var(${n});`, sample: (c) => html`<div class="box line ${c}"></div>` },
  opacity: { tokens: OPACITY, decl: (n) => `opacity: var(${n});`, sample: (c) => html`<div class="fill ${c}"></div>` },
  breakpoint: { tokens: BREAKPOINT, decl: (n) => `width: calc(var(${n}) / 4);`, sample: (c) => html`<div class="bar ${c}"></div>` },
  layer: { tokens: LAYER, decl: () => '', sample: () => html`<div class="note">stacking order</div>` },
  motion: { tokens: MOTION, decl: (n) => `transition-timing-function: var(${n});`, sample: (c) => html`<div class="spring ${c}"></div>` },
};

class DsTokens extends LitElement {
  static properties = { kind: { type: String }, group: { type: String }, copied: { state: true } };

  declare kind: string;
  declare group: string;
  declare copied: string;

  static styles = css`
    :host { display: block; margin: 16px 0 32px; font-family: var(--sans); color: var(--ink); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
    .card { border: 1px solid var(--rule); border-radius: var(--radius-sm); background: var(--panel); overflow: hidden; }
    .chip { height: 72px; border-bottom: 1px solid var(--rule-soft); }
    .meta { padding: 10px 12px; display: grid; gap: 4px; }
    button.name { all: unset; cursor: copy; font: 500 12px/1.3 var(--mono); color: var(--ink); }
    button.name:hover { color: var(--accent); }
    button.name:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 3px; }
    .value { font: 12px/1.3 var(--mono); color: var(--ink-3); word-break: break-all; }
    .use { font-size: 13px; line-height: 1.4; color: var(--ink-2); }
    .rows { border: 1px solid var(--rule); border-radius: var(--radius-sm); background: var(--panel); }
    .row { display: grid; grid-template-columns: 190px 1fr 240px; gap: 16px; align-items: center; padding: 14px 16px; border-bottom: 1px solid var(--rule-soft); }
    .row:last-child { border-bottom: 0; }
    .sample { color: var(--ink); line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .caps { text-transform: uppercase; font-size: 12px; }
    .bar { height: 12px; background: var(--accent); border-radius: 3px; }
    .box { height: 64px; background: var(--panel-raised); border: 1px solid var(--rule); }
    .box.flat { border-color: transparent; background: var(--panel); }
    .box.line { border-style: solid; border-color: var(--accent); }
    .fill { height: 40px; border-radius: var(--radius-sm); background: var(--accent); }
    .note { font: 12px var(--mono); color: var(--ink-3); }
    .spring { width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--accent); transition: transform 600ms; }
    .row:hover .spring { transform: translateX(160px); }
    .toast { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); padding: 8px 14px; border-radius: var(--radius-sm); background: var(--ink); color: var(--panel); font: 12px var(--mono); }
    @media (max-width: 640px) { .row { grid-template-columns: 1fr; gap: 6px; } }
    @media (prefers-reduced-motion: reduce) { .spring { transition: none; } }
  `;

  #observer = new MutationObserver(() => { this.requestUpdate(); });
  #media = matchMedia('(prefers-color-scheme: dark)');
  #onMedia = () => { this.requestUpdate(); };
  #timer = 0;

  override connectedCallback() {
    super.connectedCallback();
    this.#observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    this.#media.addEventListener('change', this.#onMedia);
  }

  override disconnectedCallback() {
    this.#observer.disconnect();
    this.#media.removeEventListener('change', this.#onMedia);
    clearTimeout(this.#timer);
    super.disconnectedCallback();
  }

  #copy(name: string) {
    void navigator.clipboard.writeText(`var(${name})`);
    this.copied = `var(${name}) copied`;
    clearTimeout(this.#timer);
    this.#timer = window.setTimeout(() => { this.copied = ''; }, 1400);
  }

  #name(t: Token) {
    return html`<button class="name" title="Copy var(${t.name})" @click=${() => { this.#copy(t.name); }}>${t.name}</button>`;
  }

  #cards(tokens: Token[]) {
    return html`<style>${unsafeCSS(rules(tokens, (n) => `background: var(${n});`))}</style>
      <div class="grid">
        ${tokens.map((t, i) => html`<div class="card">
          <div class="chip t${String(i)}"></div>
          <div class="meta">${this.#name(t)}<span class="value">${read(t.name)}</span><span class="use">${t.use}</span></div>
        </div>`)}
      </div>`;
  }

  #rows(kind: string) {
    const spec = ROWS[kind];
    return html`<style>${unsafeCSS(rules(spec.tokens, spec.decl))}</style>
      <div class="rows">
        ${spec.tokens.map((t, i) => html`<div class="row">
          <div>${this.#name(t)}<div class="value">${read(t.name)}</div></div>
          ${spec.sample(`t${String(i)}`)}
          <div class="use">${t.use}</div>
        </div>`)}
      </div>`;
  }

  override render() {
    let body: TemplateResult;
    if (this.kind === 'palette') body = this.#cards(PALETTE.find((g) => g.id === this.group)?.tokens ?? []);
    else if (this.kind === 'color') body = this.#cards(COLOR.find((g) => g.id === this.group)?.tokens ?? []);
    else if (this.kind in ROWS) body = this.#rows(this.kind);
    else body = html`<p>Unknown kind: ${this.kind}</p>`;
    return html`${body}${this.copied ? html`<div class="toast" role="status">${this.copied}</div>` : ''}`;
  }
}

customElements.define('ds-tokens', DsTokens);
