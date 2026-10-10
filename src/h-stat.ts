import { LitElement, css, html, type PropertyValues } from 'lit';
import { GLIDE, play } from './motion.js';

const DIGIT = /\d/;

/** Число из отформатированной строки: «$1,204.5» → 1204.5, «−3.1%» → −3.1. */
export function numericValue(text: string) {
  const n = Number.parseFloat(text.replace(/[−–]/g, '-').replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

/** Позиции сменившихся цифр; строки выравниваются по правому краю, как разряды. */
export function changedDigits(prev: string, next: string) {
  const shift = next.length - prev.length;
  const out: number[] = [];
  for (let i = 0; i < next.length; i++) {
    if (DIGIT.test(next[i]) && next[i] !== prev[i - shift]) out.push(i);
  }
  return out;
}

export class HStat extends LitElement {
  static properties = {
    label: { type: String },
    value: { type: String },
    note: { type: String },
    tone: { type: String, reflect: true },
    size: { type: String, reflect: true },
  };

  static styles = css`
    :host { display: flex; flex-direction: column; gap: .25rem; min-width: 0; }
    :host([tone="attn"]) .value { color: var(--attn); }
    :host([tone="data"]) .value { color: var(--data); }
    .label { color: var(--ink-3); font: 500 11px/1.4 var(--sans); letter-spacing: .04em; text-transform: uppercase; }
    .value {
      display: flex; overflow: hidden; color: var(--ink);
      font: 500 clamp(1.5rem, 4vw, 2rem)/1.1 var(--display); font-variant-numeric: tabular-nums;
    }
    :host([size="lg"]) .value {
      font-size: var(--text-hero); font-weight: 600; letter-spacing: var(--tracking-tight);
    }
    .char { display: inline-block; white-space: pre; }
    .note { color: var(--ink-2); font: 400 12px/1.45 var(--sans); }
    .note:empty { display: none; }
  `;

  declare label: string;
  declare value: string;
  declare note: string;
  declare tone: string;
  declare size: string;

  constructor() {
    super();
    this.value = '';
  }

  render() {
    const chars = this.value.split('').map((c) => html`<span class="char" aria-hidden="true">${c}</span>`);
    return html`<span class="label">${this.label}</span>
      <span class="value" role="text" aria-label=${this.value}>${chars}</span>
      <span class="note">${this.note}</span>`;
  }

  // Новая цифра въезжает снизу при росте и сверху при падении; первое значение не анимируется.
  protected updated(changed: PropertyValues<this>) {
    const prev = changed.get('value');
    if (!prev || prev === this.value) return;
    const from = numericValue(prev);
    const to = numericValue(this.value);
    const shift = from == null || to == null || to >= from ? '70%' : '-70%';
    const chars = this.renderRoot.querySelectorAll('.char');
    changedDigits(prev, this.value).forEach((i, k) => {
      play(
        chars[i],
        [
          { transform: `translateY(${shift})`, opacity: 0 },
          { transform: 'none', opacity: 1 },
        ],
        { duration: 420, delay: k * 30, easing: GLIDE, fill: 'backwards' },
      );
    });
  }
}

customElements.define('h-stat', HStat);
