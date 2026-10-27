import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html, ContactShadows } from '@react-three/drei';
import {
  Eye,
  RotateCcw,
  Box,
  CheckCircle2,
  Sparkles,
  Layers,
  SunMedium,
} from 'lucide-react';
import { useAssemblyStore } from '../store/assemblyStore';
import { slots as buildConfigSlots } from '../data/buildConfig';
import { components } from '../data/components';
import type { Slot } from '../types';
import type { HardwarePartType } from '../three/types';
import { Scene3D, Part3D, Case3D } from '../three';
import { getSlot3DTransform, type Slot3DTransform } from './threeSlotLayout';

export type LightingPreset = 'studio' | 'cyberpunk' | 'clean' | 'warm';

export interface Assembly3DCanvasProps {
  /** Currently active step slot ID to guide the user (highlighted ghost placeholder if unfilled, outline if filled) */
  activeSlotId?: string | null;
  /** Array of slot IDs that have already been successfully completed */
  completedSlotIds?: string[];
  /** Optional override for occupied slots: map of slotId -> componentId */
  occupiedSlots?: Record<string, string>;
  /** Callback fired when a 3D slot placeholder or installed part is clicked */
  onSlotSelect?: (slotId: string) => void;
  /** Exploded view expansion factor (0 = assembled, 1 = fully exploded). Overrides internal state if provided */
  explodedFactor?: number;
  /** Global wireframe toggle for inspection */
  wireframeMode?: boolean;
  /** Lighting preset to apply */
  lightingPreset?: LightingPreset;
  /** Show or hide the outer PC chassis */
  showCase?: boolean;
  /** Show or hide interactive UI overlay badges and controls */
  showControlsOverlay?: boolean;
  /** Initial camera position tuple [x, y, z] */
  cameraPosition?: [number, number, number];
  /** Optional container CSS class name */
  className?: string;
}

/**
 * Maps component category to 3D hardware part type.
 */
function resolveHardwarePartType(category?: string): HardwarePartType {
  switch (category) {
    case 'cpu':
      return 'cpu';
    case 'gpu':
      return 'gpu';
    case 'ram':
      return 'ram';
    case 'motherboard':
      return 'motherboard';
    case 'psu':
      return 'psu';
    case 'cooler':
      return 'fan';
    case 'ssd':
      return 'ssd';
    case 'case':
      return 'case';
    default:
      return 'motherboard';
  }
}

/**
 * Computes slot position with optional exploded-view offset applied.
 */
function computePositionWithExplosion(
  basePos: [number, number, number],
  offset: [number, number, number] | undefined,
  factor: number
): [number, number, number] {
  if (!offset || factor <= 0) return basePos;
  return [
    basePos[0] + offset[0] * factor,
    basePos[1] + offset[1] * factor,
    basePos[2] + offset[2] * factor,
  ];
}

/**
 * Dynamic lighting preset rig for the 3D viewport.
 */
const LightingRig: React.FC<{ preset: LightingPreset }> = ({ preset }) => {
  switch (preset) {
    case 'cyberpunk':
      return (
        <>
          <ambientLight intensity={0.25} color="#0b1120" />
          <pointLight position={[4, 6, 4]} intensity={2.2} color="#06b6d4" distance={20} />
          <pointLight position={[-4, -2, -3]} intensity={2.8} color="#ec4899" distance={20} />
          <directionalLight position={[0, 8, 2]} intensity={0.8} color="#8b5cf6" />
        </>
      );
    case 'clean':
      return (
        <>
          <ambientLight intensity={0.7} color="#ffffff" />
          <directionalLight position={[6, 10, 6]} intensity={1.1} color="#f8fafc" />
          <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#e2e8f0" />
        </>
      );
    case 'warm':
      return (
        <>
          <ambientLight intensity={0.4} color="#fef3c7" />
          <directionalLight position={[6, 9, 5]} intensity={1.4} color="#fde68a" />
          <directionalLight position={[-5, 3, -4]} intensity={0.4} color="#fed7aa" />
        </>
      );
    case 'studio':
    default:
      return (
        <>
          <ambientLight intensity={0.65} color="#ffffff" />
          <directionalLight position={[6, 8, 5]} intensity={1.0} color="#ffffff" />
          <directionalLight position={[-6, 4, 4]} intensity={1.1} color="#f8fafc" />
          <directionalLight position={[-4, 1, -2]} intensity={0.6} color="#94a3b8" />
          <directionalLight position={[0, -6, 2]} intensity={0.25} color="#64748b" />
        </>
      );
  }
};

