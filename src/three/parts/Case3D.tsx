import React, { useMemo } from 'react';
import { createHoneycombTexture } from '../materials/proceduralTextures';

interface Case3DProps {
  wireframe?: boolean;
}

export const Case3D: React.FC<Case3DProps> = ({ wireframe = false }) => {
  const honeycombTexture = useMemo(() => createHoneycombTexture(), []);

  return (
    <group dispose={null}>
      {/* 1. Main Outer Chassis Body (Steel outer frame) */}
      {/* Top Roof Panel */}
      <mesh position={[0, 5.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.2, 9.6]} />
        <meshStandardMaterial
          color="#181F2A"
          roughness={0.4}
          metalness={0.7}
          wireframe={wireframe}
        />
      </mesh>

      {/* Top Magnetic Mesh Dust Filter */}
      <mesh position={[0, 5.11, 0.2]} receiveShadow>
        <planeGeometry args={[3.8, 7.8]} />
        <meshStandardMaterial
          map={honeycombTexture}
          roughness={0.6}
          metalness={0.5}
          wireframe={wireframe}
        />
      </mesh>

      {/* Bottom Floor Panel */}
      <mesh position={[0, -5.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.8, 0.2, 9.6]} />
        <meshStandardMaterial
          color="#111827"
          roughness={0.5}
          metalness={0.7}
          wireframe={wireframe}
        />
      </mesh>

      {/* Solid Right Side Steel Panel */}
      <mesh position={[2.35, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 9.8, 9.4]} />
        <meshStandardMaterial
          color="#1E2530"
          roughness={0.4}
          metalness={0.65}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Tempered Glass Left Side Panel (Transparent / reflective) */}
      <mesh position={[-2.35, 0, 0]}>
        <boxGeometry args={[0.08, 9.8, 9.4]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.08}
          metalness={0.15}
          transparent
          opacity={0.38}
          wireframe={wireframe}
        />
      </mesh>

      {/* Glass Panel Corner Thumbscrews */}
      {[
        [-2.4, 4.6, 4.4],
        [-2.4, 4.6, -4.4],
        [-2.4, -4.6, 4.4],
        [-2.4, -4.6, -4.4],
      ].map(([x, y, z], idx) => (
        <mesh key={`screw-${idx}`} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          <meshStandardMaterial color="#64748B" roughness={0.3} metalness={0.85} />
        </mesh>
      ))}

      {/* 3. Front Intake Mesh & Bezel Panel */}
      <group position={[0, 0, 4.8]}>
        {/* Outer Front Bezel Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.8, 10.0, 0.25]} />
          <meshStandardMaterial
            color="#0F172A"
            roughness={0.45}
            metalness={0.5}
            wireframe={wireframe}
          />
        </mesh>

        {/* High-Airflow Honeycomb Mesh Inset */}
        <mesh position={[0, -0.4, 0.13]} receiveShadow>
          <planeGeometry args={[4.2, 8.4]} />
          <meshStandardMaterial
            map={honeycombTexture}
            roughness={0.5}
            metalness={0.6}
            wireframe={wireframe}
          />
        </mesh>

        {/* Front I/O Cluster (Top front edge) */}
        <group position={[0, 4.5, 0.14]}>
          {/* Power Button with LED Ring */}
          <mesh position={[-1.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 24]} />
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#0284C7"
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
          {/* USB 3.0 Type-A Ports */}
          {[-0.4, 0.2].map((x, i) => (
            <mesh key={`usb-${i}`} position={[x, 0, 0]}>
              <boxGeometry args={[0.24, 0.1, 0.03]} />
              <meshStandardMaterial color="#0284C7" roughness={0.4} />
            </mesh>
          ))}
          {/* USB Type-C Port */}
          <mesh position={[0.7, 0, 0]}>
            <boxGeometry args={[0.18, 0.06, 0.03]} />
            <meshStandardMaterial color="#CBD5E1" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Audio Jack */}
          <mesh position={[1.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 16]} />
            <meshStandardMaterial color="#64748B" roughness={0.3} metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* 4. Rear Panel: Exhaust Fan Aperture, I/O Opening, PCIe Slots, PSU Cutout */}
      <group position={[0, 0, -4.8]}>
        {/* Rear Sheet Metal */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.8, 10.0, 0.15]} />
          <meshStandardMaterial
            color="#1E2530"
            roughness={0.5}
            metalness={0.6}
            wireframe={wireframe}
          />
        </mesh>

        {/* 120mm Rear Exhaust Fan Aperture & Guard Grill */}
        <group position={[-0.8, 2.4, -0.09]}>
          <mesh>
            <circleGeometry args={[1.35, 32]} />
            <meshStandardMaterial color="#0B0F17" roughness={0.8} />
          </mesh>
          {/* Concentric Guard Rings */}
          {[0.4, 0.8, 1.2].map((r, i) => (
            <mesh key={`rear-ring-${i}`} position={[0, 0, -0.01]}>
              <ringGeometry args={[r, r + 0.04, 32]} />
              <meshStandardMaterial color="#64748B" roughness={0.3} metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* Motherboard Rear I/O Cutout */}
        <mesh position={[1.1, 2.4, -0.09]}>
          <planeGeometry args={[1.8, 3.2]} />
          <meshStandardMaterial color="#05080F" roughness={0.9} />
        </mesh>

        {/* 7x PCIe Expansion Slot Metal Brackets */}
        {[-0.2, -0.6, -1.0, -1.4, -1.8, -2.2, -2.6].map((y, idx) => (
          <group key={`pcie-slot-${idx}`} position={[-0.6, y, -0.09]}>
            <mesh>
              <boxGeometry args={[2.8, 0.28, 0.03]} />
              <meshStandardMaterial color="#334155" roughness={0.35} metalness={0.75} />
            </mesh>
            {/* Vented Cutout in Slot Cover */}
            <mesh position={[0, 0, -0.02]}>
              <boxGeometry args={[2.2, 0.1, 0.02]} />
              <meshStandardMaterial color="#0F172A" roughness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Lower PSU Mounting Cutout */}
        <mesh position={[0, -4.0, -0.09]}>
          <boxGeometry args={[3.6, 1.8, 0.05]} />
          <meshStandardMaterial color="#05080F" roughness={0.9} />
        </mesh>
      </group>

      {/* 5. Interior PSU Basement Shroud (Lower Chamber) */}
      <group position={[0, -3.1, 0]}>
        {/* Shroud Top Horizontal Deck */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.6, 0.12, 9.4]} />
          <meshStandardMaterial
            color="#181F2A"
            roughness={0.4}
            metalness={0.7}
            wireframe={wireframe}
          />
        </mesh>

        {/* Shroud Left Side Vertical Divider Facing Window */}
        <mesh position={[-2.25, -0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 1.7, 9.4]} />
          <meshStandardMaterial
            color="#1E2530"
            roughness={0.4}
            metalness={0.65}
            wireframe={wireframe}
          />
        </mesh>

        {/* Cable Routing Grommet Cutouts on Deck */}
        {[-1.8, 0, 1.8].map((z, i) => (
          <mesh key={`grommet-${i}`} position={[-0.6, 0.07, z]}>
            <boxGeometry args={[0.9, 0.02, 0.35]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* 6. Interior Motherboard Mounting Tray */}
      <group position={[0.8, 0.8, 0]}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 7.2, 8.8]} />
          <meshStandardMaterial
            color="#1A202C"
            roughness={0.5}
            metalness={0.6}
            wireframe={wireframe}
          />
        </mesh>

        {/* Large CPU Cooler Backplate Cutout Window */}
        <mesh position={[-0.05, 1.4, -0.6]}>
          <boxGeometry args={[0.05, 3.2, 3.4]} />
          <meshStandardMaterial color="#0B0F17" roughness={0.8} />
        </mesh>

        {/* Vertical Cable Passthrough Grommets */}
        {[-2.8, -0.8, 1.2].map((y, i) => (
          <mesh key={`vert-grommet-${i}`} position={[-0.05, y, 2.6]}>
            <boxGeometry args={[0.05, 1.2, 0.45]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* 7. Bottom Chassis Rubber Isolation Feet (4 Corners) */}
      {[
        [-1.8, -5.25, 3.8],
        [1.8, -5.25, 3.8],
        [-1.8, -5.25, -3.8],
        [1.8, -5.25, -3.8],
      ].map(([x, y, z], idx) => (
        <group key={`foot-${idx}`} position={[x, y, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.35, 0.4, 0.35, 16]} />
            <meshStandardMaterial color="#0F172A" roughness={0.7} metalness={0.3} />
          </mesh>
          <mesh position={[0, -0.15, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.08, 16]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
