import React from 'react';
import { Box, Layers } from 'lucide-react';
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
      role="group"
      aria-label="Assembly canvas view mode"
      className={cn(
        'inline-flex items-center p-1 rounded-lg border border-border/80 bg-muted/50 backdrop-blur-xs shadow-2xs',
        className
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={mode === '3d'}
        onClick={() => onChange('3d')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-tight transition-all duration-150 active:scale-95 cursor-pointer',
          mode === '3d'
            ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/20 font-bold'
            : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
        )}
      >
        <Box className="size-3.5" />
        <span>3D Chassis View</span>
        <span
          className={cn(
            'ml-1 text-[10px] uppercase font-mono px-1 py-0.2 rounded',
            mode === '3d'
              ? 'bg-primary-foreground/20 text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          Primary
        </span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={mode === '2d'}
        onClick={() => onChange('2d')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-tight transition-all duration-150 active:scale-95 cursor-pointer',
          mode === '2d'
            ? 'bg-card text-foreground border border-border/80 shadow-xs font-bold'
            : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
        )}
      >
        <Layers className="size-3.5" />
        <span>2D Schematic</span>
      </button>
    </div>
  );
};
