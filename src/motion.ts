export const SPRING = 'cubic-bezier(.22, 1.15, .36, 1)';

export const EASE = 'cubic-bezier(.4, 0, .2, 1)';

/** Анимация запускается, только если движение не отключено и браузер её умеет. */
export function play(
  node: Element,
  frames: Keyframe[],
  options: KeyframeAnimationOptions,
) {
  const still =
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (still || typeof node.animate !== 'function') {
    return null;
  }

  return node.animate(frames, options);
}
