import * as React from 'react';
import { Link, useInRouterContext } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BRAND_COLORS } from './brand/brandColors';
import { BRAND_TOKENS } from './brand/brandTokens';
import { LogoMark, LogoMarkProps, LogoMarkTheme } from './brand/LogoMark';

// Re-export brand primitives and tokens for unified access
export * from './brand/index';
export { LogoMark, BRAND_TOKENS };
export type { LogoMarkProps, LogoMarkTheme };

export type BrandSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | number;
export type BrandVariant = 'full' | 'mark-only' | 'text-only' | 'badge' | 'mono';
export type BrandTheme = 'dark' | 'light' | 'auto' | 'mono';

export const BrandMark = LogoMark;

export interface BrandProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  taglineClassName?: string;
  size?: BrandSize;
  variant?: BrandVariant;
  theme?: BrandTheme;
  mono?: boolean;
  withLink?: boolean;
  to?: string;
  href?: string;
  withTagline?: boolean;
  tagline?: string;
  withBadge?: boolean;
  badgeText?: string;
}

const BRAND_SIZE_MAP: Record<
  string,
  {
    markSize: number;
    titleClass: string;
    badgeClass: string;
    taglineClass: string;
    gapClass: string;
  }
> = {
  xs: {
    markSize: 22,
    titleClass: 'text-xs font-bold tracking-tight',
    badgeClass: 'text-[8px] px-1 py-0.2',
    taglineClass: 'text-[9px]',
    gapClass: 'gap-1.5',
  },
  sm: {
    markSize: 28,
    titleClass: 'text-sm font-bold tracking-tight',
    badgeClass: 'text-[9px] px-1.5 py-0.5',
    taglineClass: 'text-[10px]',
    gapClass: 'gap-2',
  },
  md: {
    markSize: 36,
    titleClass: 'text-base font-extrabold tracking-tight',
    badgeClass: 'text-[10px] px-2 py-0.5',
    taglineClass: 'text-[11px]',
    gapClass: 'gap-2.5',
  },
  lg: {
    markSize: 48,
    titleClass: 'text-xl font-extrabold tracking-tight',
    badgeClass: 'text-xs px-2.5 py-0.5',
    taglineClass: 'text-xs',
    gapClass: 'gap-3',
  },
  xl: {
    markSize: 60,
    titleClass: 'text-2xl font-black tracking-tight',
    badgeClass: 'text-xs px-3 py-1',
    taglineClass: 'text-sm',
    gapClass: 'gap-3.5',
  },
  hero: {
    markSize: 84,
    titleClass: 'text-3xl sm:text-4xl font-black tracking-tight',
    badgeClass: 'text-sm px-3.5 py-1',
    taglineClass: 'text-base',
    gapClass: 'gap-4',
  },
};

/**
 * Reusable Brand Component for PC Builder Lab.
 * Supports multiple size presets, numeric sizing, variants ('full' | 'mark-only' | 'text-only' | 'badge' | 'mono'),
 * light/dark/mono themes, taglines, version badges, and safe link/routing wrappers.
 */
export const Brand: React.FC<BrandProps> = ({
  className,
  markClassName,
  textClassName,
  taglineClassName,
  size = 'md',
  variant = 'full',
  theme = 'auto',
  mono = false,
  withLink = true,
  to = '/',
  href,
  withTagline = false,
  tagline = 'Interactive 3D Hardware Simulator',
  withBadge = true,
  badgeText = 'v2.0',
}) => {
  const isRouterPresent = useInRouterContext();

  const sizeKey = typeof size === 'number' ? 'custom' : size;
  const config =
    typeof size === 'number'
      ? {
          markSize: size,
          titleClass:
            size >= 48
              ? 'text-xl font-extrabold tracking-tight'
              : size <= 24
                ? 'text-xs font-bold tracking-tight'
                : 'text-base font-extrabold tracking-tight',
          badgeClass: size >= 48 ? 'text-xs px-2.5 py-0.5' : 'text-[10px] px-2 py-0.5',
          taglineClass: size >= 48 ? 'text-xs' : 'text-[11px]',
          gapClass: 'gap-2.5',
        }
      : BRAND_SIZE_MAP[sizeKey] ?? BRAND_SIZE_MAP.md;

  const isMono = mono || variant === 'mono' || theme === 'mono';
  const isLight = theme === 'light';

  const showMark = variant !== 'text-only';
  const showText = variant !== 'mark-only';
  const isBadgeVariant = variant === 'badge';

  // Typographic styling
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

  const taglineColor = isMono
    ? 'text-current/70'
    : isLight
      ? 'text-slate-500'
      : theme === 'dark'
        ? 'text-slate-400'
        : 'text-muted-foreground';

  const badgeColor = isMono
    ? 'border-current/30 text-current'
    : isLight
      ? 'border-sky-300 bg-sky-100 text-sky-800 shadow-xs'
      : 'border-sky-500/30 bg-sky-950/40 text-sky-300 shadow-xs shadow-sky-500/20';

  const brandContent = (
    <div
      className={cn(
        'group inline-flex items-center select-none transition-all duration-200',
        config.gapClass,
        isBadgeVariant &&
          'rounded-full border border-sky-500/20 bg-slate-900/60 backdrop-blur-md px-3 py-1 shadow-lg shadow-cyan-950/20 hover:border-sky-500/40',
        className
      )}
    >
      {/* 1. Geometric Silicon Hex Mark */}
      {showMark && (
        <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
          <LogoMark
            size={config.markSize}
            theme={theme}
            mono={isMono}
            className={markClassName}
          />
        </div>
      )}

      {/* 2. Wordmark Typography */}
      {showText && (
        <div className={cn('flex flex-col', textClassName)}>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'font-display transition-colors duration-200',
                titleColor,
                config.titleClass
              )}
            >
              PC Builder {accentWordmark}
            </span>

            {/* Version / Release Badge */}
            {withBadge && (
              <span
                className={cn(
                  'inline-flex items-center rounded-full border font-mono uppercase tracking-widest font-semibold backdrop-blur-md transition-colors',
                  badgeColor,
                  config.badgeClass
                )}
              >
                {badgeText}
              </span>
            )}
          </div>

          {/* Optional Tagline */}
          {withTagline && (
            <span
              className={cn(
                'font-medium tracking-normal transition-colors',
                taglineColor,
                config.taglineClass,
                taglineClassName
              )}
            >
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );

  // Link wrapper handling
  if (withLink) {
    const targetUrl = href || to;
    if (isRouterPresent) {
      return (
        <Link
          to={targetUrl}
          className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-opacity hover:opacity-95"
        >
          {brandContent}
        </Link>
      );
    }

    return (
      <a
        href={targetUrl}
        className="inline-flex rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-opacity hover:opacity-95"
      >
        {brandContent}
      </a>
    );
  }

  return brandContent;
};

export default Brand;
