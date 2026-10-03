// Каталог токенов для страниц «Основы»: группа, имя и где применять.
// Значения не дублируются — образцы читают их из tokens.css в живой теме.

export type Token = { name: string; use: string };
export type Group = { id: string; title: string; note: string; tokens: Token[] };

export const COLOR: Group[] = [
  {
    id: 'surface',
    title: 'Поверхности',
    note: 'Три уровня глубины: фон страницы, карточка и вложенный блок. Карточка всегда светлее фона.',
    tokens: [
      { name: '--ground', use: 'Фон страницы' },
      { name: '--panel', use: 'Карточка, панель, модальное окно' },
      { name: '--panel-raised', use: 'Плотная таблица и блок поверх карточки' },
      { name: '--panel-sunk', use: 'Вдавленный блок: поле ввода, подложка кода' },
      { name: '--sheen', use: 'Блик при наведении поверх любой поверхности' },
    ],
  },
  {
    id: 'ink',
    title: 'Текст',
    note: 'Три ступени контраста. Третья — только для подписей, не для чисел, которые читают.',
    tokens: [
      { name: '--ink', use: 'Основной текст и числа' },
      { name: '--ink-2', use: 'Вторичный текст, подзаголовки' },
      { name: '--ink-3', use: 'Подписи колонок, метки, неактивное' },
    ],
  },
  {
    id: 'rule',
    title: 'Границы',
    note: 'Граница разделяет, а не украшает. Усиленная — только в плотных таблицах и у активного поля.',
    tokens: [
      { name: '--rule', use: 'Граница карточки и поля' },
      { name: '--rule-soft', use: 'Разделитель строк таблицы' },
      { name: '--rule-strong', use: 'Граница в плотной таблице, фокус без акцента' },
    ],
  },
  {
    id: 'accent',
    title: 'Акцент',
    note: 'Одно действие на экране. Если акцентных элементов больше двух, акцента нет.',
    tokens: [
      { name: '--accent', use: 'Главная кнопка, ссылка, фокус' },
      { name: '--accent-2', use: 'Акцент на тёмной поверхности и в плотных интерфейсах' },
      { name: '--accent-ink', use: 'Текст на акцентной заливке' },
      { name: '--wash', use: 'Подложка выбранного элемента' },
    ],
  },
  {
    id: 'state',
    title: 'Данные и внимание',
    note: 'Нейтральная пара для любого продукта: хорошая величина и то, что требует взгляда.',
    tokens: [
      { name: '--data', use: 'Положительная величина, успех' },
      { name: '--data-2', use: 'Вторичная линия данных' },
      { name: '--data-wash', use: 'Подложка успеха' },
      { name: '--attn', use: 'Ошибка, внимание' },
      { name: '--attn-wash', use: 'Подложка внимания' },
    ],
  },
  {
    id: 'money',
    title: 'Деньги',
    note: 'Только для денег и позиций. Убыток и предупреждение — разные цвета: путать их нельзя.',
    tokens: [
      { name: '--gain', use: 'Прибыль, рост, лонг' },
      { name: '--gain-wash', use: 'Подложка прибыльной строки' },
      { name: '--gain-line', use: 'Граница и линия прибыли' },
      { name: '--loss', use: 'Убыток, падение, шорт' },
      { name: '--loss-wash', use: 'Подложка убыточной строки' },
      { name: '--loss-line', use: 'Граница и линия убытка' },
      { name: '--caution', use: 'Предупреждение: риск, близкий стоп' },
      { name: '--caution-wash', use: 'Подложка предупреждения' },
    ],
  },
  {
    id: 'plot',
    title: 'Графики',
    note: 'Цвета серий на canvas. Читаются из CSS при отрисовке, поэтому меняются вместе с темой.',
    tokens: [
      { name: '--plot-grid', use: 'Сетка графика' },
      { name: '--plot-price', use: 'Линия цены' },
      { name: '--plot-volume', use: 'Объём, вторая серия' },
      { name: '--plot-ema', use: 'Скользящая средняя' },
    ],
  },
];

export const FONT: Token[] = [
  { name: '--display', use: 'Заголовки и крупные числа — Geologica' },
  { name: '--sans', use: 'Текст интерфейса — IBM Plex Sans' },
  { name: '--mono', use: 'Числа в колонках и код — IBM Plex Mono' },
];

export const TEXT: Token[] = [
  { name: '--text-micro', use: 'Служебная метка в тесном месте: LIVE, ×N' },
  { name: '--text-label', use: 'Заголовок колонки, надзаголовок' },
  { name: '--text-small', use: 'Чип, бейдж, подстрочник под числом' },
  { name: '--text-body', use: 'Ячейка таблицы, вторичный текст' },
  { name: '--text-base', use: 'Основной текст' },
  { name: '--text-lead', use: 'Вводка, крупная ячейка' },
  { name: '--text-h3', use: 'Заголовок блока внутри карточки' },
  { name: '--text-h2', use: 'Заголовок карточки' },
  { name: '--text-h1', use: 'Заголовок страницы' },
  { name: '--text-hero', use: 'Единственное число, ради которого страница' },
];

export const SPACE: Token[] = [
  { name: '--space-1', use: 'Иконка и подпись' },
  { name: '--space-2', use: 'Элементы в строке' },
  { name: '--space-3', use: 'Поля внутри компактной ячейки' },
  { name: '--space-4', use: 'Поля карточки на телефоне' },
  { name: '--space-5', use: 'Поля карточки' },
  { name: '--space-6', use: 'Между блоками внутри карточки' },
  { name: '--space-8', use: 'Между карточками' },
  { name: '--space-10', use: 'Между разделами страницы' },
  { name: '--gap', use: 'Адаптивный отступ между секциями: от 32 до 52 px' },
];

export const SHAPE: Token[] = [
  { name: '--radius-sm', use: 'Кнопка, поле, чип' },
  { name: '--radius', use: 'Карточка, диалог' },
  { name: '--shadow', use: 'Карточка в покое' },
  { name: '--shadow-lift', use: 'Карточка под курсором, выпадающий список' },
  { name: '--shadow-float', use: 'Диалог, уведомление — то, что над страницей' },
];

export const LAYER: Token[] = [
  { name: '--layer-sticky', use: 'Липкая шапка таблицы, навигация' },
  { name: '--layer-popover', use: 'Подсказка, выпадающий список' },
  { name: '--layer-dialog', use: 'Модальное окно и его затемнение' },
  { name: '--layer-toast', use: 'Уведомление — поверх всего' },
];

export const MOTION: Token[] = [
  { name: '--spring', use: 'Кривая появления: лёгкий перелёт и возврат' },
];

/** Все имена каталога — для сверки с tokens.css. */
export const ALL: string[] = [
  ...COLOR.flatMap((g) => g.tokens),
  ...FONT,
  ...TEXT,
  ...SPACE,
  ...SHAPE,
  ...LAYER,
  ...MOTION,
].map((t) => t.name);
