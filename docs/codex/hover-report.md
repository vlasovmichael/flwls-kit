# Отчёт: состояния наведения

Дата: 2026-10-10

## Выполнено

- Все интерактивные контролы кита получили заметные `:hover` и более сильные `:active`
  состояния без изменения геометрии: кнопки, поля, select, segmented control, tabs,
  pagination, dropdown, disclosure, checkbox/switch, radio, copy button, date picker и
  кнопки закрытия overlay-компонентов.
- Hover-правила ограничены `@media (hover: hover)`, поэтому сенсорные устройства не
  сохраняют ложное состояние наведения.
- Добавлены токены `--hover-wash`, `--active-wash`, `--motion-fast` и `--motion-base`
  во все темы. Они внесены в каталог дизайн-системы.
- Добавлены регрессионные тесты покрытия hover/active для интерактивных компонентов и
  сторис `Hover states` для всех вариантов `h-button` и `h-icon-button`.

## Проверка

`npm run verify` — успешно: ESLint, TypeScript и 290 тестов Vitest.

Версия пакета не менялась, тег не создавался.
