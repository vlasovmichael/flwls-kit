import './h-dialog.ts';
import type { HDialog } from './h-dialog.ts';

export default {
  title: 'Компоненты/Диалог',
  parameters: {
    docs: {
      description: {
        component: `Модальное подтверждение: заголовок, текст, «Отмена» и подтверждение. Escape и клик мимо —
отмена. Фокус держится внутри, страница под ним не прокручивается.

**Когда:** действие нельзя отменить — удаление, закрытие позиции.
**Когда нет:** сообщение «сохранено» — для него уведомление.

| Свойство | Тип | Что делает |
| --- | --- | --- |
| \`open\` | логическое | Показан ли диалог |
| \`title\` | строка | Заголовок — вопрос, на который отвечают кнопкой |
| \`danger\` | логическое | Кнопка подтверждения красная, с корзиной |

| Событие | Когда |
| --- | --- |
| \`confirm\` | Нажато подтверждение |
| \`cancel\` | Отмена, Escape или клик мимо |

Текст диалога — содержимое элемента (слот).`,
      },
      story: { inline: false, height: '320px' },
    },
  },
};

const dialog = (title: string, text: string, danger = false) => {
  const el = document.createElement('h-dialog') as HDialog;
  el.open = true;
  el.title = title;
  el.danger = danger;
  el.textContent = text;
  return el;
};

export const Подтверждение = () => dialog('Сохранить изменения?', 'Настройки применятся сразу.');

export const Опасное = () => dialog('Удалить запись?', 'Это действие нельзя отменить.', true);
