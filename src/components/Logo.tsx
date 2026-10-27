import * as React from 'react';
import { Link, useInRouterContext } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LogoMark, LogoMarkProps, LogoMarkTheme } from './brand/LogoMark';
import { BRAND_TOKENS } from './brand/brandTokens';

export { LogoMark, BRAND_TOKENS };
export type { LogoMarkProps, LogoMarkTheme };

export type LogoSize = 'xs' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'hero';
export type LogoVariant = 'full' | 'mark-only' | 'text-only' | 'badge' | 'mono';
export type LogoTheme = 'dark' | 'light' | 'auto' | 'mono';

export interface LogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  size?: LogoSize | number;
  variant?: LogoVariant;
  theme?: LogoTheme;
  mono?: boolean;
  withLink?: boolean;
  to?: string;
  withTagline?: boolean;
  tagline?: string;
  withBadge?: boolean;
  badgeText?: string;
}

const sizeConfig: Record<
  LogoSize,
  {
    markSize: number;
    title: string;
    badge: string;
    tagline: string;
    gap: string;
  }
> = {
  xs: {
    markSize: 22,
    title: 'text-xs font-bold tracking-tight',
    badge: 'text-[8px] px-1 py-0.2',
    tagline: 'text-[9px]',
    gap: 'gap-2',
  },
  sm: {
    markSize: 28,
    title: 'text-sm font-bold tracking-tight',
    badge: 'text-[9px] px-1.5 py-0.5',
    tagline: 'text-[10px]',
    gap: 'gap-2.5',
  },
  default: {
    markSize: 36,
    title: 'text-base font-extrabold tracking-tight',
    badge: 'text-[10px] px-2 py-0.5',
    tagline: 'text-[11px]',
    gap: 'gap-3',
  },
  md: {
    markSize: 36,
    title: 'text-base font-extrabold tracking-tight',
    badge: 'text-[10px] px-2 py-0.5',
    tagline: 'text-[11px]',
    gap: 'gap-3',
  },
  lg: {
    markSize: 46,
    title: 'text-xl font-extrabold tracking-tight',
    badge: 'text-xs px-2.5 py-0.5',
    tagline: 'text-xs',
    gap: 'gap-3.5',
  },
  xl: {
    markSize: 58,
    title: 'text-2xl font-black tracking-tight',
    badge: 'text-xs px-3 py-1',
    tagline: 'text-sm',
    gap: 'gap-4',
  },
  hero: {
    markSize: 84,
    title: 'text-3xl sm:text-4xl font-black tracking-tight',
    badge: 'text-sm px-3.5 py-1',
    tagline: 'text-base',
    gap: 'gap-4.5',
  },
};

/**
 * PC Builder Lab Bespoke Brand Logo Component.
 * Scalable award-grade vector identity engineered for hardware engineering software:
 * - Geometric isometric PC chassis & silicon hex shield emblem.
 * - Dynamic light/dark theme contrast and full single-color mono mode.
 * - Accessible link wrapper and responsive size presets.
 */
export const Logo: React.FC<LogoProps> = ({
  className,
  markClassName,
  textClassName,
  size = 'default',
  variant = 'full',
  theme = 'auto',
  mono = false,
  withLink = true,
  to = '/',
  withTagline = false,
  tagline = 'Interactive 3D Hardware Simulator',
  withBadge = true,
  badgeText = 'v2.0',
}) => {
  const isRouterPresent = useInRouterContext();
  const isNumericSize = typeof size === 'number';
  const cfg = isNumericSize
    ? {
        markSize: size,
        title:
          size >= 48
            ? 'text-xl font-extrabold tracking-tight'
            : size <= 24
              ? 'text-xs font-bold tracking-tight'
              : 'text-base font-extrabold tracking-tight',
        badge: size >= 48 ? 'text-xs px-2.5 py-0.5' : 'text-[10px] px-2 py-0.5',
        tagline: size >= 48 ? 'text-xs' : 'text-[11px]',
        gap: 'gap-3',
      }
    : sizeConfig[size] ?? sizeConfig.default;

  const isMono = mono || variant === 'mono' || theme === 'mono';
  const isLight = theme === 'light';

  const showMark = variant !== 'text-only';
  const showText = variant !== 'mark-only';
  const isBadgeVariant = variant === 'badge';

  // Typographic colors
  const titleColor = isMono
    ? 'text-current'
    : isLight
      ? 'text-slate-900 group-hover:text-sky-600'
      : theme === 'dark'
        ? 'text-white group-hover:text-cyan-400'
        : 'text-foreground group-hover:text-primary';

  const accentWordmark = isMono ? (
    <span className="font-black">Lab</span>
  ) : isLight ? (
    <span className="bg-gradient-to-r from-sky-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent font-black">
      Lab
    </span>
  ) : (
    <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent font-black drop-shadow-[0_0_12px_rgba(0,245,255,0.3)]">
      Lab
    </span>
  );

  const badgeClasses = isMono
    ? 'border-current/30 text-current'
    : isLight
      ? 'border-sky-300 bg-sky-100 text-sky-800 shadow-xs'
      : 'border-sky-500/30 bg-sky-950/40 text-sky-300 shadow-xs shadow-sky-500/20';

  const logoContent = (
    <div
      className={cn(
        'group inline-flex items-center select-none transition-transform duration-200',
        cfg.gap,
        isBadgeVariant &&
          'rounded-full border border-sky-500/20 bg-slate-900/60 backdrop-blur-md px-3 py-1 shadow-lg shadow-cyan-950/20',
        className
      )}
    >
      {/* 1. Geometric Isometric PC Mark */}
      {showMark && (
        <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <LogoMark
            size={cfg.markSize}
            theme={theme}
            mono={isMono}
            className={markClassName}
          />
        </div>
      )}

      {/* 2. Brand Wordmark Typography */}
      {showText && (
        <div className={cn('flex flex-col', textClassName)}>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'font-display transition-colors duration-200',
                titleColor,
                cfg.title
              )}
            >
              PC Builder {accentWordmark}
            </span>
            {withBadge && (
              <span
                className={cn(
                  'hidden sm:inline-flex rounded-full border font-mono uppercase tracking-widest font-semibold backdrop-blur-md',
                  badgeClasses,
                  cfg.badge
                )}
              >
                {badgeText}
              </span>
            )}
          </div>
          {withTagline && (
            <span
              className={cn(
                'font-medium transition-colors',
                isLight ? 'text-slate-500' : 'text-muted-foreground',
                cfg.tagline
              )}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (withLink) {
    if (isRouterPresent) {
      return (
        <Link
          to={to}
          className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl transition-opacity hover:opacity-95"
        >
          {logoContent}
        </Link>
      );
    }

    return (
      <a
        href={to}
        className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-xl transition-opacity hover:opacity-95"
      >
        {logoContent}
      </a>
    );
  }

  return logoContent;
};

export default Logo;
