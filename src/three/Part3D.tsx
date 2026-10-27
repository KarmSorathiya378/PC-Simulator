import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';
import type { Part3DProps, HardwarePartType } from './types';
import { Cpu3D } from './parts/Cpu3D';
import { Ram3D } from './parts/Ram3D';
import { Gpu3D } from './parts/Gpu3D';
import { Motherboard3D } from './parts/Motherboard3D';
import { Psu3D } from './parts/Psu3D';
import { CaseFan3D } from './parts/CaseFan3D';
import { Cable3D } from './parts/Cable3D';
import { Case3D } from './parts/Case3D';
import { Ssd3D } from './parts/Ssd3D';

/**
 * Standard canonical presentation scale multipliers.
 * Normalizes different hardware dimensions (from a 3.2 unit CPU wafer to a 10.5 unit Chassis)
 * so every standalone model occupies an identical, balanced ~7.5 unit footprint in its container.
 */
export const PART_CANONICAL_SCALES: Record<HardwarePartType, number> = {
  cpu: 2.35,         // 3.2 * 2.35 = 7.52
  ram: 1.45,         // 5.2 * 1.45 = 7.54
  gpu: 1.0,          // 7.6 * 1.0 = 7.60
  motherboard: 0.96, // 7.8 * 0.96 = 7.49
  psu: 1.45,         // 5.2 * 1.45 = 7.54
  fan: 1.7,          // 4.4 * 1.7 = 7.48
  cable: 1.6,        // 4.7 * 1.6 = 7.52
  case: 0.72,        // 10.5 * 0.72 = 7.56
  ssd: 1.35,         // 5.6 * 1.35 = 7.56
};

/**
 * Polymorphic Part3D component with responsive micro-interactions.
 * Integrates procedural 3D parts with subtle pointer states,
 * container-fill scaling, and studio lighting responsiveness.
 */
export const Part3D: React.FC<Part3DProps> = ({
  type,
  scale,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  hoverHighlight = true,
  autoRotate = false,
  wireframe = false,
  animated = true,
  fitContainer,
  autoCenter,
  onHover,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Smooth continuous auto-rotation when requested
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  const handlePointerOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (hoverHighlight) {
      setHovered(true);
      document.body.style.cursor = 'pointer';
    }
    onHover?.(true);
  };

  const handlePointerOut = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (hoverHighlight) {
      setHovered(false);
      document.body.style.cursor = 'auto';
    }
    onHover?.(false);
  };

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onClick?.();
  };

  // Determine if this part is being viewed in standalone/preview mode
  const isStandalone = position[0] === 0 && position[1] === 0 && position[2] === 0;
  const shouldAutoFit = fitContainer ?? (scale === undefined && isStandalone);
  const shouldAutoCenter = autoCenter ?? (isStandalone && scale === undefined);

  const canonicalMultiplier = shouldAutoFit
    ? PART_CANONICAL_SCALES[type] ?? 1.0
    : 1.0;

  // Compute final 3D vector scale
  const baseScale: [number, number, number] = Array.isArray(scale)
    ? [scale[0], scale[1], scale[2]]
    : typeof scale === 'number'
    ? [scale, scale, scale]
    : [canonicalMultiplier, canonicalMultiplier, canonicalMultiplier];

  // Subtle physical expansion when hovered
  const hoverScaleMultiplier = hovered && hoverHighlight ? 1.04 : 1.0;
  const computedScale: [number, number, number] = [
    baseScale[0] * hoverScaleMultiplier,
    baseScale[1] * hoverScaleMultiplier,
    baseScale[2] * hoverScaleMultiplier,
  ];

  const content = (
    <>
      {type === 'cpu' && <Cpu3D wireframe={wireframe} />}
      {type === 'ram' && <Ram3D wireframe={wireframe} />}
      {type === 'gpu' && <Gpu3D wireframe={wireframe} animated={animated} />}
      {type === 'motherboard' && <Motherboard3D wireframe={wireframe} />}
      {type === 'psu' && <Psu3D wireframe={wireframe} />}
      {type === 'fan' && <CaseFan3D wireframe={wireframe} animated={animated} />}
      {type === 'cable' && <Cable3D wireframe={wireframe} />}
      {type === 'case' && <Case3D wireframe={wireframe} />}
      {type === 'ssd' && <Ssd3D wireframe={wireframe} />}
    </>
  );

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={computedScale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {shouldAutoCenter ? <Center>{content}</Center> : content}
    </group>
  );
};

export default Part3D;
