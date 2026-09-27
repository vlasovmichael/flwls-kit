import './h-stat.ts';

export default { title: 'Компоненты/Показание' };

export const Обычное = () => {
  const stat = document.createElement('h-stat');
  stat.setAttribute('label', 'Шаги');
  stat.setAttribute('value', '7 000');
  stat.setAttribute('note', 'за сегодня');
  return stat;
};
