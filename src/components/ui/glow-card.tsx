import * as React from 'react';
import { cn } from '@/lib/utils';
import { themeTokens, getGlowShadow } from '@/styles/theme';

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'cyan' | 'violet' | 'amber' | 'emerald' | 'danger';
  interactive?: boolean;
  withGrid?: boolean;
  variant?: 'glass' | 'solid' | 'subtle';
  intensity?: 'subtle' | 'normal' | 'vibrant';
}

const GLOW_BORDER_STYLES: Record<NonNullable<GlowCardProps['glowColor']>, string> = {
  cyan: 'hover:border-sky-500/50 hover:shadow-[0_0_36px_rgba(14,165,233,0.28),inset_0_1px_0_rgba(255,255,255,0.12)]',
  violet: 'hover:border-purple-500/50 hover:shadow-[0_0_36px_rgba(139,92,246,0.28),inset_0_1px_0_rgba(255,255,255,0.12)]',
  amber: 'hover:border-amber-500/50 hover:shadow-[0_0_36px_rgba(245,158,11,0.28),inset_0_1px_0_rgba(255,255,255,0.12)]',
  emerald: 'hover:border-emerald-500/50 hover:shadow-[0_0_36px_rgba(16,185,129,0.28),inset_0_1px_0_rgba(255,255,255,0.12)]',
  danger: 'hover:border-rose-500/50 hover:shadow-[0_0_36px_rgba(239,68,68,0.28),inset_0_1px_0_rgba(255,255,255,0.12)]',
};

const VARIANT_STYLES: Record<NonNullable<GlowCardProps['variant']>, string> = {
  glass: 'border border-border/80 bg-card/85 backdrop-blur-xl',
  solid: 'border border-border bg-card shadow-sm',
  subtle: 'border border-border/60 bg-secondary/40 backdrop-blur-md',
};

/**
 * Premium Awwwards-caliber glassmorphic card with light-catching inner bevel,
 * optional telemetry grid, and reactive cyber glow on hover.
 * Consumes design tokens from theme.ts.
 */
export const GlowCard = React.forwardRef<HTMLDivElement, GlowCardProps>(
  (
    {
      glowColor = 'cyan',
      interactive = true,
      withGrid = false,
      variant = 'glass',
      intensity = 'normal',
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        style={{
          borderRadius: themeTokens.radii.xl,
          ...style,
        }}
        className={cn(
          'relative p-6 overflow-hidden transition-all duration-300',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_28px_-6px_rgba(0,0,0,0.55)]',
          VARIANT_STYLES[variant],
          withGrid && 'bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:20px_20px]',
          interactive && [
            'hover:-translate-y-1 cursor-pointer active:translate-y-0 active:scale-[0.99]',
            GLOW_BORDER_STYLES[glowColor],
          ],
          intensity === 'vibrant' && 'border-primary/40 shadow-[0_0_24px_rgba(14,165,233,0.15)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlowCard.displayName = 'GlowCard';

export default GlowCard;
