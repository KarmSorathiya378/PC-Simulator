import * as React from 'react';
import { cn } from '@/lib/utils';
import { themeTokens } from '@/styles/theme';

export type GradientVariant =
  | 'primary'
  | 'laser'
  | 'cyan-violet'
  | 'violet'
  | 'warm'
  | 'emerald'
  | 'holographic'
  | 'subtle'
  | 'silver-titanium';

export interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: GradientVariant;
  as?: React.ElementType;
  glow?: boolean;
}

const GRADIENT_STYLE_CLASSES: Record<GradientVariant, string> = {
  primary: 'bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400',
  laser: 'bg-gradient-to-r from-[#00F5FF] via-[#0284C7] to-[#6366F1]',
  'cyan-violet': 'bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400',
  violet: 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500',
  warm: 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400',
  emerald: 'bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400',
  holographic: 'bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-amber-300',
  subtle: 'bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400',
  'silver-titanium': 'bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500',
};

const GLOW_CLASSES: Record<GradientVariant, string> = {
  primary: 'drop-shadow-[0_0_18px_rgba(14,165,233,0.35)]',
  laser: 'drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]',
  'cyan-violet': 'drop-shadow-[0_0_18px_rgba(129,140,248,0.35)]',
  violet: 'drop-shadow-[0_0_18px_rgba(168,85,247,0.35)]',
  warm: 'drop-shadow-[0_0_18px_rgba(245,158,11,0.35)]',
  emerald: 'drop-shadow-[0_0_18px_rgba(16,185,129,0.35)]',
  holographic: 'drop-shadow-[0_0_20px_rgba(236,72,153,0.35)]',
  subtle: 'drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]',
  'silver-titanium': 'drop-shadow-[0_0_12px_rgba(203,213,225,0.25)]',
};

/**
 * High-impact typographic gradient primitive.
 * Consumes brand gradient tokens from theme.ts for Awwwards-level visual punch.
 */
export const GradientText: React.FC<GradientTextProps> = ({
  variant = 'primary',
  as: Component = 'span',
  glow = false,
  className,
  children,
  style,
  ...props
}) => {
  return (
    <Component
      style={{
        fontFamily: themeTokens.typography.fontDisplay,
        ...style,
      }}
      className={cn(
        'bg-clip-text text-transparent font-bold tracking-tight inline-block select-none',
        GRADIENT_STYLE_CLASSES[variant],
        glow && GLOW_CLASSES[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GradientText;
