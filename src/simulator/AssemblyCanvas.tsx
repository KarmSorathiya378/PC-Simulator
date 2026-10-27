import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Line, Text, Group } from 'react-konva';
import type { ComponentDefinition } from '../types';
import { components } from '../data/components';
import { slots } from '../data/buildConfig';
import { useAssemblyStore } from '../store/assemblyStore';
import { getHighlightedSlots } from './assemblyRules';
import { ComponentSprite } from './ComponentSprite';
import { DropZone } from './DropZone';
import { ConnectionLayer } from './ConnectionLayer';

interface AssemblyCanvasProps {
  selectedComponentId?: string | null;
  onSelectComponent?: (comp: ComponentDefinition | null) => void;
  draggedPaletteComponentId?: string | null;
  onDropPaletteComponent?: (slotId: string) => void;
  interactiveMode?: 'assemble' | 'connection' | 'explore';
  width?: number;
  height?: number;
  className?: string;
}

export const AssemblyCanvas: React.FC<AssemblyCanvasProps> = ({
  selectedComponentId = null,
  onSelectComponent,
  draggedPaletteComponentId = null,
  onDropPaletteComponent,
  interactiveMode = 'assemble',
  width = 820,
  height = 580,
  className = '',
}) => {
  const store = useAssemblyStore();
  const stageRef = useRef<any>(null);

  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null);

  // Center the 560x520 build work area within the responsive canvas dimensions
  const offsetX = Math.max(0, Math.floor((width - 560) / 2));
  const offsetY = Math.max(0, Math.floor((height - 530) / 2));

  // Combine component currently dragged internally or dragged from an external palette
  const effectiveDragComponentId = activeDragId || draggedPaletteComponentId;

  // Calculate highlighted valid slot IDs using Ella's simulation engine rules
  const highlightedSlotIds: string[] = effectiveDragComponentId
    ? getHighlightedSlots(store, effectiveDragComponentId)
    : [];

  // Lookup helper for component definitions
  const getComponent = (id: string) => components.find((c) => c.id === id);

  // Check if case is installed (in default build, case is host or installed in base)
  const isCaseInstalled = true;
  const isMbInstalled = Boolean(store.occupiedSlots['slot-motherboard']);
  const isPsuInstalled = Boolean(store.occupiedSlots['slot-psu']);
  const isGpuInstalled = Boolean(store.occupiedSlots['slot-pcie-x16']);

  // Proximity snap distance threshold (in pixels)
  const SNAP_DISTANCE = 75;

  // Handle drag move on canvas
  const handleSpriteDragMove = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    setDragPos(pointerPos);

    // Compute pointer position relative to centered work area
    const relX = pointerPos.x - offsetX;
    const relY = pointerPos.y - offsetY;

    // Check if pointer is near any highlighted valid slot
    let nearestSlotId: string | null = null;
    let minDistance = SNAP_DISTANCE;

    for (const slotId of highlightedSlotIds) {
      const slot = slots.find((s) => s.id === slotId);
      if (!slot) continue;

      const dx = relX - slot.position.x;
      const dy = relY - slot.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < minDistance) {
        minDistance = dist;
        nearestSlotId = slotId;
      }
    }

    setHoveredSlotId(nearestSlotId);
  };

  // Handle drag end / drop evaluation
  const handleSpriteDragEnd = (componentId: string) => {
    const stage = stageRef.current;
    if (!stage) {
      setActiveDragId(null);
      setDragPos(null);
      setHoveredSlotId(null);
      return;
    }

    const pointerPos = stage.getPointerPosition();
    if (pointerPos && hoveredSlotId && highlightedSlotIds.includes(hoveredSlotId)) {
      // Snap to slot and execute install action
      const result = store.installComponent(componentId, hoveredSlotId);
      if (result.ok) {
        onDropPaletteComponent?.(hoveredSlotId);
      }
    }

    // Reset drag state
    setActiveDragId(null);
    setDragPos(null);
    setHoveredSlotId(null);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none bg-card text-card-foreground rounded-xl border border-border p-3 shadow-xs overflow-hidden ${className}`}
    >
      {/* Top Canvas Status Bar */}
      <div className="w-full flex items-center justify-between px-3 py-2 text-xs text-muted-foreground border-b border-border/60 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono font-medium tracking-wider text-foreground">ESD WORKBENCH 2D</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Mode: <strong className="text-foreground capitalize">{interactiveMode}</strong></span>
          <span>Installed: <strong className="text-primary font-semibold">{store.installedPal.length} / {slots.length}</strong></span>
        </div>
      </div>

      <Stage
        ref={stageRef}
        width={width}
        height={height}
        className="cursor-default"
      >
        {/* Layer 1: Engineering Mat Background Grid */}
        <Layer>
          {/* Work mat plate */}
          <Rect
            x={10}
            y={10}
            width={width - 20}
            height={height - 20}
            fill="#101520"
            stroke="#1E2838"
            strokeWidth={1}
            cornerRadius={8}
          />
          {/* Engineering grid lines (every 40px) */}
          {Array.from({ length: Math.floor((width - 20) / 40) }).map((_, i) => (
            <Line
              key={`grid-x-${i}`}
              points={[30 + i * 40, 20, 30 + i * 40, height - 20]}
              stroke="#151D2C"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: Math.floor((height - 20) / 40) }).map((_, i) => (
            <Line
              key={`grid-y-${i}`}
              points={[20, 30 + i * 40, width - 20, 30 + i * 40]}
              stroke="#151D2C"
              strokeWidth={1}
            />
          ))}
          {/* Mat calibration marks */}
          <Text
            x={25}
            y={height - 30}
            text="CHASM HARDWARE BENCH // ANTI-STATIC GROUNDED"
            fontSize={9}
            fill="#334155"
            fontFamily="monospace"
          />
        </Layer>

        {/* Centered Assembly Work Area Group */}
        <Layer>
          <Group x={offsetX} y={offsetY}>
            {/* 1. Computer Case Chassis */}
            {isCaseInstalled && (
              <Group x={50} y={30}>
                <ComponentSprite
                  component={getComponent('case-atx-01')!}
                  x={0}
                  y={0}
                  isDraggable={false}
                  isSelected={selectedComponentId === 'case-atx-01'}
                  onClick={() => onSelectComponent?.(getComponent('case-atx-01')!)}
                />
              </Group>
            )}

            {/* 2. Drop Zones for Unoccupied Slots */}
            {slots.map((slot) => {
              const isOccupied = Boolean(store.occupiedSlots[slot.id]);
              const isValidTarget = highlightedSlotIds.includes(slot.id);
              const isHovered = hoveredSlotId === slot.id;

              return (
                <DropZone
                  key={slot.id}
                  slot={slot}
                  isValidTarget={isValidTarget}
                  isOccupied={isOccupied}
                  isHovered={isHovered}
                  width={slot.accepts.includes('motherboard') ? 305 : slot.accepts.includes('psu') ? 150 : 85}
                  height={slot.accepts.includes('motherboard') ? 305 : slot.accepts.includes('psu') ? 140 : 45}
                />
              );
            })}

            {/* 3. Installed Hardware Components */}
            {/* Motherboard */}
            {store.occupiedSlots['slot-motherboard'] && (
              <ComponentSprite
                component={getComponent(store.occupiedSlots['slot-motherboard'])!}
                x={120}
                y={80}
                isDraggable={false}
                isSelected={selectedComponentId === store.occupiedSlots['slot-motherboard']}
                onClick={() => onSelectComponent?.(getComponent(store.occupiedSlots['slot-motherboard'])!)}
              />
            )}

            {/* M.2 SSD */}
            {store.occupiedSlots['slot-m2'] && (
              <ComponentSprite
                component={getComponent(store.occupiedSlots['slot-m2'])!}
                x={200}
                y={225}
                isDraggable={false}
                isSelected={selectedComponentId === store.occupiedSlots['slot-m2']}
                onClick={() => onSelectComponent?.(getComponent(store.occupiedSlots['slot-m2'])!)}
              />
            )}

            {/* CPU */}
            {store.occupiedSlots['slot-cpu'] && (
              <ComponentSprite
                component={getComponent(store.occupiedSlots['slot-cpu'])!}
                x={200}
                y={150}
                isDraggable={false}
                isSelected={selectedComponentId === store.occupiedSlots['slot-cpu']}
                onClick={() => onSelectComponent?.(getComponent(store.occupiedSlots['slot-cpu'])!)}
              />
            )}

            {/* RAM Modules */}
            {['slot-ram-1', 'slot-ram-2', 'slot-ram-3', 'slot-ram-4'].map((ramSlotId) => {
              const installedCompId = store.occupiedSlots[ramSlotId];
              if (!installedCompId) return null;
              const slot = slots.find((s) => s.id === ramSlotId);
              return (
                <ComponentSprite
                  key={ramSlotId}
                  component={getComponent(installedCompId)!}
                  x={slot?.position.x ?? 275}
                  y={slot?.position.y ?? 130}
                  isDraggable={false}
                  isSelected={selectedComponentId === installedCompId}
                  onClick={() => onSelectComponent?.(getComponent(installedCompId)!)}
                />
              );
            })}

            {/* Cooler (Over CPU) */}
            {store.occupiedSlots['slot-cooler'] && (
              <ComponentSprite
                component={getComponent(store.occupiedSlots['slot-cooler'])!}
                x={178}
                y={125}
                isDraggable={false}
                isSelected={selectedComponentId === store.occupiedSlots['slot-cooler']}
                onClick={() => onSelectComponent?.(getComponent(store.occupiedSlots['slot-cooler'])!)}
              />
            )}

            {/* GPU PCIe Card */}
            {store.occupiedSlots['slot-pcie-x16'] && (
              <ComponentSprite
                component={getComponent(store.occupiedSlots['slot-pcie-x16'])!}
                x={125}
                y={255}
                isDraggable={false}
                isSelected={selectedComponentId === store.occupiedSlots['slot-pcie-x16']}
                onClick={() => onSelectComponent?.(getComponent(store.occupiedSlots['slot-pcie-x16'])!)}
              />
            )}

            {/* PSU in Chassis Lower Compartment */}
            {store.occupiedSlots['slot-psu'] && (
              <ComponentSprite
                component={getComponent(store.occupiedSlots['slot-psu'])!}
                x={60}
                y={410}
                isDraggable={false}
                isSelected={selectedComponentId === store.occupiedSlots['slot-psu']}
                onClick={() => onSelectComponent?.(getComponent(store.occupiedSlots['slot-psu'])!)}
              />
            )}

            {/* Cable Routing & Power Connections */}
            <ConnectionLayer
              activeConnections={store.connections}
              isPsuInstalled={isPsuInstalled}
              isMbInstalled={isMbInstalled}
              isGpuInstalled={isGpuInstalled}
              isInteractive={interactiveMode === 'connection' || interactiveMode === 'assemble'}
              onConnect={(cableId, socketId) => store.connect(cableId, socketId)}
              onDisconnect={(cableId) => {
                useAssemblyStore.setState((prev) => ({
                  connections: prev.connections.filter((c) => c.cableId !== cableId),
                }));
              }}
            />
          </Group>
        </Layer>

        {/* Layer 3: Floating Sprite During Active Drag */}
        {activeDragId && dragPos && (
          <Layer>
            <ComponentSprite
              component={getComponent(activeDragId)!}
              x={dragPos.x - (getComponent(activeDragId)?.visual.width ?? 60) / 2}
              y={dragPos.y - (getComponent(activeDragId)?.visual.height ?? 60) / 2}
              isDraggable={true}
              onDragMove={handleSpriteDragMove}
              onDragEnd={() => handleSpriteDragEnd(activeDragId)}
            />
          </Layer>
        )}
      </Stage>

      {/* Bottom Canvas Feedback Banner */}
      {store.lastFeedback && (
        <div
          className={`w-full mt-3 py-2 px-3 rounded-lg text-xs flex items-center justify-between border transition-all ${
            store.lastFeedback.ok
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
              : 'bg-rose-950/40 text-rose-300 border-rose-800/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold">{store.lastFeedback.ok ? '✓' : '⚠️'}</span>
            <span>{store.lastFeedback.message}</span>
          </div>
          <button
            onClick={() => useAssemblyStore.setState({ lastFeedback: null })}
            className="text-muted-foreground hover:text-foreground ml-2 text-sm leading-none"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AssemblyCanvas;
