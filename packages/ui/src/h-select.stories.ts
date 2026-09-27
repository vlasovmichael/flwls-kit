import './h-select.ts';
import type { HSelect } from './h-select.ts';

export default { title: 'Компоненты/Выбор' };

export const Варианты = () => {
  const select = document.createElement('h-select') as HSelect;
  select.options = [
    { label: 'Авто', value: 'auto' },
    { label: 'Светлая', value: 'light' },
    { label: 'Тёмная', value: 'dark' },
  ];
  return select;
};
