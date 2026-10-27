import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGoldFingerTexture } from '../materials/proceduralTextures';

interface Gpu3DProps {
  wireframe?: boolean;
  animated?: boolean;
}

export const Gpu3D: React.FC<Gpu3DProps> = ({
  wireframe = false,
  animated = true,
}) => {
  const fan1Ref = useRef<THREE.Group>(null);
  const fan2Ref = useRef<THREE.Group>(null);
  const goldTexture = useMemo(() => createGoldFingerTexture(), []);

  // Smooth continuous fan blade rotation
  useFrame((_, delta) => {
    if (animated) {
      if (fan1Ref.current) fan1Ref.current.rotation.z -= delta * 4;
      if (fan2Ref.current) fan2Ref.current.rotation.z -= delta * 4;
    }
  });

  return (
    <group dispose={null}>
      {/* Centered at origin [0, 0, 0] across PCIe bracket, PCIe fingers, and cooling fans */}
      <group position={[0.045, -0.13, -0.425]}>
        {/* 1. Main Graphics Card PCB (Black matte composite board) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.2, 2.6, 0.08]} />
        <meshStandardMaterial
          color="#0F172A"
          roughness={0.6}
          metalness={0.1}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. PCIe x16 Bottom Gold Contact Strip */}
      <mesh position={[-1.6, -1.45, 0.045]}>
        <planeGeometry args={[3.2, 0.28]} />
        <meshStandardMaterial
          map={goldTexture}
          roughness={0.15}
          metalness={0.95}
          wireframe={wireframe}
        />
      </mesh>
      <mesh position={[-1.6, -1.45, -0.045]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[3.2, 0.28]} />
        <meshStandardMaterial
          map={goldTexture}
          roughness={0.15}
          metalness={0.95}
          wireframe={wireframe}
        />
      </mesh>

      {/* 3. Matte Metal Backplate on Rear */}
      <mesh position={[0, 0, -0.08]} receiveShadow>
        <boxGeometry args={[7.15, 2.55, 0.06]} />
        <meshStandardMaterial
          color="#1E293B"
          roughness={0.35}
          metalness={0.75}
          wireframe={wireframe}
        />
      </mesh>

      {/* Backplate Flow-Through Ventilation Cutouts */}
      {[2.2, 2.7, 3.2].map((x) => (
        <mesh key={`flow-${x}`} position={[x, 0.4, -0.05]}>
          <boxGeometry args={[0.25, 1.2, 0.09]} />
          <meshStandardMaterial color="#0B0F17" roughness={0.9} />
        </mesh>
      ))}

      {/* 4. Dense Aluminum Heatsink Fin Array (Inside shroud) */}
      <mesh position={[0.2, 0, 0.4]} castShadow>
        <boxGeometry args={[6.6, 2.3, 0.65]} />
        <meshStandardMaterial
          color="#94A3B8"
          roughness={0.3}
          metalness={0.85}
          wireframe={wireframe}
        />
      </mesh>

      {/* Copper Heatpipes protruding across fin stack */}
      {[-0.5, 0.5].map((y) => (
        <mesh key={`heatpipe-${y}`} position={[0.2, y, 0.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 6.7, 12]} />
          <meshStandardMaterial color="#B45309" roughness={0.25} metalness={0.9} />
        </mesh>
      ))}

      {/* 5. Sculpted Aerodynamic Fan Shroud (Gunmetal & Obsidian) */}
      <mesh position={[0.2, 0, 0.8]} castShadow>
        <boxGeometry args={[6.8, 2.5, 0.25]} />
        <meshStandardMaterial
          color="#18202C"
          roughness={0.4}
          metalness={0.6}
          wireframe={wireframe}
        />
      </mesh>

      {/* 6. Dual Axial Cooling Fans */}
      {[-1.35, 1.75].map((centerX, fanIdx) => (
        <group key={`fan-group-${fanIdx}`} position={[centerX, 0, 0.85]}>
          {/* Fan Intake Duct Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.05, 0.08, 12, 32]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
          </mesh>

          {/* Rotating Blades and Hub */}
          <group ref={fanIdx === 0 ? fan1Ref : fan2Ref}>
            {/* Center Motor Hub */}
            <mesh position={[0, 0, 0.02]}>
              <cylinderGeometry args={[0.38, 0.38, 0.15, 24]} />
              <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.8} />
            </mesh>
            {/* Metallic Center Badge */}
            <mesh position={[0, 0, 0.1]}>
              <cylinderGeometry args={[0.28, 0.28, 0.02, 24]} />
              <meshStandardMaterial
                color="#6366F1"
                emissive="#4338CA"
                emissiveIntensity={0.4}
                roughness={0.2}
                metalness={0.9}
              />
            </mesh>

            {/* 9 Swept Aerodynamic Fan Blades */}
            {Array.from({ length: 9 }).map((_, bladeIdx) => {
              const angle = (Math.PI * 2 * bladeIdx) / 9;
              return (
                <mesh
                  key={`blade-${bladeIdx}`}
                  position={[
                    Math.cos(angle) * 0.65,
                    Math.sin(angle) * 0.65,
                    0,
                  ]}
                  rotation={[0.3, 0.2, angle]}
                  castShadow
                >
                  <boxGeometry args={[0.65, 0.22, 0.03]} />
                  <meshStandardMaterial
                    color="#1E293B"
                    roughness={0.35}
                    metalness={0.4}
                    wireframe={wireframe}
                  />
                </mesh>
              );
            })}
          </group>
        </group>
      ))}

      {/* 7. Chrome / Nickel Rear I/O Expansion Bracket (Dual-Slot) */}
      <group position={[-3.65, 0.1, 0.35]}>
        {/* Main Vertical Bracket */}
        <mesh castShadow>
          <boxGeometry args={[0.08, 3.2, 0.9]} />
          <meshStandardMaterial
            color="#E2E8F0"
            roughness={0.2}
            metalness={0.95}
            wireframe={wireframe}
          />
        </mesh>
        {/* Top Screw Retention Tab */}
        <mesh position={[0, 1.65, 0.2]}>
          <boxGeometry args={[0.08, 0.2, 0.3]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.2} metalness={0.95} />
        </mesh>
        {/* DisplayPort and HDMI cutouts */}
        {[-0.2, 0.2].map((z, idx) => (
          <mesh key={`port-${idx}`} position={[-0.05, -0.4, z]}>
            <boxGeometry args={[0.04, 0.35, 0.2]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* 8. Top 12VHPWR / 8-Pin Power Connector Header */}
      <mesh position={[2.6, 1.35, 0.4]} castShadow>
        <boxGeometry args={[0.8, 0.35, 0.4]} />
        <meshStandardMaterial color="#0A0E17" roughness={0.7} />
      </mesh>
      {/* Gold terminal pins inside socket */}
      <mesh position={[2.6, 1.54, 0.4]}>
        <boxGeometry args={[0.65, 0.04, 0.25]} />
        <meshStandardMaterial color="#EAB308" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* 9. Glowing Edge Logo / Accent LED Bar */}
      <mesh position={[0, 1.28, 0.75]}>
        <boxGeometry args={[3.0, 0.08, 0.06]} />
        <meshStandardMaterial
          color="#A855F7"
          emissive="#9333EA"
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>
      </group>
    </group>
  );
};
