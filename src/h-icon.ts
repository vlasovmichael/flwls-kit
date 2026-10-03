import { Check, ChevronDown, Info, Trash2, TriangleAlert, X } from 'lucide';
import { LitElement, css, html, nothing } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

type IconPart = readonly [string, Record<string, string | number | undefined>];

const ICONS = {
  check: Check,
  'chevron-down': ChevronDown,
  info: Info,
  'trash-2': Trash2,
  'triangle-alert': TriangleAlert,
  x: X,
} as const;

export type IconName = keyof typeof ICONS;

export const ICON_NAMES = Object.keys(ICONS) as IconName[];

export type IconSize = 'sm' | 'md' | 'lg';

/** Узлы приходят только из статичного реестра Lucide, поэтому разметка безопасна. */
function renderParts(parts: readonly IconPart[]) {
  const markup = parts
    .map(([tag, attributes]) => {
      const attrs = Object.entries(attributes)
        .map(([name, value]) => `${name}="${String(value)}"`)
        .join(' ');

      return `<${tag} ${attrs}></${tag}>`;
    })
    .join('');

  return unsafeSVG(markup);
}

/** Иконка из ограниченного набора Lucide, чтобы в бандл не попадала вся библиотека. */
export class HIcon extends LitElement {
  static properties = {
    name: { type: String, reflect: true },
    size: { type: String, reflect: true },
    label: { type: String },
  };

  static styles = css`
    :host {
      display: inline-flex;
      width: var(--space-4);
      height: var(--space-4);
      flex: none;
      color: currentColor;
      vertical-align: middle;
    }

    :host([size='sm']) {
      width: var(--space-3);
      height: var(--space-3);
    }

    :host([size='lg']) {
      width: var(--space-5);
      height: var(--space-5);
    }

    svg {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: var(--border-thick);
    }
  `;

  declare name: IconName;

  declare size: IconSize;

  declare label: string;

  constructor() {
    super();
    this.name = 'check';
    this.size = 'md';
    this.label = '';
  }

  render() {
    const parts = ICONS[this.name];

    return html`
      <svg
        viewBox="0 0 24 24"
        role=${this.label ? 'img' : nothing}
        aria-label=${this.label || nothing}
        aria-hidden=${this.label ? 'false' : 'true'}
      >
        ${renderParts(parts)}
      </svg>
    `;
  }
}

customElements.define('h-icon', HIcon);
