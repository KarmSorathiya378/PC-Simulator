import React, { useMemo } from 'react';
import { createCpuIhsTexture } from '../materials/proceduralTextures';

interface Cpu3DProps {
  wireframe?: boolean;
}

export const Cpu3D: React.FC<Cpu3DProps> = ({ wireframe = false }) => {
  const ihsTexture = useMemo(() => createCpuIhsTexture(), []);

  return (
    <group dispose={null}>
      {/* 1. Green Substrate PCB (LGA Package Base) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.12, 3.2]} />
        <meshStandardMaterial
          color="#0F5132"
          roughness={0.5}
          metalness={0.1}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Underside LGA Pin Grid (Golden LGA 1718 contact surface) */}
      <mesh position={[0, -0.065, 0]} receiveShadow>
        <boxGeometry args={[2.9, 0.02, 2.9]} />
        <meshStandardMaterial
          color="#EAB308"
          roughness={0.2}
          metalness={0.9}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3. Golden Alignment Triangle Indicator on Substrate Corner */}
      <mesh position={[-1.4, 0.065, -1.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.15, 0.01, 3]} />
        <meshStandardMaterial color="#FACC15" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* 4. Socket Keying Notches (AM5 side alignment cutouts) */}
      <mesh position={[-1.6, 0, 0]}>
        <boxGeometry args={[0.08, 0.14, 0.3]} />
        <meshStandardMaterial color="#0A3622" roughness={0.7} />
      </mesh>
      <mesh position={[1.6, 0, 0]}>
        <boxGeometry args={[0.08, 0.14, 0.3]} />
        <meshStandardMaterial color="#0A3622" roughness={0.7} />
      </mesh>

      {/* 5. Integrated Heat Spreader (IHS) Base Plate */}
      <mesh position={[0, 0.14, 0]} castShadow>
        <boxGeometry args={[2.8, 0.16, 2.8]} />
        <meshStandardMaterial
          color="#D1D5DB"
          roughness={0.25}
          metalness={0.85}
          wireframe={wireframe}
        />
      </mesh>

      {/* 6. Sculpted IHS Top Cap (Stepped AM5 Octagonal/Cutout profile) */}
      <mesh position={[0, 0.23, 0]} castShadow>
        <boxGeometry args={[2.4, 0.06, 2.4]} />
        <meshStandardMaterial
          map={ihsTexture}
          color="#E2E8F0"
          roughness={0.28}
          metalness={0.82}
          wireframe={wireframe}
        />
      </mesh>

      {/* 7. AM5 IHS Cutout Wings / Perimeter Retention Lugs */}
      {[-1.15, 1.15].map((x) =>
        [-1.15, 1.15].map((z) => (
          <mesh key={`wing-${x}-${z}`} position={[x, 0.13, z]} castShadow>
            <boxGeometry args={[0.35, 0.12, 0.35]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.3} metalness={0.8} />
          </mesh>
        ))
      )}
    </group>
  );
};
