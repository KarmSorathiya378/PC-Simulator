import React, { useMemo } from 'react';
import {
  createGoldFingerTexture,
  createRamHeatsinkTexture,
} from '../materials/proceduralTextures';

interface Ram3DProps {
  wireframe?: boolean;
}

export const Ram3D: React.FC<Ram3DProps> = ({ wireframe = false }) => {
  const goldTexture = useMemo(() => createGoldFingerTexture(), []);
  const heatsinkTexture = useMemo(() => createRamHeatsinkTexture(), []);

  return (
    <group dispose={null}>
      {/* Centered at origin [0, 0, 0] across gold fingers and top RGB diffuser */}
      <group position={[0, -0.08, 0]}>
        {/* 1. Black PCB Substrate */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 1.4, 0.08]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.6}
          metalness={0.1}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Gold Contact Finger Strip (Bottom edge connector) */}
      <mesh position={[0, -0.6, 0.045]}>
        <planeGeometry args={[5.1, 0.22]} />
        <meshStandardMaterial
          map={goldTexture}
          roughness={0.15}
          metalness={0.95}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[0, -0.6, -0.045]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[5.1, 0.22]} />
        <meshStandardMaterial
          map={goldTexture}
          roughness={0.15}
          metalness={0.95}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3. DDR5 Alignment Key Notch (Asymmetrical center notch) */}
      <mesh position={[0.2, -0.68, 0]}>
        <boxGeometry args={[0.18, 0.16, 0.12]} />
        <meshStandardMaterial color="#020617" roughness={0.9} />
      </mesh>

      {/* 4. Dual Anodized Aluminum Heatsink Plates */}
      {[-0.065, 0.065].map((z, idx) => (
        <group key={`heatsink-${idx}`} position={[0, 0.14, z]}>
          {/* Main Heatsink Body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[5.24, 1.25, 0.05]} />
            <meshStandardMaterial
              map={heatsinkTexture}
              color="#334155"
              roughness={0.3}
              metalness={0.7}
              wireframe={wireframe}
            />
          </mesh>

          {/* Upper Heatsink Ridges / Cooling Fins */}
          {[-1.8, -1.2, -0.6, 0.6, 1.2, 1.8].map((x) => (
            <mesh key={`fin-${x}`} position={[x, 0.55, 0.03 * (idx === 0 ? 1 : -1)]}>
              <boxGeometry args={[0.08, 0.35, 0.04]} />
              <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.6} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 5. Frosted RGB Diffuser Light Bar on Top */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[5.3, 0.15, 0.16]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.6}
          roughness={0.2}
          transparent
          opacity={0.92}
          wireframe={wireframe}
        />
      </mesh>

      {/* 6. High-density SMD decoupling capacitors on lower PCB */}
      {[-2.1, -1.7, -1.3, -0.9, -0.5, 0.7, 1.1, 1.5, 1.9, 2.3].map((x) => (
        <mesh key={`cap-${x}`} position={[x, -0.42, 0.05]}>
          <boxGeometry args={[0.06, 0.04, 0.02]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      </group>
    </group>
  );
};
