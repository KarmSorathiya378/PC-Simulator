import React, { useState } from 'react';
import { AssemblyCanvas as BaseAssemblyCanvas } from '../simulator/AssemblyCanvas';
import type { ComponentDefinition } from '../types';
import { components } from '../data/components';
import { Scene3D } from '../three/Scene3D';
import { Part3D } from '../three/Part3D';
import type { HardwarePartType } from '../three/types';
import { Box, Layers, Maximize2, X, RotateCcw } from 'lucide-react';

export interface AssemblyCanvasProps {
  selectedComponentId?: string | null;
  onSelectComponent?: (comp: ComponentDefinition | null) => void;
  draggedPaletteComponentId?: string | null;
  onDropPaletteComponent?: (slotId: string) => void;
  interactiveMode?: 'assemble' | 'connection' | 'explore' | '3d';
  width?: number;
  height?: number;
  className?: string;
  viewMode?: '2d' | '3d';
  show3DInspector?: boolean;
}

const CATEGORY_TO_3D: Record<string, HardwarePartType> = {
  cpu: 'cpu',
  ram: 'ram',
  gpu: 'gpu',
  motherboard: 'motherboard',
  psu: 'psu',
  cooler: 'fan',
  case: 'case',
  ssd: 'ssd',
};

/**
 * Hybrid 2D/3D Interactive Assembly Canvas.
 * Combines schematic 2D layout drag-and-drop with an auto-framing
 * 3D hardware presentation viewport that normalizes model bounds
 * to occupy ~85% of its container with clean studio lighting and dynamic contact shadows.
 */
export const AssemblyCanvas: React.FC<AssemblyCanvasProps> = ({
  selectedComponentId = null,
  onSelectComponent,
  draggedPaletteComponentId = null,
  onDropPaletteComponent,
  interactiveMode = 'assemble',
  width = 820,
  height = 580,
  className = '',
  viewMode: viewModeProp,
  show3DInspector = true,
}) => {
  const [internalViewMode, setInternalViewMode] = useState<'2d' | '3d'>(
    viewModeProp || (interactiveMode === '3d' ? '3d' : '2d')
  );
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showInspectorOverlay, setShowInspectorOverlay] = useState<boolean>(false);

  const activeViewMode = viewModeProp || internalViewMode;

  const selectedComp = selectedComponentId
    ? components.find((c) => c.id === selectedComponentId)
    : null;

  const selectedPartType = selectedComp
    ? CATEGORY_TO_3D[selectedComp.category]
    : null;

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* View Mode Switching Tabs (when interactiveMode is assemble/explore) */}
      <div className="absolute top-3 right-4 z-20 flex items-center gap-1 glass-surface p-1 rounded-xl border border-border/80 shadow-xs">
        <button
          type="button"
          onClick={() => setInternalViewMode('2d')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer pressable-element ${
            activeViewMode === '2d'
              ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/25'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers className="size-3.5" />
          <span>2D Schematic</span>
        </button>
        <button
          type="button"
          onClick={() => setInternalViewMode('3d')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer pressable-element ${
            activeViewMode === '3d'
              ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/25'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Box className="size-3.5" />
          <span>3D Model</span>
        </button>
      </div>

      {/* Primary Display Viewport */}
      {activeViewMode === '2d' ? (
        <BaseAssemblyCanvas
          selectedComponentId={selectedComponentId}
          onSelectComponent={onSelectComponent}
          draggedPaletteComponentId={draggedPaletteComponentId}
          onDropPaletteComponent={onDropPaletteComponent}
          interactiveMode={interactiveMode === '3d' ? 'assemble' : interactiveMode}
          width={width}
          height={height}
          className="w-full"
        />
      ) : (
        <div
          className="relative w-full rounded-2xl border border-border/80 bg-secondary/30 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center card-elevated"
          style={{ width: '100%', maxWidth: `${width}px`, height: `${height}px`, minHeight: '420px' }}
        >
          {/* Studio Reticle Corner Accents */}
          <div className="absolute top-3 left-3 size-4 border-t-2 border-l-2 border-primary/50 pointer-events-none z-10" />
          <div className="absolute top-3 right-3 size-4 border-t-2 border-r-2 border-primary/50 pointer-events-none z-10" />
          <div className="absolute bottom-3 left-3 size-4 border-b-2 border-l-2 border-primary/50 pointer-events-none z-10" />
          <div className="absolute bottom-3 right-3 size-4 border-b-2 border-r-2 border-primary/50 pointer-events-none z-10" />

          {/* Top Left HUD Label */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
              3D Presentation Studio (88% Auto-Framed)
            </span>
          </div>

          {/* 3D Scene Auto-Framing Viewport */}
          <div className="w-full h-full flex-1">
            <Scene3D
              autoFit={true}
              targetFill={0.88}
              autoCenter={true}
              autoRotate={autoRotate}
              autoRotateSpeed={0.8}
              cameraPosition={[4.5, 3.5, 6.0]}
              fov={38}
              className="w-full h-full"
            >
              <Part3D
                type={selectedPartType || 'motherboard'}
                fitContainer={true}
                animated={true}
                hoverHighlight={true}
              />
            </Scene3D>
          </div>

          {/* Bottom HUD Controls */}
          <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-xs text-muted-foreground pointer-events-none">
            <div className="glass-surface px-2.5 py-1 rounded-md border border-border/70 text-[11px] font-mono shadow-xs">
              Model: <strong className="text-foreground capitalize">{selectedComp?.name || 'Motherboard ATX'}</strong>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={() => setAutoRotate((prev) => !prev)}
                className="glass-surface px-2.5 py-1 rounded-md border border-border/70 text-[11px] hover:text-foreground font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="size-3 text-primary" />
                <span>{autoRotate ? 'Pause Rotation' : 'Auto Rotate'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating 3D Component Inspector Drawer (Available in 2D mode when component is selected) */}
      {show3DInspector && activeViewMode === '2d' && selectedPartType && (
        <div className="absolute bottom-4 right-4 z-20 w-48 h-48 rounded-xl border border-primary-border bg-card/90 glass-surface shadow-lg overflow-hidden flex flex-col">
          <div className="px-2.5 py-1 bg-primary-light border-b border-primary-border flex items-center justify-between text-[10px] font-mono font-bold text-primary">
            <span className="truncate">{selectedComp?.name}</span>
            <span className="text-[9px] uppercase px-1 rounded bg-primary text-white">3D</span>
          </div>
          <div className="flex-1 w-full relative">
            <Scene3D
              autoFit={true}
              targetFill={0.88}
              autoCenter={true}
              autoRotate={true}
              autoRotateSpeed={1.0}
              cameraPosition={[4, 3, 5]}
              fov={38}
              className="w-full h-full"
            >
              <Part3D type={selectedPartType} fitContainer={true} animated={false} />
            </Scene3D>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssemblyCanvas;
export * from '../simulator/AssemblyCanvas';
