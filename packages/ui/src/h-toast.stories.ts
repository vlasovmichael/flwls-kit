import './h-toast.ts';
import type { HToast } from './h-toast.ts';

export default {
  title: 'Компоненты/Уведомление',
  parameters: {
    docs: {
      description: {
        component: `Короткое сообщение о результате действия, исчезает само.

**Когда:** «сохранено», «не удалось отправить».
**Когда нет:** ошибка, которую надо исправить в форме, — она пишется рядом с полем.

| Свойство | Тип | Что делает |
| --- | --- | --- |
| \`message\` | строка | Текст, если слот пуст |
| \`tone\` | \`ok\` \\| \`bad\` | Галочка или предупреждение |
| \`open\` | логическое | Показано ли |

| Событие | Когда |
| --- | --- |
| \`dismiss\` | Уведомление закрыто |`,
      },
    },
  },
};

const toast = (message: string, tone: 'ok' | 'bad' = 'ok') => {
  const el = document.createElement('h-toast') as HToast;
  el.message = message;
  el.tone = tone;
  return el;
};

export const Сохранение = () => toast('Запись сохранена');

export const Ошибка = () => toast('Не удалось отправить', 'bad');
