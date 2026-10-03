import { LitElement, css, html } from 'lit';

export type SkeletonVariant = 'text' | 'circle' | 'rect' | 'card';

/** Скелетон показывает структуру загрузки, не выдавая её за содержимое.
 *
 * Элемент скрыт от скринридера: он не является данными или сообщением о состоянии.
 */
export class HSkeleton extends LitElement {
  static properties = {
    variant: { type: String, reflect: true },
    width: { type: String },
    height: { type: String },
  };

  static styles = css`
    :host {
      display: block;
    }

    /* Тон от цвета текста, а не от поверхности: заметен на любом фоне в обеих темах.
       Блик бежит слева направо — тот же знак «здесь ждут данные», что в проектах. */
    .skeleton {
      --tone: color-mix(in srgb, var(--ink) 8%, transparent);
      --shine: color-mix(in srgb, var(--ink) 15%, transparent);
      width: var(--skeleton-width, 100%);
      height: var(--skeleton-height, var(--text-body));
      border-radius: var(--radius-sm);
      background: linear-gradient(90deg, var(--tone) 30%, var(--shine) 50%, var(--tone) 70%)
        0 0 / 300% 100% no-repeat var(--tone);
      animation: skeleton-shine 1.4s ease-in-out infinite;
    }

    :host([variant='circle']) .skeleton {
      width: var(--skeleton-width, var(--space-8));
      height: var(--skeleton-height, var(--space-8));
      border-radius: var(--radius-pill);
    }

    :host([variant='rect']) .skeleton {
      height: var(--skeleton-height, var(--space-10));
    }

    :host([variant='card']) .skeleton {
      height: var(--skeleton-height, var(--space-10));
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    }

    @keyframes skeleton-shine {
      from {
        background-position: 100% 0;
      }

      to {
        background-position: 0 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .skeleton {
        animation: none;
        background: var(--tone);
      }
    }
  `;

  declare variant: SkeletonVariant;
  declare width: string;
  declare height: string;

  constructor() {
    super();
    this.variant = 'text';
    this.width = '';
    this.height = '';
  }

  updated() {
    const shape = this.renderRoot.querySelector<HTMLElement>('.skeleton');

    if (!shape) {
      return;
    }

    this.#setDimension(shape, '--skeleton-width', this.width);
    this.#setDimension(shape, '--skeleton-height', this.height);
  }

  // Размеры задаём свойствами, чтобы не смешивать пользовательские строки с шаблоном.
  #setDimension(shape: HTMLElement, name: string, value: string) {
    if (value) {
      shape.style.setProperty(name, value);
      return;
    }

    shape.style.removeProperty(name);
  }

  render() {
    return html`<div class="skeleton" aria-hidden="true"></div>`;
  }
}

customElements.define('h-skeleton', HSkeleton);
