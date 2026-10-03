import { expect, test } from 'vitest';
import { HButton, HIconButton } from './h-button.ts';

test('кнопка блокируется при загрузке', async () => { const button = document.createElement('h-button') as HButton; button.loading = true; document.body.append(button); await button.updateComplete; expect((button.shadowRoot?.querySelector('button') as HTMLButtonElement).disabled).toBe(true); button.remove(); });
test('иконка-кнопка передаёт метку', async () => { const button = document.createElement('h-icon-button') as HIconButton; button.label = 'Close'; document.body.append(button); await button.updateComplete; expect(button.shadowRoot?.querySelector('button')?.getAttribute('aria-label')).toBe('Close'); button.remove(); });
