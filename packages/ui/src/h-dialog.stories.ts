import './h-dialog.ts';
import type { HDialog } from './h-dialog.ts';

export default { title: 'Компоненты/Диалог' };

export const Подтверждение = () => {
  const dialog = document.createElement('h-dialog') as HDialog;
  dialog.open = true;
  dialog.title = 'Удалить запись?';
  dialog.textContent = 'Это действие нельзя отменить.';
  return dialog;
};
