import * as React from 'react';
import { cn } from '@/lib/utils';

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'violet';
  interactive?: boolean;
  withGrid?: boolean;
}

const glowColorMap: Record<NonNullable<GlowCardProps['glowColor']>, string> = {
  cyan: 'hover:border-cyan-500/50 hover:shadow-[0_0_32px_rgba(6,182,212,0.22)]',
  indigo: 'hover:border-indigo-500/50 hover:shadow-[0_0_32px_rgba(99,102,241,0.22)]',
  emerald: 'hover:border-emerald-500/50 hover:shadow-[0_0_32px_rgba(16,185,129,0.22)]',
  amber: 'hover:border-amber-500/50 hover:shadow-[0_0_32px_rgba(245,158,11,0.22)]',
  violet: 'hover:border-purple-500/50 hover:shadow-[0_0_32px_rgba(168,85,247,0.22)]',
};

/**
 * Premium glassmorphic card with subtle inner bevel highlight, backdrop blur,
 * and reactive glow boundary on hover. Matches Linear/Raycast design quality.
 */
export const GlowCard: React.FC<GlowCardProps> = ({
  glowColor = 'cyan',
  interactive = true,
  withGrid = false,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6',
        'backdrop-blur-xl transition-all duration-300',
        'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_12px_28px_-6px_rgba(0,0,0,0.55)]',
        withGrid && 'bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:20px_20px]',
        interactive && [
          'hover:-translate-y-1 hover:bg-slate-900/80 cursor-pointer',
          glowColorMap[glowColor],
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlowCard;
