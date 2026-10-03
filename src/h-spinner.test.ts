import { expect, test } from 'vitest';
import { HSpinner, type SpinnerSize } from './h-spinner.ts';

async function appendSpinner(spinner: HSpinner) {
  document.body.append(spinner);
  await spinner.updateComplete;
  return spinner;
}

test.each<SpinnerSize>(['sm', 'md', 'lg'])(
  'спиннер отражает размер %s',
  async (size) => {
    const spinner = new HSpinner();
    spinner.size = size;
    await appendSpinner(spinner);

    expect(spinner.getAttribute('size')).toBe(size);
    spinner.remove();
  },
);

test('спиннер сообщает статус и метку', async () => {
  const spinner = new HSpinner();
  spinner.label = 'Saving changes';
  await appendSpinner(spinner);

  const root = spinner.shadowRoot as ShadowRoot;
  const status = root.querySelector('.status') as HTMLElement;

  expect(status.getAttribute('role')).toBe('status');
  expect(status.getAttribute('aria-label')).toBe('Saving changes');
  expect(status.textContent.trim()).toBe('Saving changes');
  spinner.remove();
});

test('спиннер отключает анимацию при reduced motion', () => {
  expect(HSpinner.styles.toString()).toContain('@media (prefers-reduced-motion: reduce)');
  expect(HSpinner.styles.toString()).toContain('animation: none');
});
