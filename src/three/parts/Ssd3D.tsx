import React, { useMemo } from 'react';
import { createGoldFingerTexture } from '../materials/proceduralTextures';

interface Ssd3DProps {
  wireframe?: boolean;
}

export const Ssd3D: React.FC<Ssd3DProps> = ({ wireframe = false }) => {
  const goldTexture = useMemo(() => createGoldFingerTexture(), []);

  return (
    <group dispose={null}>
      {/* 1. Slim M.2 2280 PCB Circuit Board (Matte Black Solder Mask) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.6, 1.5, 0.08]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.6}
          metalness={0.15}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. M.2 M-Key Edge Contact Gold Fingers (Right Edge Connector) */}
      <group position={[2.6, 0, 0]}>
        {/* Top Gold Contact Strip */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[0.38, 1.4]} />
          <meshStandardMaterial
            map={goldTexture}
            roughness={0.15}
            metalness={0.95}
            wireframe={wireframe}
          />
        </mesh>
        {/* Bottom Gold Contact Strip */}
        <mesh position={[0, 0, -0.045]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.38, 1.4]} />
          <meshStandardMaterial
            map={goldTexture}
            roughness={0.15}
            metalness={0.95}
            wireframe={wireframe}
          />
        </mesh>
        {/* M.2 M-Key Alignment Notch Cutout (Pins 59-66) */}
        <mesh position={[0.02, 0.28, 0]}>
          <boxGeometry args={[0.42, 0.18, 0.12]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
      </group>

      {/* 3. Rear Standoff Half-Circle Mounting Screw Notch (Left Edge) */}
      <group position={[-2.78, 0, 0]}>
        {/* Grounding Ring Washer Pad around Screw Hole */}
        <mesh position={[0.1, 0, 0.045]}>
          <ringGeometry args={[0.14, 0.28, 16]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.3} metalness={0.85} />
        </mesh>
        {/* Notch cutout */}
        <mesh position={[-0.05, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
      </group>

      {/* 4. High-Performance NVMe PCIe 4.0 Controller Chip (Nickel Heatspreader) */}
      <group position={[1.4, 0, 0.08]}>
        {/* Controller BGA IC Base Package */}
        <mesh castShadow>
          <boxGeometry args={[1.05, 1.05, 0.1]} />
          <meshStandardMaterial
            color="#1E293B"
            roughness={0.5}
            metalness={0.3}
            wireframe={wireframe}
          />
        </mesh>
        {/* Nickel-Plated Thermal Spreader Cap */}
        <mesh position={[0, 0, 0.055]} castShadow>
          <boxGeometry args={[0.95, 0.95, 0.03]} />
          <meshStandardMaterial
            color="#CBD5E1"
            roughness={0.2}
            metalness={0.9}
            wireframe={wireframe}
          />
        </mesh>
        {/* Laser Etch Controller Branding Core */}
        <mesh position={[0, 0, 0.075]}>
          <planeGeometry args={[0.7, 0.35]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
      </group>

      {/* 5. LPDDR4 DRAM Cache Memory Chip */}
      <mesh position={[0.4, 0, 0.07]} castShadow>
        <boxGeometry args={[0.65, 0.55, 0.07]} />
        <meshStandardMaterial
          color="#18202F"
          roughness={0.45}
          metalness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* 6. Dual 3D TLC/QLC V-NAND Flash Storage Packages */}
      {[-0.75, -2.05].map((x, idx) => (
        <group key={`nand-${idx}`} position={[x, 0, 0.08]}>
          {/* NAND Epoxy Package */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.15, 1.25, 0.1]} />
            <meshStandardMaterial
              color="#0B0F17"
              roughness={0.4}
              metalness={0.25}
              wireframe={wireframe}
            />
          </mesh>
          {/* Silver Pin-1 Orientation Index Dot */}
          <mesh position={[-0.45, 0.48, 0.055]}>
            <circleGeometry args={[0.035, 12]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Subtle NAND Package Top Decal / Markings */}
          <mesh position={[0, 0, 0.052]}>
            <planeGeometry args={[0.95, 0.8]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* 7. Power Management IC (PMIC) and Miniature SMD Inductor */}
      <group position={[1.4, 0.55, 0.06]}>
        <mesh castShadow>
          <boxGeometry args={[0.25, 0.25, 0.05]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} />
        </mesh>
      </group>
      <group position={[0.85, 0.52, 0.07]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.3, 0.08]} />
          <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* 8. Dense SMD Multilayer Ceramic Capacitors (MLCC) Along Rails */}
      {[-1.35, -0.15, 0.0, 0.15, 0.9, 1.05, 2.05, 2.2].map((x) => (
        <group key={`smd-${x}`}>
          <mesh position={[x, -0.6, 0.055]}>
            <boxGeometry args={[0.08, 0.05, 0.04]} />
            <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[x, 0.6, 0.055]}>
            <boxGeometry args={[0.08, 0.05, 0.04]} />
            <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 9. Graphene / Copper Thermal Heat Spreader Label Accent */}
      <mesh position={[-1.4, 0, -0.045]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.8, 1.3]} />
        <meshStandardMaterial
          color="#B45309"
          roughness={0.25}
          metalness={0.85}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
};
