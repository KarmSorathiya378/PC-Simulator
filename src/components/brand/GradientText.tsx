import * as React from 'react';
import { cn } from '@/lib/utils';

export type GradientVariant =
  | 'cyan-violet'
  | 'cyan-indigo'
  | 'lime-emerald'
  | 'amber-orange'
  | 'electric-blue'
  | 'violet-magenta'
  | 'silver-titanium';

export interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: GradientVariant;
  className?: string;
  as?: React.ElementType;
}

const gradientVariants: Record<GradientVariant, string> = {
  'cyan-violet': 'from-cyan-400 via-sky-400 to-indigo-400',
  'cyan-indigo': 'from-[#00F5FF] via-sky-400 to-[#6366F1]',
  'lime-emerald': 'from-lime-400 via-emerald-400 to-teal-400',
  'amber-orange': 'from-amber-400 via-orange-400 to-rose-400',
  'electric-blue': 'from-sky-400 via-blue-500 to-indigo-500',
  'violet-magenta': 'from-indigo-400 via-purple-400 to-pink-500',
  'silver-titanium': 'from-slate-100 via-slate-300 to-slate-500',
};

/**
 * High-impact typographic gradient text primitive for headings,
 * metrics, and brand callouts.
 */
export const GradientText: React.FC<GradientTextProps> = ({
  variant = 'cyan-violet',
  className,
  as: Component = 'span',
  children,
  ...props
}) => {
  return (
    <Component
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent font-extrabold tracking-tight',
        gradientVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GradientText;
