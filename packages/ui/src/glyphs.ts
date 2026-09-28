import { svg } from 'lit';

/** Значки lucide, вшитые путями: пакет не тянет за собой библиотеку иконок. */
export const GLYPHS = {
  warn: svg`<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>`,
  trash: svg`<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>`,
  close: svg`<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,
  check: svg`<path d="M20 6 9 17l-5-5"/>`,
};

export const SPRING = 'cubic-bezier(.22, 1.15, .36, 1)';
export const EASE = 'cubic-bezier(.4, 0, .2, 1)';

/** Анимация, если движение не отключено и браузер её умеет. */
export function play(
  node: Element,
  frames: Keyframe[],
  options: KeyframeAnimationOptions,
) {
  const still =
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still || typeof node.animate !== 'function') return null;
  return node.animate(frames, options);
}
