import * as React from 'react';
import { cn } from '@/lib/utils';
import { themeTokens } from '@/styles/theme';

export type BrandBadgeVariant =
  | 'cyan'
  | 'emerald'
  | 'amber'
  | 'indigo'
  | 'violet'
  | 'slate'
  | 'danger'
  | 'signature'
  | 'quantum';

export interface BrandBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BrandBadgeVariant;
  pulse?: boolean;
  dot?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

const BADGE_VARIANTS: Record<BrandBadgeVariant, string> = {
  signature: 'border-cyan-400/50 bg-cyan-950/50 text-cyan-200 shadow-[0_0_16px_rgba(0,245,255,0.35)]',
  quantum: 'border-purple-400/50 bg-purple-950/50 text-purple-200 shadow-[0_0_16px_rgba(139,92,246,0.35)]',
  cyan: 'border-sky-500/40 bg-sky-950/40 text-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.2)]',
  emerald: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
  amber: 'border-amber-500/40 bg-amber-950/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
  indigo: 'border-indigo-500/40 bg-indigo-950/40 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]',
  violet: 'border-purple-500/40 bg-purple-950/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
  danger: 'border-rose-500/40 bg-rose-950/40 text-rose-300 shadow-[0_0_12px_rgba(239,68,68,0.2)]',
  slate: 'border-slate-700/80 bg-slate-800/60 text-slate-300 shadow-slate-900/40',
};

const DOT_COLORS: Record<BrandBadgeVariant, string> = {
  signature: 'bg-cyan-300',
  quantum: 'bg-purple-300',
  cyan: 'bg-cyan-400',
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
  indigo: 'bg-indigo-400',
  violet: 'bg-purple-400',
  danger: 'bg-rose-400',
  slate: 'bg-slate-400',
};

const SIZE_STYLES = {
  sm: 'px-2 py-0.5 text-[10px]',
  default: 'px-2.5 py-0.5 text-[11px]',
  lg: 'px-3 py-1 text-xs',
};

/**
 * Micro-telemetry status badge with optional pulsing hardware indicator dot.
 * Features ultra-crisp typography, backdrop blur, and soft neon shadow halo.
 * Consumes design tokens from theme.ts and brand tokens.
 */
export const BrandBadge: React.FC<BrandBadgeProps> = ({
  variant = 'cyan',
  pulse = false,
  dot = true,
  size = 'default',
  className,
  style,
  children,
  ...props
}) => {
  return (
    <span
      style={{
        borderRadius: themeTokens.radii.pill,
        fontFamily: themeTokens.typography.fontMono,
        ...style,
      }}
      className={cn(
        'inline-flex items-center gap-1.5 border font-semibold uppercase tracking-wider backdrop-blur-md select-none',
        'transition-all duration-200 hover:brightness-110',
        BADGE_VARIANTS[variant],
        SIZE_STYLES[size],
        className
      )}
      {...props}
    >
      {(dot || pulse) && (
        <span className="relative flex h-2 w-2 shrink-0">
          {pulse && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                DOT_COLORS[variant]
              )}
            />
          )}
          <span
            className={cn(
              'relative inline-flex h-2 w-2 rounded-full',
              DOT_COLORS[variant]
            )}
          />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};

export default BrandBadge;
