import React, { useMemo } from 'react';
import { createHoneycombTexture } from '../materials/proceduralTextures';

interface Psu3DProps {
  wireframe?: boolean;
}

export const Psu3D: React.FC<Psu3DProps> = ({ wireframe = false }) => {
  const honeycombTexture = useMemo(() => createHoneycombTexture(), []);

  return (
    <group dispose={null}>
      {/* Centered at origin [0, 0, 0] across modular socket array and rear AC power port */}
      <group position={[0, 0, -0.04]}>
        {/* 1. Main ATX Steel Casing Body (Powder-coated textured dark metal) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 3.2, 5.2]} />
        <meshStandardMaterial
          color="#181F2A"
          roughness={0.4}
          metalness={0.65}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Bottom 120mm Intake Fan Assembly */}
      <group position={[0, -1.61, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Fan Cutout Recession */}
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[1.8, 32]} />
          <meshStandardMaterial color="#0B0F17" roughness={0.8} />
        </mesh>
        {/* Circular Concentric Wire Fan Guard Rings */}
        {[0.6, 1.1, 1.6].map((radius, rIdx) => (
          <mesh key={`ring-${rIdx}`} position={[0, 0, 0.02]}>
            <torusGeometry args={[radius, 0.035, 12, 32]} />
            <meshStandardMaterial color="#64748B" roughness={0.25} metalness={0.8} />
          </mesh>
        ))}
        {/* Fan Guard Cross Spokes */}
        {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((angle, sIdx) => (
          <mesh key={`spoke-${sIdx}`} position={[0, 0, 0.03]} rotation={[0, 0, angle]}>
            <cylinderGeometry args={[0.035, 0.035, 3.6, 8]} />
            <meshStandardMaterial color="#64748B" roughness={0.25} metalness={0.8} />
          </mesh>
        ))}
        {/* Central Logo Hub Disc */}
        <mesh position={[0, 0, 0.05]}>
          <cylinderGeometry args={[0.45, 0.45, 0.04, 24]} />
          <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* 3. Rear Panel: Honeycomb Ventilation, AC Inlet, and Rocker Switch */}
      <group position={[0, 0, 2.61]}>
        {/* Hexagonal Mesh Exhaust Surface */}
        <mesh receiveShadow>
          <planeGeometry args={[4.7, 3.1]} />
          <meshStandardMaterial
            map={honeycombTexture}
            roughness={0.5}
            metalness={0.6}
            wireframe={wireframe}
          />
        </mesh>

        {/* C14 3-Prong AC Power Inlet Socket */}
        <group position={[-1.4, -0.4, 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.8, 0.2]} />
            <meshStandardMaterial color="#05080E" roughness={0.8} />
          </mesh>
          {/* Copper Ground and Line Prongs */}
          {[-0.25, 0, 0.25].map((x, pIdx) => (
            <mesh key={`prong-${pIdx}`} position={[x, (pIdx === 1 ? 0.15 : -0.1), 0.05]}>
              <boxGeometry args={[0.06, 0.2, 0.1]} />
              <meshStandardMaterial color="#CA8A04" roughness={0.2} metalness={0.9} />
            </mesh>
          ))}
        </group>

        {/* Master Power Rocker Switch (I / O) */}
        <group position={[-1.4, 0.6, 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.55, 0.18]} />
            <meshStandardMaterial color="#0A0E17" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.08]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.7, 0.4, 0.1]} />
            <meshStandardMaterial color="#DC2626" roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* 4. Front Panel: Fully Modular Socket Terminal Array */}
      <group position={[0, 0, -2.61]} rotation={[0, Math.PI, 0]}>
        {/* Dark Terminal Backplate */}
        <mesh receiveShadow>
          <planeGeometry args={[4.6, 3.0]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>

        {/* 24-Pin ATX Motherboard Cable Modular Sockets (Upper tier) */}
        <group position={[-1.2, 0.6, 0.1]}>
          <mesh castShadow>
            <boxGeometry args={[1.8, 0.6, 0.25]} />
            <meshStandardMaterial color="#030712" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.12]}>
            <boxGeometry args={[1.6, 0.4, 0.05]} />
            <meshStandardMaterial color="#EAB308" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>

        {/* 4x 8-Pin CPU / PCIe Modular Power Sockets (Middle tier) */}
        {[-1.5, -0.5, 0.5, 1.5].map((x, sIdx) => (
          <mesh key={`pcie-sock-${sIdx}`} position={[x, -0.2, 0.1]} castShadow>
            <boxGeometry args={[0.75, 0.55, 0.25]} />
            <meshStandardMaterial color="#050914" roughness={0.8} />
          </mesh>
        ))}

        {/* 3x 6-Pin SATA / Peripheral Sockets (Bottom tier) */}
        {[-1.0, 0, 1.0].map((x, sIdx) => (
          <mesh key={`sata-sock-${sIdx}`} position={[x, -0.9, 0.1]} castShadow>
            <boxGeometry args={[0.7, 0.45, 0.25]} />
            <meshStandardMaterial color="#0A0E1A" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* 5. Side Specification Badge / 80 PLUS GOLD Branding */}
      <group position={[2.41, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[3.8, 2.2]} />
          <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.4} />
        </mesh>
        {/* Gold Accent Bar */}
        <mesh position={[0, 0.7, 0.02]}>
          <planeGeometry args={[3.4, 0.18]} />
          <meshStandardMaterial
            color="#EAB308"
            emissive="#CA8A04"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </group>
      </group>
    </group>
  );
};
