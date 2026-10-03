import '../packages/ui/src/tokens.css';
import './preview.css';
import './docs/ds-tokens.ts';

// Тема кита ставится атрибутом на <html>, как в проектах: «Система» снимает его.
const applyTheme = (theme: string) => {
  const root = document.documentElement;
  if (theme === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
};

export const globalTypes = {
  theme: {
    description: 'Тема',
    toolbar: {
      title: 'Тема',
      icon: 'contrast',
      items: [
        { value: 'system', title: 'Как в системе' },
        { value: 'light', title: 'Светлая' },
        { value: 'dark', title: 'Тёмная' },
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
  options: {
    storySort: { order: ['Введение', 'Основы', ['Цвет', 'Типографика', 'Отступы', 'Форма', 'Слои и движение'], 'Компоненты'] },
  },
};
