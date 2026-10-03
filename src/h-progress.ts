import { LitElement, css, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

/** Полоса показывает известную или неопределённую долю работы. */
export class HProgress extends LitElement {
  static properties = {
    value: { type: Number },
    min: { type: Number },
    max: { type: Number },
    label: { type: String },
    indeterminate: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
      color: var(--ink);
      font-family: var(--sans);
    }

    .header {
      display: flex;
      justify-content: space-between;
      gap: var(--space-3);
      margin-bottom: var(--space-2);
      font-size: var(--text-body);
      line-height: 1.3;
    }

    .label {
      min-width: 0;
      color: var(--ink);
    }

    .value {
      flex: 0 0 auto;
      color: var(--ink-2);
      font-family: var(--mono);
      font-variant-numeric: tabular-nums;
    }

    .track {
      overflow: hidden;
      height: var(--space-2);
      border-radius: var(--radius-pill);
      background: var(--panel-sunk);
    }

    .bar {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      background: var(--accent);
      transform: scaleX(var(--progress-complete));
      transform-origin: left center;
    }

    :host([indeterminate]) .bar {
      width: 50%;
      transform: translateX(-100%);
      animation: progress-slide 1s linear infinite;
    }

    @keyframes progress-slide {
      to {
        transform: translateX(200%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :host([indeterminate]) .bar {
        animation: none;
        transform: translateX(50%);
      }
    }
  `;

  declare value: number;

  declare min: number;

  declare max: number;

  declare label: string;

  declare indeterminate: boolean;

  constructor() {
    super();
    this.value = 0;
    this.min = 0;
    this.max = 100;
    this.label = 'Progress';
    this.indeterminate = false;
  }

  /** Диапазон не допускает нулевой или обратный максимум. */
  get #range() {
    return this.max > this.min ? this.max - this.min : 1;
  }

  /** Значение для ARIA и ширины остаётся внутри диапазона. */
  get #currentValue() {
    return Math.min(Math.max(this.value, this.min), this.max);
  }

  get #completion() {
    return (this.#currentValue - this.min) / this.#range;
  }

  get #valueText() {
    return `${String(this.#currentValue)} of ${String(this.max)}`;
  }

  render() {
    const value = this.indeterminate ? undefined : String(this.#currentValue);
    const valueText = this.indeterminate ? 'In progress' : this.#valueText;
    const completion = String(this.#completion);

    return html`
      <div class="header">
        <span class="label">${this.label}</span>
        <span class="value" ?hidden=${this.indeterminate} aria-hidden="true">
          ${this.#valueText}
        </span>
      </div>
      <div
        class="track"
        role="progressbar"
        aria-label=${this.label}
        aria-valuemin=${String(this.min)}
        aria-valuemax=${String(this.max)}
        aria-valuenow=${ifDefined(value)}
        aria-valuetext=${valueText}
      >
        <div class="bar" style=${`--progress-complete: ${completion}`} aria-hidden="true"></div>
      </div>
    `;
  }
}

customElements.define('h-progress', HProgress);
