import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CaseFan3DProps {
  wireframe?: boolean;
  animated?: boolean;
}

export const CaseFan3D: React.FC<CaseFan3DProps> = ({
  wireframe = false,
  animated = true,
}) => {
  const rotorRef = useRef<THREE.Group>(null);

  // Smooth continuous blade spinning
  useFrame((_, delta) => {
    if (animated && rotorRef.current) {
      rotorRef.current.rotation.z -= delta * 6;
    }
  });

  return (
    <group dispose={null}>
      {/* 1. Square Outer Chassis Frame (120mm Form Factor) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 4.4, 0.9]} />
        <meshStandardMaterial
          color="#181F2A"
          roughness={0.5}
          metalness={0.4}
          wireframe={wireframe}
        />
      </mesh>

      {/* 2. Inner Circular Air Duct Tunnel (Subtractive visual cylinder) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.95, 1.95, 0.92, 36]} />
        <meshStandardMaterial color="#0E131C" roughness={0.7} />
      </mesh>

      {/* 3. Anti-Vibration Silicone Corner Dampers & Screw Mounting Holes */}
      {[
        [-1.85, -1.85],
        [1.85, -1.85],
        [-1.85, 1.85],
        [1.85, 1.85],
      ].map(([x, y], idx) => (
        <group key={`corner-${idx}`} position={[x, y, 0]}>
          {/* Rubber Corner Pad */}
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.65, 0.94]} />
            <meshStandardMaterial color="#334155" roughness={0.9} metalness={0.1} />
          </mesh>
          {/* Mounting Screw Pass-through Hole */}
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 0.96, 16]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 4. Rear Stator Airflow Straightener Struts (4 curved support arms) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
        <mesh
          key={`strut-${idx}`}
          position={[
            Math.cos(angle) * 1.0,
            Math.sin(angle) * 1.0,
            0.4,
          ]}
          rotation={[0, 0, angle]}
        >
          <boxGeometry args={[1.8, 0.14, 0.08]} />
          <meshStandardMaterial color="#1E293B" roughness={0.5} />
        </mesh>
      ))}

      {/* 5. Central Motor Housing Stator Core (Back side) */}
      <mesh position={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.7, 0.7, 0.15, 32]} />
        <meshStandardMaterial color="#0F172A" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* 6. Rotating Rotor Hub and 9 Swept Blades */}
      <group ref={rotorRef} position={[0, 0, 0.05]}>
        {/* Main Rotor Hub */}
        <mesh castShadow>
          <cylinderGeometry args={[0.72, 0.72, 0.5, 32]} />
          <meshStandardMaterial
            color="#1E293B"
            roughness={0.3}
            metalness={0.5}
            wireframe={wireframe}
          />
        </mesh>

        {/* Center Metallic Holographic Hub Badge */}
        <mesh position={[0, 0, -0.26]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.02, 24]} />
          <meshStandardMaterial
            color="#38BDF8"
            emissive="#0284C7"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        {/* 9 High-Static Pressure Aerodynamic Swept Blades */}
        {Array.from({ length: 9 }).map((_, bIdx) => {
          const angle = (Math.PI * 2 * bIdx) / 9;
          return (
            <mesh
              key={`blade-${bIdx}`}
              position={[
                Math.cos(angle) * 1.25,
                Math.sin(angle) * 1.25,
                0,
              ]}
              rotation={[0.35, 0.25, angle]}
              castShadow
            >
              <boxGeometry args={[1.15, 0.38, 0.05]} />
              <meshStandardMaterial
                color="#0F172A"
                roughness={0.35}
                metalness={0.4}
                wireframe={wireframe}
              />
            </mesh>
          );
        })}
      </group>

      {/* 7. Flat 4-Pin PWM Fan Ribbon Cable Extrusion (Corner exit) */}
      <group position={[1.9, -1.9, 0.42]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh>
          <boxGeometry args={[0.4, 0.08, 0.8]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};
