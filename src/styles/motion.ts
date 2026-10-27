/**
 * PC Builder Lab - Tasteful Motion System
 *
 * Reusable motion utilities, stagger timing helpers, and micro-interaction classes.
 * Engineered for 60fps hardware accelerated transitions on transforms and opacity.
 */

export const motionVariants = {
  // Reveal animations
  fadeIn: 'animate-in fade-in duration-200 ease-out',
  slideUp: 'animate-in fade-in slide-in-from-bottom-3 duration-250 ease-out',
  slideDown: 'animate-in fade-in slide-in-from-top-3 duration-250 ease-out',
  slideLeft: 'animate-in fade-in slide-in-from-right-3 duration-250 ease-out',
  scaleIn: 'animate-in fade-in zoom-in-95 duration-200 ease-out',

  // Micro-interaction states
  pressable: 'transition-transform duration-150 active:scale-[0.98] cursor-pointer select-none',
  hoverLift: 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
  pulseGlow: 'animate-pulse transition-opacity duration-300',
  laserShimmer: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
} as const;

/**
 * Returns inline style for staggered list / grid child reveals.
 * @param index zero-based index of item
 * @param baseDelayMs initial delay before first element begins
 * @param stepMs delay between subsequent elements
 */
export function getStaggerStyle(index: number, baseDelayMs: number = 40, stepMs: number = 50): React.CSSProperties {
  return {
    animationDelay: `${baseDelayMs + index * stepMs}ms`,
    animationFillMode: 'both',
  };
}

export default motionVariants;
