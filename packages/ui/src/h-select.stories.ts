import './h-select.ts';
import type { HSelect } from './h-select.ts';

export default {
  title: 'Компоненты/Выбор',
  parameters: {
    docs: {
      description: {
        component: `Выпадающий список с клавиатурой: стрелки, Enter, Escape.

**Когда:** вариантов больше пяти или место узкое.
**Когда нет:** 2–5 вариантов, которые полезно видеть сразу, — для них сегментный переключатель.

| Свойство | Тип | Что делает |
| --- | --- | --- |
| \`options\` | \`{ label, value }[]\` | Варианты, задаются свойством, не атрибутом |
| \`value\` | строка | Выбранное значение |
| \`label\` | строка | Подпись для экранного диктора |

| Событие | detail | Когда |
| --- | --- | --- |
| \`change\` | новое \`value\` | Пользователь выбрал вариант |`,
      },
    },
  },
};

const select = (value: string) => {
  const el = document.createElement('h-select') as HSelect;
  el.label = 'Тема';
  el.options = [
    { label: 'Авто', value: 'auto' },
    { label: 'Светлая', value: 'light' },
    { label: 'Тёмная', value: 'dark' },
  ];
  el.value = value;
  return el;
};

export const Варианты = () => select('auto');

export const Выбрано = () => select('dark');
