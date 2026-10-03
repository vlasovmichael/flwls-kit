// Документация Storybook рисует тулбары, таблицы аргументов и код своей темой, а не токенами кита.
// Контейнер выбирает светлую или тёмную тему Storybook по той же глобали, что и примеры.
import { createElement, useEffect, useState, type PropsWithChildren } from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import { create } from 'storybook/theming';

// Цвета повторяют палитру tokens.css: тема Storybook не читает CSS-переменные.
const shared = {
  fontBase: '"IBM Plex Sans", ui-sans-serif, system-ui, sans-serif',
  fontCode: '"JetBrains Mono", ui-monospace, Menlo, monospace',
  appBorderRadius: 14,
  inputBorderRadius: 9,
};

const light = create({
  ...shared,
  base: 'light',
  colorPrimary: '#2b5bd7',
  colorSecondary: '#2b5bd7',
  appBg: '#f2f5f8',
  appContentBg: '#ffffff',
  appPreviewBg: '#f2f5f8',
  appBorderColor: '#dbe2ea',
  textColor: '#101720',
  textMutedColor: '#4d5967',
  barBg: '#ffffff',
  barTextColor: '#4d5967',
  barSelectedColor: '#2b5bd7',
  inputBg: '#ffffff',
  inputBorder: '#c3ccd6',
  inputTextColor: '#101720',
});

const dark = create({
  ...shared,
  base: 'dark',
  colorPrimary: '#6d97f5',
  colorSecondary: '#6d97f5',
  appBg: '#080b10',
  appContentBg: '#141a22',
  appPreviewBg: '#080b10',
  appBorderColor: '#242c37',
  textColor: '#e9eef3',
  textMutedColor: '#97a3b2',
  barBg: '#141a22',
  barTextColor: '#97a3b2',
  barSelectedColor: '#6d97f5',
  inputBg: '#0e131a',
  inputBorder: '#333d4a',
  inputTextColor: '#e9eef3',
});

type Globals = { theme?: string };

const darkQuery = () => matchMedia('(prefers-color-scheme: dark)');

/** Глобаль theme из стора превью; на первом рендере событий ещё не было. */
function initialTheme(context: DocsContainerProps['context']) {
  const store = (context as unknown as { store?: { userGlobals?: { get?: () => Globals } } }).store;
  return store?.userGlobals?.get?.().theme ?? 'system';
}

export function ThemedDocs({ children, context }: PropsWithChildren<DocsContainerProps>) {
  const [theme, setTheme] = useState(() => initialTheme(context));
  const [systemDark, setSystemDark] = useState(() => darkQuery().matches);

  useEffect(() => {
    const onGlobals = ({ globals }: { globals: Globals }) => {
      setTheme(globals.theme ?? 'system');
    };
    context.channel.on(GLOBALS_UPDATED, onGlobals);
    context.channel.on(SET_GLOBALS, onGlobals);
    const media = darkQuery();
    const onMedia = () => {
      setSystemDark(media.matches);
    };
    media.addEventListener('change', onMedia);
    return () => {
      context.channel.off(GLOBALS_UPDATED, onGlobals);
      context.channel.off(SET_GLOBALS, onGlobals);
      media.removeEventListener('change', onMedia);
    };
  }, [context.channel]);

  // Атрибут нужен и на страницах без примеров: декораторы там не запускаются.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [theme]);

  const isDark = theme === 'dark' || (theme === 'system' && systemDark);
  return createElement(DocsContainer, { context, theme: isDark ? dark : light }, children);
}
