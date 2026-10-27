import React from 'react';
import { Box, Layers, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import type { CanvasViewMode } from './guidedAssemblyTypes';

interface ViewModeToggleProps {
  mode: CanvasViewMode;
  onChange: (mode: CanvasViewMode) => void;
  className?: string;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  mode,
  onChange,
  className,
}) => {
  return (
    <div
      role="radiogroup"
      aria-label="Assembly viewport rendering mode"
      className={cn(
        'inline-flex items-center p-1 rounded-xl border border-border bg-secondary/60 backdrop-blur-md shadow-xs select-none',
        className
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={mode === '3d'}
        tabIndex={mode === '3d' ? 0 : -1}
        onClick={() => onChange('3d')}
        className={cn(
          'relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer pressable-element focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          mode === '3d'
            ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/30 font-bold'
            : 'text-muted-foreground hover:text-foreground hover:bg-background/70'
        )}
      >
        <Box className={cn('size-3.5 transition-transform duration-200', mode === '3d' && 'scale-110')} />
        <span>3D Viewport</span>
        <span
          className={cn(
            'inline-flex items-center gap-1 text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-md transition-colors',
            mode === '3d'
              ? 'bg-primary-foreground/20 text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          <Sparkles className="size-2" />
          WebGL
        </span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={mode === '2d'}
        tabIndex={mode === '2d' ? 0 : -1}
        onClick={() => onChange('2d')}
        className={cn(
          'relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer pressable-element focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          mode === '2d'
            ? 'bg-card text-foreground border border-border shadow-xs font-bold'
            : 'text-muted-foreground hover:text-foreground hover:bg-background/70'
        )}
      >
        <Layers className={cn('size-3.5 transition-transform duration-200', mode === '2d' && 'scale-110')} />
        <span>2D Schematic</span>
      </button>
    </div>
  );
};

export default ViewModeToggle;
