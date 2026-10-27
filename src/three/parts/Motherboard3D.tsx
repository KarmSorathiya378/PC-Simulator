import React, { useMemo } from 'react';
import { createPcbTexture } from '../materials/proceduralTextures';

interface Motherboard3DProps {
  wireframe?: boolean;
}

export const Motherboard3D: React.FC<Motherboard3DProps> = ({
  wireframe = false,
}) => {
  const pcbTexture = useMemo(() => createPcbTexture(), []);

  return (
    <group dispose={null}>
      {/* Centered at origin [0, 0, 0] across PCB and VRM/heatsink height */}
      <group position={[0, -0.62, 0]}>
        {/* 1. Main ATX Motherboard PCB Substrate */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.8, 0.12, 7.8]} />
        <meshStandardMaterial
          map={pcbTexture}
          color="#1E293B"
          roughness={0.6}
          metalness={0.2}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. ATX Mounting Standoff Ground Rings (9 positions) */}
      {[
        [-3.4, -3.4], [0, -3.4], [3.4, -3.4],
        [-3.4, 0],    [0, 0],    [3.4, 0],
        [-3.4, 3.4],  [0, 3.4],  [3.4, 3.4],
      ].map(([x, z], i) => (
        <mesh key={`hole-${i}`} position={[x, 0.065, z]}>
          <ringGeometry args={[0.08, 0.22, 16]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.3} metalness={0.9} />
        </mesh>
      ))}

      {/* 3. AM5 LGA CPU Socket Assembly (Center-Upper Left) */}
      <group position={[-0.8, 0.12, -1.0]}>
        {/* Socket Outer Plastic Housing */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.5, 0.14, 2.5]} />
          <meshStandardMaterial color="#0F172A" roughness={0.7} />
        </mesh>
        {/* Metal Retention Frame */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[2.3, 0.06, 2.3]} />
          <meshStandardMaterial color="#64748B" roughness={0.25} metalness={0.85} />
        </mesh>
        {/* Central LGA Pin Bed (Gold pad array) */}
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[1.7, 0.04, 1.7]} />
          <meshStandardMaterial color="#EAB308" roughness={0.2} metalness={0.95} />
        </mesh>
        {/* Retention Lever Arm */}
        <mesh position={[1.25, 0.12, 0]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
          <meshStandardMaterial color="#94A3B8" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* 4. Quad DDR5 Memory Slots (Right of CPU Socket) */}
      <group position={[1.8, 0.12, -0.9]}>
        {[-0.6, -0.2, 0.2, 0.6].map((xOffset, slotIdx) => (
          <group key={`dimm-${slotIdx}`} position={[xOffset, 0, 0]}>
            {/* Slot Plastic Body */}
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.22, 3.6]} />
              <meshStandardMaterial
                color={slotIdx % 2 === 0 ? '#1E293B' : '#0F172A'}
                roughness={0.6}
              />
            </mesh>
            {/* Top Latch Clips */}
            {[-1.85, 1.85].map((zClip, cIdx) => (
              <mesh key={`clip-${cIdx}`} position={[0, 0.1, zClip]}>
                <boxGeometry args={[0.18, 0.28, 0.16]} />
                <meshStandardMaterial color="#94A3B8" roughness={0.4} metalness={0.5} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* 5. Primary PCIe 4.0 x16 Graphics Slot (Steel-Reinforced Shield) */}
      <group position={[-0.8, 0.14, 1.0]}>
        <mesh castShadow>
          <boxGeometry args={[3.8, 0.24, 0.28]} />
          <meshStandardMaterial color="#CBD5E1" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Slot Inner Pin Channel */}
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[3.6, 0.02, 0.08]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
        {/* Retention Latch Tab on Right End */}
        <mesh position={[1.95, 0.08, 0]}>
          <boxGeometry args={[0.25, 0.22, 0.24]} />
          <meshStandardMaterial color="#475569" roughness={0.5} />
        </mesh>
      </group>

      {/* Secondary PCIe Slots */}
      <group position={[-0.8, 0.12, 2.5]}>
        <mesh castShadow>
          <boxGeometry args={[3.8, 0.2, 0.24]} />
          <meshStandardMaterial color="#1E293B" roughness={0.6} />
        </mesh>
      </group>

      {/* 6. Dual M.2 NVMe Shield Heatsinks */}
      {/* Top M.2 (above primary PCIe) */}
      <mesh position={[-0.8, 0.15, 0.4]} castShadow>
        <boxGeometry args={[2.5, 0.18, 0.7]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Lower M.2 (between PCIe slots) */}
      <mesh position={[-0.8, 0.15, 1.8]} castShadow>
        <boxGeometry args={[2.5, 0.18, 0.7]} />
        <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 7. Heavy VRM Power Delivery Heatsinks (Top & Left of CPU) */}
      {/* Left VRM Heatsink block */}
      <mesh position={[-2.6, 0.55, -1.0]} castShadow>
        <boxGeometry args={[0.9, 0.9, 2.8]} />
        <meshStandardMaterial color="#1E293B" roughness={0.35} metalness={0.8} />
      </mesh>
      {/* Top VRM Heatsink block */}
      <mesh position={[-0.8, 0.55, -2.8]} castShadow>
        <boxGeometry args={[2.7, 0.9, 0.9]} />
        <meshStandardMaterial color="#1E293B" roughness={0.35} metalness={0.8} />
      </mesh>

      {/* 8. Rear I/O Integrated Shield Block (Back-Left edge) */}
      <mesh position={[-3.4, 0.7, -1.5]} castShadow>
        <boxGeometry args={[0.8, 1.2, 3.8]} />
        <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Gold Wi-Fi Antenna SMA Connector Posts */}
      {[-3.0, -2.6].map((z, idx) => (
        <mesh key={`wifi-${idx}`} position={[-3.85, 0.8, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.35, 12]} />
          <meshStandardMaterial color="#EAB308" roughness={0.2} metalness={0.95} />
        </mesh>
      ))}

      {/* 9. Chipset Heatsink (Bottom Right) */}
      <mesh position={[2.0, 0.3, 2.2]} castShadow>
        <boxGeometry args={[1.8, 0.45, 1.8]} />
        <meshStandardMaterial color="#273244" roughness={0.3} metalness={0.75} />
      </mesh>
      {/* Chipset Logo Accent Line */}
      <mesh position={[2.0, 0.53, 2.2]}>
        <boxGeometry args={[1.2, 0.02, 0.08]} />
        <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.8} />
      </mesh>

      {/* 10. Main 24-Pin ATX Power Header Socket (Right edge) */}
      <mesh position={[3.45, 0.28, -0.8]} castShadow>
        <boxGeometry args={[0.4, 0.45, 1.6]} />
        <meshStandardMaterial color="#0B0F17" roughness={0.7} />
      </mesh>

      {/* 11. Dual 8-Pin EPS CPU 12V Power Headers (Top left edge) */}
      <mesh position={[-2.4, 0.28, -3.45]} castShadow>
        <boxGeometry args={[1.1, 0.45, 0.4]} />
        <meshStandardMaterial color="#0B0F17" roughness={0.7} />
      </mesh>

      {/* 12. Solid Capacitor Bank (Array of silver cylinders) */}
      {[-2.0, -1.7, -1.4, -1.1].map((z, idx) => (
        <mesh key={`vrm-cap-${idx}`} position={[-2.0, 0.3, z]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.4, 16]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.85} />
        </mesh>
      ))}
      {/* Gold Audio Electrolytic Capacitors (Bottom left) */}
      {[-3.0, -2.6, -2.2].map((z, idx) => (
        <mesh key={`audio-cap-${idx}`} position={[-3.0, 0.22, 2.8 + z * 0.2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.3, 16]} />
          <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      </group>
    </group>
  );
};
