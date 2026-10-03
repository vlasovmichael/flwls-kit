import { LitElement, css, html } from 'lit';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md' | 'lg';

/** Бейдж показывает статус. */
export class HBadge extends LitElement {
  static properties = {
    tone: { type: String, reflect: true },
    size: { type: String, reflect: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      min-height: var(--space-5);
      padding: var(--space-1) var(--space-2);
      border: var(--border-thin) solid var(--rule-strong);
      border-radius: var(--radius-pill);
      background: var(--panel-raised);
      color: var(--ink-2);
      font-family: var(--sans);
      font-size: var(--text-small);
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
    }

    :host([tone='info']) {
      border-color: var(--accent);
      background: var(--wash);
    }

    :host([tone='success']) {
      border-color: var(--gain);
      background: var(--gain-wash);
    }

    :host([tone='warning']) {
      border-color: var(--caution);
      background: var(--caution-wash);
    }

    :host([tone='error']) {
      border-color: var(--loss);
      background: var(--loss-wash);
    }

    :host([size='sm']) {
      min-height: var(--space-4);
      padding: var(--space-1);
      font-size: var(--text-micro);
    }

    :host([size='lg']) {
      min-height: var(--space-6);
      padding: var(--space-1) var(--space-3);
      font-size: var(--text-base);
    }
  `;

  declare tone: BadgeTone;
  declare size: BadgeSize;

  constructor() {
    super();
    this.tone = 'neutral';
    this.size = 'md';
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('h-badge', HBadge);
