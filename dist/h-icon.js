import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Bell, Calendar, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleAlert, CircleCheck, CircleX, Clock, Copy, Download, Ellipsis, EllipsisVertical, ExternalLink, Eye, EyeOff, File, Filter, Folder, House, Inbox, Info, Link, Lock, LogOut, Menu, Minus, Monitor, Moon, Pencil, Plus, RefreshCw, Search, Settings, Star, Sun, Trash2, TrendingDown, TrendingUp, TriangleAlert, Upload, User, X, } from 'lucide';
import { LitElement, css, html, nothing } from 'lit';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
// Набор по умолчанию: частые иконки интерфейса. Импорт поимённый — в бандл не едет вся Lucide.
const DEFAULT_ICONS = {
    'arrow-down': ArrowDown,
    'arrow-left': ArrowLeft,
    'arrow-right': ArrowRight,
    'arrow-up': ArrowUp,
    'arrow-up-right': ArrowUpRight,
    bell: Bell,
    calendar: Calendar,
    check: Check,
    'chevron-down': ChevronDown,
    'chevron-left': ChevronLeft,
    'chevron-right': ChevronRight,
    'chevron-up': ChevronUp,
    'circle-alert': CircleAlert,
    'circle-check': CircleCheck,
    'circle-x': CircleX,
    clock: Clock,
    copy: Copy,
    download: Download,
    ellipsis: Ellipsis,
    'ellipsis-vertical': EllipsisVertical,
    'external-link': ExternalLink,
    eye: Eye,
    'eye-off': EyeOff,
    file: File,
    filter: Filter,
    folder: Folder,
    house: House,
    inbox: Inbox,
    info: Info,
    link: Link,
    lock: Lock,
    'log-out': LogOut,
    menu: Menu,
    minus: Minus,
    monitor: Monitor,
    moon: Moon,
    pencil: Pencil,
    plus: Plus,
    'refresh-cw': RefreshCw,
    search: Search,
    settings: Settings,
    star: Star,
    sun: Sun,
    'trash-2': Trash2,
    'trending-down': TrendingDown,
    'trending-up': TrendingUp,
    'triangle-alert': TriangleAlert,
    upload: Upload,
    user: User,
    x: X,
};
const registry = new Map(Object.entries(DEFAULT_ICONS));
/** Проект добавляет свои иконки Lucide под своими именами, не трогая кит. */
export function registerIcons(icons) {
    for (const [name, node] of Object.entries(icons))
        registry.set(name, node);
}
/** Имена, доступные сейчас: набор по умолчанию плюс зарегистрированные проектом. */
export function iconNames() {
    return [...registry.keys()].sort();
}
export const ICON_NAMES = Object.keys(DEFAULT_ICONS);
const warned = new Set();
/** Узлы приходят только из статичного реестра Lucide, поэтому разметка безопасна. */
function renderParts(parts) {
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
/** Иконка Lucide по имени из реестра: набор по умолчанию плюс зарегистрированные проектом. */
export class HIcon extends LitElement {
    static properties = {
        name: { type: String, reflect: true },
        size: { type: String, reflect: true },
        label: { type: String },
    };
    static styles = css `
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
    constructor() {
        super();
        this.name = 'check';
        this.size = 'md';
        this.label = '';
    }
    render() {
        const parts = registry.get(this.name);
        // Неизвестное имя — пусто и одно предупреждение, а не исключение посреди страницы.
        if (!parts) {
            if (!warned.has(this.name)) {
                warned.add(this.name);
                console.warn(`h-icon: unknown icon "${this.name}". Register it with registerIcons().`);
            }
            return nothing;
        }
        return html `
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
