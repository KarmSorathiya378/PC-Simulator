import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

export interface Scene3DProps {
  children?: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  enableOrbit?: boolean;
  enableDamping?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  showShadows?: boolean;
  background?: string;
  className?: string;
}

/**
 * Production-ready Scene3D wrapper.
 * Features an expertly tuned 3-point studio lighting rig, soft contact shadows,
 * smooth OrbitControls, and ACESFilmic tone mapping for photorealistic PC hardware visuals.
 */
export const Scene3D: React.FC<Scene3DProps> = ({
  children,
  cameraPosition = [5, 4, 7],
  fov = 42,
  enableOrbit = true,
  enableDamping = true,
  autoRotate = false,
  autoRotateSpeed = 1.0,
  showShadows = true,
  background = 'transparent',
  className = 'w-full h-full min-h-[380px]',
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          alpha: true,
        }}
        style={{ background }}
      >
        <Suspense fallback={null}>
          {/* Studio Lighting Rig */}
          {/* 1. Neutral Ambient Foundation */}
          <ambientLight intensity={0.4} />

          {/* 2. Key Light (Crisp directional spotlight for highlights and cast shadows) */}
          <directionalLight
            position={[6, 8, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
          />

          {/* 3. Fill Light (Soft cool diffuse from opposite quadrant) */}
          <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#93C5FD" />

          {/* 4. Top Rim/Accent Light (Brings out brushed metal and gold chamfers) */}
          <directionalLight position={[0, 7, -5]} intensity={0.8} color="#E0F2FE" />

          {/* 5. Subtle Bottom Bounce Light */}
          <directionalLight position={[0, -4, 0]} intensity={0.2} color="#475569" />

          {/* Content */}
          <group position={[0, 0, 0]}>{children}</group>

          {/* Soft Ground Contact Shadow Plane */}
          {showShadows && (
            <ContactShadows
              position={[0, -2.1, 0]}
              opacity={0.65}
              scale={14}
              blur={2.4}
              far={5}
              resolution={512}
              color="#090D14"
            />
          )}

          {/* Smooth Orbit Navigation */}
          {enableOrbit && (
            <OrbitControls
              enableDamping={enableDamping}
              dampingFactor={0.06}
              autoRotate={autoRotate}
              autoRotateSpeed={autoRotateSpeed}
              maxPolarAngle={Math.PI / 2 + 0.15}
              minDistance={2}
              maxDistance={25}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
