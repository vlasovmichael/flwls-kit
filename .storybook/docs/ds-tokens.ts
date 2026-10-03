// Образцы токенов для страниц «Основы»: значения читаются из живой темы,
// поэтому страница не расходится с tokens.css и перекрашивается вместе с ним.
import { LitElement, css, html, unsafeCSS, type TemplateResult } from 'lit';
import { COLOR, FONT, LAYER, MOTION, SHAPE, SPACE, TEXT, type Token } from './catalog.ts';

const read = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** Правило на каждый токен: образец красится классом, а не атрибутом style. */
const rules = (tokens: Token[], decl: (name: string) => string) =>
  tokens.map((t, i) => `.t${String(i)} { ${decl(t.name)} }`).join('\n');

class DsTokens extends LitElement {
  static properties = { kind: { type: String }, group: { type: String } };

  declare kind: string;
  declare group: string;

  static styles = css`
    :host { display: block; margin: 16px 0 32px; font-family: var(--sans); color: var(--ink); }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
    .card { border: 1px solid var(--rule); border-radius: var(--radius-sm); background: var(--panel); overflow: hidden; }
    .chip { height: 64px; border-bottom: 1px solid var(--rule-soft); }
    .meta { padding: 10px 12px; display: grid; gap: 4px; }
    .name { font: 500 12px/1.3 var(--mono); }
    .value { font: 12px/1.3 var(--mono); color: var(--ink-3); word-break: break-all; }
    .use { font-size: 13px; line-height: 1.4; color: var(--ink-2); }
    .rows { display: grid; gap: 2px; border: 1px solid var(--rule); border-radius: var(--radius-sm); background: var(--panel); }
    .row { display: grid; grid-template-columns: 170px 1fr 220px; gap: 16px; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--rule-soft); }
    .row:last-child { border-bottom: 0; }
    .sample { color: var(--ink); line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .bar { height: 12px; background: var(--accent); border-radius: 3px; }
    .box { height: 72px; background: var(--panel); border: 1px solid var(--rule); }
    .spring { width: 48px; height: 48px; border-radius: var(--radius-sm); background: var(--accent); transition: transform 600ms; }
    .row:hover .spring { transform: translateX(160px); }
    @media (max-width: 640px) { .row { grid-template-columns: 1fr; gap: 6px; } }
  `;

  #observer = new MutationObserver(() => { this.requestUpdate(); });
  #media = matchMedia('(prefers-color-scheme: dark)');
  #onMedia = () => { this.requestUpdate(); };

  override connectedCallback() {
    super.connectedCallback();
    this.#observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    this.#media.addEventListener('change', this.#onMedia);
  }

  override disconnectedCallback() {
    this.#observer.disconnect();
    this.#media.removeEventListener('change', this.#onMedia);
    super.disconnectedCallback();
  }

  #meta(t: Token) {
    return html`<div class="meta">
      <span class="name">${t.name}</span>
      <span class="value">${read(t.name) || '—'}</span>
      <span class="use">${t.use}</span>
    </div>`;
  }

  #rows(tokens: Token[], decl: (n: string) => string, sample: (t: Token, i: number) => TemplateResult) {
    return html`<style>${unsafeCSS(rules(tokens, decl))}</style>
      <div class="rows">
        ${tokens.map((t, i) => html`<div class="row">
          <div><div class="name">${t.name}</div><div class="value">${read(t.name)}</div></div>
          ${sample(t, i)}
          <div class="use">${t.use}</div>
        </div>`)}
      </div>`;
  }

  override render() {
    const cls = (i: number) => `t${String(i)}`;
    switch (this.kind) {
      case 'color': {
        const tokens = COLOR.find((g) => g.id === this.group)?.tokens ?? [];
        return html`<style>${unsafeCSS(rules(tokens, (n) => `background: var(${n});`))}</style>
          <div class="grid">
            ${tokens.map((t, i) => html`<div class="card"><div class="chip ${cls(i)}"></div>${this.#meta(t)}</div>`)}
          </div>`;
      }
      case 'font':
        return this.#rows(FONT, (n) => `font-family: var(${n});`,
          (_t, i) => html`<div class="sample ${cls(i)}">Прибыль 1 234,56 — Profit</div>`);
      case 'text':
        return this.#rows(TEXT, (n) => `font-size: var(${n});`,
          (_t, i) => html`<div class="sample ${cls(i)}">Открытый интерес 12 480</div>`);
      case 'space':
        return this.#rows(SPACE, (n) => `width: var(${n});`,
          (_t, i) => html`<div class="bar ${cls(i)}"></div>`);
      case 'shape':
        return this.#rows(SHAPE, (n) => (n.startsWith('--radius') ? `border-radius: var(${n});` : `box-shadow: var(${n});`),
          (_t, i) => html`<div class="box ${cls(i)}"></div>`);
      case 'layer':
        return this.#rows(LAYER, () => '', (t) => html`<div class="use">z-index: ${read(t.name)}</div>`);
      case 'motion':
        return this.#rows(MOTION, (n) => `transition-timing-function: var(${n});`,
          (_t, i) => html`<div class="spring ${cls(i)}"></div>`);
      default:
        return html`<p>Неизвестный вид: ${this.kind}</p>`;
    }
  }
}

customElements.define('ds-tokens', DsTokens);