/**
 * Pulsing glowing ghost box for an active, unfilled assembly slot.
 */
const ActiveSlotGhost: React.FC<{
  slot: Slot;
  transform: Slot3DTransform;
  explodedFactor: number;
  onClick?: () => void;
}> = ({ slot, transform, explodedFactor, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle breathing animation for active guidance
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      const s = 1.0 + Math.sin(t * 3.5) * 0.04;
      groupRef.current.scale.set(s, s, s);
    }
  });

  const position = computePositionWithExplosion(
    transform.position,
    transform.explodedOffset,
    explodedFactor
  );

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={transform.rotation ?? [0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* Translucent volumetric highlight */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={transform.placeholderSize} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.7}
          transparent
          opacity={0.3}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Crisp glowing wireframe bounds */}
      <mesh>
        <boxGeometry args={transform.placeholderSize} />
        <meshBasicMaterial
          color="#60A5FA"
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Floating 3D Target Marker & Badge */}
      <Html
        position={[0, transform.placeholderSize[1] / 2 + 0.35, 0]}
        center
        zIndexRange={[0, 0]}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/85 border border-sky-400/70 text-sky-200 text-[10px] font-mono font-medium shadow-lg shadow-sky-500/20 backdrop-blur-sm cursor-pointer select-none whitespace-nowrap hover:scale-105 transition-transform"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping inline-block" />
          <span>Active: {slot.label}</span>
        </div>
      </Html>
    </group>
  );
};

/**
 * Colored bounding ring / outline around an installed hardware part.
 * Supports active (cyan glowing) and completed (emerald green) styling.
 */
