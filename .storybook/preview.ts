import '../packages/ui/src/tokens.css';
import './preview.css';
import './docs/ds-tokens.ts';

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

export const initialGlobals = { theme: 'system' };

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
