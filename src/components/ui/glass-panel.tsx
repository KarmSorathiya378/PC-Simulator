import * as React from 'react';
import { cn } from '@/lib/utils';
import { themeTokens, getGlassStyle } from '@/styles/theme';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof themeTokens.glassmorphism;
  glowBorder?: boolean;
  withInnerBevel?: boolean;
  withSheen?: boolean;
  interactive?: boolean;
  rounded?: keyof typeof themeTokens.radii;
}

/**
 * Architectural Glass Panel Primitive.
 * Features multi-layer frosted blur, light-catching hairline perimeter,
 * specular inner bevel, and deep obsidian substrate. Consumes tokens from theme.ts.
 */
export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      variant = 'surface',
      glowBorder = false,
      withInnerBevel = true,
      withSheen = false,
      interactive = false,
      rounded = 'xl',
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const glassStyle = getGlassStyle(variant);

    return (
      <div
        ref={ref}
        style={{
          ...glassStyle,
          borderRadius: themeTokens.radii[rounded] ?? themeTokens.radii.xl,
          ...style,
        }}
        className={cn(
          'relative transition-all duration-200 overflow-hidden',
          withInnerBevel && 'shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_-4px_rgba(0,0,0,0.5)]',
          glowBorder && 'border-primary/45 shadow-[0_0_28px_rgba(14,165,233,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]',
          interactive && 'hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg cursor-pointer active:translate-y-0 active:scale-[0.99]',
          withSheen && 'before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.04] before:to-transparent before:pointer-events-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

export default GlassPanel;
