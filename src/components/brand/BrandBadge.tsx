import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BrandBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'emerald' | 'amber' | 'indigo' | 'violet' | 'slate';
  pulse?: boolean;
}

const badgeVariants: Record<NonNullable<BrandBadgeProps['variant']>, string> = {
  cyan: 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]',
  emerald: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
  amber: 'border-amber-500/40 bg-amber-950/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
  indigo: 'border-indigo-500/40 bg-indigo-950/40 text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.2)]',
  violet: 'border-purple-500/40 bg-purple-950/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
  slate: 'border-slate-700/80 bg-slate-800/60 text-slate-300 shadow-slate-900/40',
};

const dotColors: Record<NonNullable<BrandBadgeProps['variant']>, string> = {
  cyan: 'bg-cyan-400',
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
  indigo: 'bg-indigo-400',
  violet: 'bg-purple-400',
  slate: 'bg-slate-400',
};

/**
 * Micro telemetry status badge with optional pulsing hardware indicator dot.
 * Features ultra-crisp typography, backdrop blur, and soft neon shadow halo.
 */
export const BrandBadge: React.FC<BrandBadgeProps> = ({
  variant = 'cyan',
  pulse = false,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5',
        'font-mono text-[11px] font-semibold uppercase tracking-wider backdrop-blur-md select-none',
        'transition-all duration-200 hover:brightness-110',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              dotColors[variant]
            )}
          />
          <span
            className={cn('relative inline-flex h-2 w-2 rounded-full', dotColors[variant])}
          />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};

export default BrandBadge;
