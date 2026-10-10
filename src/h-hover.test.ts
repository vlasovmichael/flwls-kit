import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const interactive = [
  'h-button.ts', 'h-field.ts', 'h-select.ts', 'h-segmented-control.ts', 'h-tabs.ts', 'h-pagination.ts',
  'h-dropdown-menu.ts', 'h-disclosure.ts', 'h-checkbox.ts', 'h-radio-group.ts',
  'h-copy-button.ts', 'h-date-picker.ts', 'h-dialog.ts', 'h-drawer.ts', 'h-toast.ts',
];

describe('интерактивные состояния', () => {
  test.each(interactive)('%s ограничивает hover устройствами с указателем', (file) => {
    const source = readFileSync(join(process.cwd(), 'packages/ui/src', file), 'utf8');
    expect(source).toMatch(/@media \(hover: hover\)[\s\S]*:hover/);
    expect(source).toMatch(/:active/);
  });

  test('общие токены задают движение и более сильное нажатие', () => {
    const tokens = readFileSync(join(process.cwd(), 'packages/ui/src/tokens.css'), 'utf8');
    expect(tokens).toContain('--motion-fast');
    expect(tokens).toContain('--hover-wash');
    expect(tokens).toContain('--active-wash');
  });
});
