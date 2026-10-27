import React, { useMemo } from 'react';
import * as THREE from 'three';

interface Cable3DProps {
  wireframe?: boolean;
}

export const Cable3D: React.FC<Cable3DProps> = ({ wireframe = false }) => {
  // Generate smooth 3D spline curves for 24 individual sleeved cable strands (2 rows x 12 columns)
  const cableCurves = useMemo(() => {
    const curves: { curve: THREE.CatmullRomCurve3; color: string }[] = [];
    const cols = 12;
    const rows = 2;
    const spacingX = 0.22;
    const spacingY = 0.22;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const startX = (c - (cols - 1) / 2) * spacingX;
        const startY = (r - (rows - 1) / 2) * spacingY;

        // Graceful S-curve arching down into the chassis basement
        const points = [
          new THREE.Vector3(startX, startY, 2.2),
          new THREE.Vector3(startX * 1.05, startY + 0.3, 1.2),
          new THREE.Vector3(startX * 1.1, startY - 0.4, 0.0),
          new THREE.Vector3(startX * 1.0, startY - 1.2, -1.2),
          new THREE.Vector3(startX * 0.9, startY - 1.8, -2.4),
        ];

        const isAccent = (c % 3 === 0);
        curves.push({
          curve: new THREE.CatmullRomCurve3(points),
          color: isAccent ? '#38BDF8' : c % 2 === 0 ? '#1E293B' : '#0F172A',
        });
      }
    }
    return curves;
  }, []);

  return (
    <group dispose={null}>
      {/* 1. Molded 24-Pin ATX Connector Terminal Block (Upper Header) */}
      <group position={[0, 0, 2.3]}>
        <mesh castShadow>
          <boxGeometry args={[2.8, 0.65, 0.6]} />
          <meshStandardMaterial
            color="#05080F"
            roughness={0.7}
            metalness={0.2}
            wireframe={wireframe}
          />
        </mesh>
        {/* Retention Snap Latch on Top */}
        <mesh position={[0, 0.36, 0]}>
          <boxGeometry args={[0.7, 0.14, 0.35]} />
          <meshStandardMaterial color="#0B0F17" roughness={0.8} />
        </mesh>
        {/* Gold Terminal Pins in Connector Sockets */}
        <mesh position={[0, 0, 0.31]}>
          <boxGeometry args={[2.5, 0.45, 0.02]} />
          <meshStandardMaterial color="#EAB308" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* 2. Individually Sleeved Braided Cable Strands */}
      {cableCurves.map((cable, idx) => (
        <mesh key={`strand-${idx}`} castShadow>
          <tubeGeometry args={[cable.curve, 32, 0.075, 8, false]} />
          <meshStandardMaterial
            color={cable.color}
            roughness={0.65}
            metalness={0.15}
            wireframe={wireframe}
          />
        </mesh>
      ))}

      {/* 3. Smoked Acrylic Cable Comb Organizers (Maintains parallel alignment) */}
      {[0.8, -0.6].map((zPos, cIdx) => (
        <mesh key={`comb-${cIdx}`} position={[0, (cIdx === 0 ? 0.05 : -0.75), zPos]} castShadow>
          <boxGeometry args={[2.9, 0.68, 0.12]} />
          <meshStandardMaterial
            color="#0284C7"
            emissive="#0369A1"
            emissiveIntensity={0.25}
            roughness={0.2}
            transparent
            opacity={0.8}
            wireframe={wireframe}
          />
        </mesh>
      ))}
    </group>
  );
};
