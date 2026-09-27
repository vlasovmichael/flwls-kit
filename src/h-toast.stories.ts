import './h-toast.ts';
import type { HToast } from './h-toast.ts';

export default { title: 'Компоненты/Уведомление' };

export const Сохранение = () => {
  const toast = document.createElement('h-toast') as HToast;
  toast.message = 'Запись сохранена';
  return toast;
};
