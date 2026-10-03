import './h-stat.ts';

export default {
  title: 'Компоненты/Показание',
  parameters: {
    docs: {
      description: {
        component: `Одно число с подписью: эквити, шаги, давление. Крупная цифра на \`--display\`,
подпись над ней, пояснение под ней.

**Когда:** ключевая величина экрана или ряд из 2–4 показателей.
**Когда нет:** таблица чисел — для неё \`<table>\` с \`--mono\`.

| Свойство | Тип | Что делает |
| --- | --- | --- |
| \`label\` | строка | Подпись над числом |
| \`value\` | строка | Само число, уже отформатированное |
| \`note\` | строка | Пояснение под числом: период, сравнение |
| \`tone\` | \`data\` \\| \`attn\` | Красит число: хорошо или требует внимания |`,
      },
    },
  },
};

const stat = (label: string, value: string, note: string, tone?: string) => {
  const el = document.createElement('h-stat');
  el.setAttribute('label', label);
  el.setAttribute('value', value);
  el.setAttribute('note', note);
  if (tone) el.setAttribute('tone', tone);
  return el;
};

export const Обычное = () => stat('Шаги', '7 000', 'за сегодня');

export const Хорошо = () => stat('Эквити', '$105.09', 'за сутки +0.4%', 'data');

export const Внимание = () => stat('Давление', '164/96', 'выше нормы', 'attn');
