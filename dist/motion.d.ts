export declare const SPRING = "cubic-bezier(.22, 1.15, .36, 1)";
export declare const EASE = "cubic-bezier(.4, 0, .2, 1)";
/** Быстрый старт и долгое торможение без отскока: для панелей, которые выезжают из-за края. */
export declare const GLIDE = "cubic-bezier(.22, 1, .36, 1)";
/** Анимация запускается, только если движение не отключено и браузер её умеет. */
export declare function play(node: Element, frames: Keyframe[], options: KeyframeAnimationOptions): Animation | null;
//# sourceMappingURL=motion.d.ts.map