import '../packages/ui/src/tokens.css';
import './preview.css';
import './docs/ds-tokens.ts';
import { ThemedDocs } from './docs/themed-docs.ts';

// Тема кита ставится атрибутом на <html>, как в проектах: «System» снимает его.
const applyTheme = (theme: string) => {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
};

export const globalTypes = {
  theme: {
    description: 'Theme',
    toolbar: {
      title: 'Theme',
      icon: 'contrast',
      items: [
        { value: 'system', title: 'System' },
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
      dynamicTitle: true,
    },
  },
};

/**
 * Пример в отдельном iframe внутри документации стартует с темой страницы-родителя.
 * Иначе при загрузке он объявляет тему по умолчанию и откатывает выбор в тулбаре.
 */
function parentTheme() {
  try {
    if (window.parent === window.top) return null;
    return window.parent.document.documentElement.getAttribute('data-theme');
  } catch {
    return null;
  }
}

export const initialGlobals = { theme: parentTheme() ?? 'system' };

export const decorators = [
  (story: () => unknown, context: { globals: { theme?: string } }) => {
    applyTheme(context.globals.theme ?? 'system');
    return story();
  },
];

export const tags = ['autodocs'];

export const parameters = {
  a11y: { test: 'error' },
  backgrounds: { disable: true },
  docs: { container: ThemedDocs },
  controls: { expanded: true, sort: 'requiredFirst' },
  options: {
    storySort: {
      order: [
        'Introduction',
        'Style Guide',
        ['Colors', 'Icons', 'Typography', 'Space', 'Radius', 'Shadow', 'Border Width', 'Opacity', 'Breakpoints', 'Layers', 'Motion'],
        'Components',
        ['Actions', 'Form Controls', 'Overlays', 'Display', 'Navigation'],
        'Engineering Resources',
        ['Getting Started', 'Release Process', 'Contributing'],
      ],
    },
  },
};
