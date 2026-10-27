import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Part3DProps } from './types';
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
 * Polymorphic Part3D component.
 * Renders high-fidelity procedural 3D hardware based on the `type` prop.
 */
export const Part3D: React.FC<Part3DProps> = ({
  type,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  hoverHighlight = true,
  autoRotate = false,
  wireframe = false,
  animated = true,
  onHover,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Subtle auto-rotation when enabled
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
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

  // Convert scalar scale to 3D vector tuple if needed
  const baseScale: [number, number, number] = Array.isArray(scale)
    ? scale
    : [scale, scale, scale];

  // Subtle hover spring/lerp expansion
  const hoverScaleMultiplier = hovered && hoverHighlight ? 1.05 : 1.0;
  const computedScale: [number, number, number] = [
    baseScale[0] * hoverScaleMultiplier,
    baseScale[1] * hoverScaleMultiplier,
    baseScale[2] * hoverScaleMultiplier,
  ];

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
      {type === 'cpu' && <Cpu3D wireframe={wireframe} />}
      {type === 'ram' && <Ram3D wireframe={wireframe} />}
      {type === 'gpu' && <Gpu3D wireframe={wireframe} animated={animated} />}
      {type === 'motherboard' && <Motherboard3D wireframe={wireframe} />}
      {type === 'psu' && <Psu3D wireframe={wireframe} />}
      {type === 'fan' && <CaseFan3D wireframe={wireframe} animated={animated} />}
      {type === 'cable' && <Cable3D wireframe={wireframe} />}
      {type === 'case' && <Case3D wireframe={wireframe} />}
      {type === 'ssd' && <Ssd3D wireframe={wireframe} />}
    </group>
  );
};