const SlotOutline: React.FC<{
  transform: Slot3DTransform;
  explodedFactor: number;
  variant: 'active' | 'completed';
  label?: string;
  onClick?: () => void;
}> = ({ transform, explodedFactor, variant, label, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const isActive = variant === 'active';

  useFrame(({ clock }) => {
    if (isActive && groupRef.current) {
      const t = clock.getElapsedTime();
      const s = 1.0 + Math.sin(t * 3.0) * 0.03;
      groupRef.current.scale.set(s, s, s);
    }
  });

  const position = computePositionWithExplosion(
    transform.position,
    transform.explodedOffset,
    explodedFactor
  );

  const outlineColor = isActive ? '#38BDF8' : '#10B981';
  const emissiveColor = isActive ? '#0284C7' : '#059669';

  const bounds: [number, number, number] = [
    transform.placeholderSize[0] * 1.08,
    transform.placeholderSize[1] * 1.08,
    transform.placeholderSize[2] * 1.08,
  ];

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={transform.rotation ?? [0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* Bounding box wireframe outline */}
      <mesh>
        <boxGeometry args={bounds} />
        <meshBasicMaterial
          color={outlineColor}
          wireframe
          transparent
          opacity={isActive ? 0.9 : 0.4}
        />
      </mesh>

      {/* Subtle corner halo fill */}
      <mesh>
        <boxGeometry args={bounds} />
        <meshStandardMaterial
          color={outlineColor}
          emissive={emissiveColor}
          emissiveIntensity={isActive ? 0.35 : 0.12}
          transparent
          opacity={isActive ? 0.15 : 0.04}
          roughness={0.3}
        />
      </mesh>

      {/* Active step label */}
      {isActive && label && (
        <Html
          position={[0, bounds[1] / 2 + 0.35, 0]}
          center
          zIndexRange={[0, 0]}
        >
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950/85 border border-sky-400/70 text-sky-200 text-[10px] font-mono font-medium shadow-lg shadow-sky-500/20 backdrop-blur-sm select-none pointer-events-none whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
            <span>Active: {label}</span>
          </div>
        </Html>
      )}
    </group>
  );
};

/**
 * Interactive 3D Assembly Canvas for PC Builder Lab.
 * Renders the full PC chassis, installed parts, active slot targets, and completed outlines.
 * Supports interactive orbit controls, exploded view animation, lighting presets, and wireframe toggle.
 */
export const Assembly3DCanvas: React.FC<Assembly3DCanvasProps> = ({
  activeSlotId = null,
  completedSlotIds = [],
  occupiedSlots: occupiedSlotsProp,
  onSlotSelect,
  explodedFactor: explodedFactorProp,
  wireframeMode = false,
  lightingPreset: lightingPresetProp = 'studio',
  showCase = true,
  showControlsOverlay = true,
  cameraPosition = [-12.2, 4.2, 11.2],
  className = 'w-full h-full min-h-[500px]',
}) => {
  const storeOccupiedSlots = useAssemblyStore((state) => state.occupiedSlots);
  const occupiedSlots = occupiedSlotsProp ?? storeOccupiedSlots;

  const [internalWireframe, setInternalWireframe] = useState(false);
  const [internalExploded, setInternalExploded] = useState(0);
  const [currentPreset, setCurrentPreset] = useState<LightingPreset>(lightingPresetProp);
  const [sceneKey, setSceneKey] = useState(0);

  const effectiveWireframe = wireframeMode || internalWireframe;
  const effectiveExplodedFactor = explodedFactorProp ?? internalExploded;

  // Total installed parts count
  const installedCount = useMemo(() => {
    return Object.keys(occupiedSlots).filter((key) => Boolean(occupiedSlots[key])).length;
  }, [occupiedSlots]);

  const handleResetCamera = () => {
    setSceneKey((prev) => prev + 1);
  };

  const handleCycleLighting = () => {
    const presets: LightingPreset[] = ['studio', 'cyberpunk', 'clean', 'warm'];
    const nextIdx = (presets.indexOf(currentPreset) + 1) % presets.length;
    setCurrentPreset(presets[nextIdx]);
  };

  return (
    <div
      className={`relative w-full h-full select-none overflow-hidden bg-slate-950/60 rounded-xl border border-slate-800 ${className}`}
    >
      {/* 3D Viewport Scene */}
      <Scene3D
        key={`scene-${sceneKey}`}
        cameraPosition={cameraPosition}
        fov={38}
        showShadows={false}
        autoCenter={false}
        autoFit={true}
        targetFill={0.88}
        className="w-full h-full"
      >
        {/* Dynamic Lighting Rig */}
        <LightingRig preset={currentPreset} />

        {/* Subtle ground grid floor */}
        <gridHelper
          args={[26, 26, '#334155', '#1E293B']}
          position={[0, -5.31, 0]}
        />

        {/* Soft ground contact shadow below chassis rubber feet */}
        <ContactShadows
          position={[0, -5.3, 0]}
          opacity={0.65}
          scale={22}
          blur={2.4}
          far={8}
          resolution={512}
          color="#050811"
        />

        {/* 1. Main PC Mid-Tower Chassis (Chamber & Exterior) */}
        {showCase && <Case3D wireframe={effectiveWireframe} />}

        {/* 2. Hardware Slots & Installed Components */}
        {buildConfigSlots.map((slot) => {
          const installedComponentId = occupiedSlots[slot.id];
          const transform = getSlot3DTransform(slot.id, slot);
          const isOccupied = Boolean(installedComponentId);
          const isActive = activeSlotId === slot.id;
          const isCompleted = completedSlotIds.includes(slot.id);

          // Find component metadata to derive hardware part type
          const compDef = installedComponentId
            ? components.find((c) => c.id === installedComponentId)
            : undefined;
          const partType = compDef
            ? resolveHardwarePartType(compDef.category)
            : transform.partType;

          const partPos = computePositionWithExplosion(
            transform.position,
            transform.explodedOffset,
            effectiveExplodedFactor
          );

          return (
            <group key={slot.id}>
              {/* If slot is occupied, render the 3D hardware part */}
              {isOccupied && (
                <Part3D
                  type={partType}
                  position={partPos}
                  rotation={transform.rotation ?? [0, 0, 0]}
                  scale={transform.scale ?? 1}
                  wireframe={effectiveWireframe}
                  hoverHighlight
                  animated
                  onClick={() => onSlotSelect?.(slot.id)}
                />
              )}

              {/* Active filled slot: pulsing outline */}
              {isOccupied && isActive && (
                <SlotOutline
                  transform={transform}
                  explodedFactor={effectiveExplodedFactor}
                  variant="active"
                  label={slot.label}
                  onClick={() => onSlotSelect?.(slot.id)}
                />
              )}

              {/* Completed slot (when not active): subtle emerald outline */}
              {isOccupied && !isActive && isCompleted && (
                <SlotOutline
                  transform={transform}
                  explodedFactor={effectiveExplodedFactor}
                  variant="completed"
                  onClick={() => onSlotSelect?.(slot.id)}
                />
              )}

              {/* Active unfilled slot: glowing ghost placeholder */}
              {!isOccupied && isActive && (
                <ActiveSlotGhost
                  slot={slot}
                  transform={transform}
                  explodedFactor={effectiveExplodedFactor}
                  onClick={() => onSlotSelect?.(slot.id)}
                />
              )}
            </group>
          );
        })}
      </Scene3D>

      {/* Floating UI HUD Overlays */}
      {showControlsOverlay && (
        <>
          {/* Top-Left: Simulator Status & Mode Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/85 border border-slate-700/80 text-slate-200 text-xs font-medium shadow-md backdrop-blur-md">
              <Box className="w-3.5 h-3.5 text-sky-400" />
              <span>3D Interactive Lab</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/85 border border-slate-700/80 text-slate-200 text-xs font-medium shadow-md backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {installedCount} of {buildConfigSlots.length} Slots Installed
              </span>
            </div>
            {activeSlotId && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/85 border border-sky-500/50 text-sky-200 text-xs font-medium shadow-md backdrop-blur-md animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                <span>Target: {buildConfigSlots.find((s) => s.id === activeSlotId)?.label ?? activeSlotId}</span>
              </div>
            )}
          </div>

          {/* Top-Right: Quick Controls (Lighting, Exploded View, Wireframe, Reset Camera) */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            {/* Lighting Preset Button */}
            <button
              type="button"
              onClick={handleCycleLighting}
              title={`Cycle Lighting Preset (Current: ${currentPreset})`}
              className="p-2 rounded-lg border bg-slate-900/85 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800/90 text-xs font-medium transition-all shadow-md backdrop-blur-md flex items-center gap-1.5"
            >
              <SunMedium className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline capitalize">{currentPreset}</span>
            </button>

            {/* Exploded View Toggle */}
            <button
              type="button"
              onClick={() => setInternalExploded((prev) => (prev > 0 ? 0 : 1))}
              title="Toggle Exploded View"
              className={`p-2 rounded-lg border text-xs font-medium transition-all shadow-md backdrop-blur-md flex items-center gap-1.5 ${
                effectiveExplodedFactor > 0
                  ? 'bg-indigo-600/90 border-indigo-400 text-white shadow-indigo-500/20'
                  : 'bg-slate-900/85 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800/90'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">Exploded</span>
            </button>

            {/* Wireframe Inspection Toggle */}
            <button
              type="button"
              onClick={() => setInternalWireframe((prev) => !prev)}
              title="Toggle Wireframe Inspection"
              className={`p-2 rounded-lg border text-xs font-medium transition-all shadow-md backdrop-blur-md flex items-center gap-1.5 ${
                effectiveWireframe
                  ? 'bg-sky-600/90 border-sky-400 text-white shadow-sky-500/20'
                  : 'bg-slate-900/85 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800/90'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wireframe</span>
            </button>

            {/* Reset Camera Button */}
            <button
              type="button"
              onClick={handleResetCamera}
              title="Reset Camera Angle"
              className="p-2 rounded-lg border bg-slate-900/85 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800/90 text-xs font-medium transition-all shadow-md backdrop-blur-md flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Bottom-Center: Navigation & Exploded Slider Hint */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 pointer-events-auto">
            {effectiveExplodedFactor > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-indigo-500/40 shadow-xl backdrop-blur-md">
                <span className="text-[11px] text-indigo-200 font-medium">Explosion:</span>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={effectiveExplodedFactor}
                  onChange={(e) => setInternalExploded(parseFloat(e.target.value))}
                  className="w-24 h-1.5 accent-indigo-400 bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-slate-300 font-mono w-7">
                  {Math.round(effectiveExplodedFactor * 100)}%
                </span>
              </div>
            )}
            <div className="px-3 py-1 rounded-full bg-slate-900/75 border border-slate-800/80 text-[11px] text-slate-400 shadow-sm backdrop-blur-sm pointer-events-none">
              Rotate: Drag • Zoom: Scroll • Pan: Right Click Drag
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Assembly3DCanvas;
