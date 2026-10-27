import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Center } from '@react-three/drei';
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
  /** Automatically frame camera so model fills 80-90% of viewport without clipping. Defaults to true */
  autoFit?: boolean;
  /** Viewport fill percentage target between 0.5 and 0.95. Defaults to 0.85 (85%) */
  targetFill?: number;
  /** Automatically center model bounding box at [0, 0, 0]. Defaults to true */
  autoCenter?: boolean;
  minDistance?: number;
  maxDistance?: number;
}

interface CameraAutoFramerProps {
  targetFill: number;
  enabled: boolean;
  initialCameraPos: [number, number, number];
  contentGroupRef: React.RefObject<THREE.Group | null>;
  containerSize?: { width: number; height: number };
  onBoundsComputed?: (box: THREE.Box3, size: THREE.Vector3, center: THREE.Vector3) => void;
}

/**
 * Computes the accurate bounding box of hardware meshes within a scene hierarchy,
 * explicitly excluding non-hardware helper objects (gridHelper, lights, shadows).
 */
export function computeModelBoundingBox(root: THREE.Object3D): THREE.Box3 {
  root.updateWorldMatrix(true, true);
  const box = new THREE.Box3();

  root.traverse((obj: THREE.Object3D) => {
    // Exclude helper objects, lights, floor grids, and contact shadows
    if (
      obj.userData?.isHelper ||
      obj.type === 'GridHelper' ||
      obj.type === 'AmbientLight' ||
      obj.type === 'DirectionalLight' ||
      obj.type === 'PointLight' ||
      obj.type === 'HemisphereLight'
    ) {
      return;
    }

    // Only compute bounding box for visible hardware meshes
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh && mesh.geometry && mesh.visible !== false) {
      if (!mesh.geometry.boundingBox) {
        mesh.geometry.computeBoundingBox();
      }
      if (mesh.geometry.boundingBox) {
        const meshBox = mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);
        box.union(meshBox);
      }
    }
  });

  // Fallback to standard setFromObject if traverse did not identify mesh geometries
  if (box.isEmpty()) {
    box.setFromObject(root);
  }

  return box;
}

/**
 * Calculates the exact perspective camera distance required so all 8 corners
 * of a 3D bounding box fit within the viewport frustum at targetFill percentage.
 */
export function computePreciseFitDistance(
  box: THREE.Box3,
  camera: THREE.PerspectiveCamera,
  aspect: number,
  dir: THREE.Vector3,
  targetFill: number
): { distance: number; center: THREE.Vector3 } {
  const center = box.getCenter(new THREE.Vector3());
  const vFovHalf = (camera.fov * Math.PI) / 360; // Half vertical FOV in radians
  const hFovHalf = Math.atan(Math.tan(vFovHalf) * aspect); // Half horizontal FOV in radians

  const fill = Math.min(Math.max(targetFill, 0.5), 0.95);
  const tanV = Math.tan(vFovHalf) * fill;
  const tanH = Math.tan(hFovHalf) * fill;

  // View matrix looking from camera direction towards center
  const camDir = dir.clone().normalize();
  if (camDir.lengthSq() === 0) {
    camDir.set(1.2, 0.8, 1.4).normalize();
  }
  const up = new THREE.Vector3(0, 1, 0);
  if (Math.abs(camDir.dot(up)) > 0.96) {
    up.set(0, 0, 1);
  }
  const viewMatrix = new THREE.Matrix4().lookAt(camDir, new THREE.Vector3(0, 0, 0), up);
  const viewRot = new THREE.Matrix4().extractRotation(viewMatrix);

  // 8 bounding box corners relative to center
  const corners = [
    new THREE.Vector3(box.min.x - center.x, box.min.y - center.y, box.min.z - center.z),
    new THREE.Vector3(box.min.x - center.x, box.min.y - center.y, box.max.z - center.z),
    new THREE.Vector3(box.min.x - center.x, box.max.y - center.y, box.min.z - center.z),
    new THREE.Vector3(box.min.x - center.x, box.max.y - center.y, box.max.z - center.z),
    new THREE.Vector3(box.max.x - center.x, box.min.y - center.y, box.min.z - center.z),
    new THREE.Vector3(box.max.x - center.x, box.min.y - center.y, box.max.z - center.z),
    new THREE.Vector3(box.max.x - center.x, box.max.y - center.y, box.min.z - center.z),
    new THREE.Vector3(box.max.x - center.x, box.max.y - center.y, box.max.z - center.z),
  ];

  let reqDist = 0;
  for (const c of corners) {
    const cv = c.clone().applyMatrix4(viewRot);
    // In camera view space: x is right, y is up, z is forward (away from camera)
    // For this point to fit in frustum:
    // dist >= |cv.x| / tanH + cv.z  AND  dist >= |cv.y| / tanV + cv.z
    const dH = Math.abs(cv.x) / tanH + cv.z;
    const dV = Math.abs(cv.y) / tanV + cv.z;
    reqDist = Math.max(reqDist, dH, dV);
  }

  return { distance: Math.max(reqDist, 1.5), center };
}

/**
 * Responsive Camera Framing Controller.
 * Computes exact model bounding box and positions the camera and OrbitControls
 * so the geometry occupies 85-90% of the viewport on both mobile and desktop.
 */
const CameraAutoFramer: React.FC<CameraAutoFramerProps> = ({
  targetFill,
  enabled,
  initialCameraPos,
  contentGroupRef,
  containerSize,
  onBoundsComputed,
}) => {
  const { camera, size } = useThree();
  const controls = useThree((state) => state.controls) as any;
  const frameCountRef = useRef(0);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    if (!controls) return;
    const onStart = () => {
      userInteractedRef.current = true;
    };
    controls.addEventListener('start', onStart);
    return () => {
      controls.removeEventListener('start', onStart);
    };
  }, [controls]);

  // Multi-frame verification to catch delayed procedural geometries
  useFrame(() => {
    if (!enabled || !contentGroupRef.current) return;

    if (frameCountRef.current < 4) {
      frameCountRef.current += 1;
      frameCamera(false);
    }
  });

  const frameCamera = (forceResetDirection = false) => {
    if (!contentGroupRef.current) return;

    const box = computeModelBoundingBox(contentGroupRef.current);
    if (box.isEmpty()) return;

    const boxSize = box.getSize(new THREE.Vector3());
    const persCam = camera as THREE.PerspectiveCamera;
    const canvasWidth = containerSize && containerSize.width > 0 ? containerSize.width : size.width;
    const canvasHeight = containerSize && containerSize.height > 0 ? containerSize.height : size.height;
    const aspect = Math.max(canvasWidth, 1) / Math.max(canvasHeight, 1);

    // If user has already rotated and we are just adjusting distance for resize, preserve viewing angle
    let dir: THREE.Vector3;
    if (!forceResetDirection && userInteractedRef.current && controls && controls.target) {
      const currentDir = persCam.position.clone().sub(controls.target);
      dir = currentDir.lengthSq() > 0.01 ? currentDir.normalize() : new THREE.Vector3(...initialCameraPos).normalize();
    } else {
      dir = new THREE.Vector3(...initialCameraPos).normalize();
      if (dir.lengthSq() === 0) {
        dir.set(5.5, 4.0, 7.0).normalize();
      }
    }

    const { distance, center } = computePreciseFitDistance(
      box,
      persCam,
      aspect,
      dir,
      targetFill
    );

    onBoundsComputed?.(box, boxSize, center);

    persCam.position.copy(center).addScaledVector(dir, distance);
    persCam.lookAt(center);
    persCam.updateProjectionMatrix();

    if (controls && controls.target) {
      controls.target.copy(center);
      controls.minDistance = Math.max(distance * 0.25, 1.2);
      controls.maxDistance = Math.max(distance * 3.5, 30);
      controls.update();
    }
  };

  useEffect(() => {
    frameCountRef.current = 0;
    frameCamera(false);
  }, [
    enabled,
    targetFill,
    size.width,
    size.height,
    containerSize?.width,
    containerSize?.height,
    camera,
    controls,
    initialCameraPos,
    contentGroupRef,
  ]);

  return null;
};

/**
 * Production-ready Scene3D wrapper with calibrated studio lighting and auto-framing.
 * Ensures every 3D model renders centered, correctly scaled, and comfortably fills 80-90%
 * of its container without clipping on mobile or desktop.
 */
export const Scene3D: React.FC<Scene3DProps> = ({
  children,
  cameraPosition = [5.5, 4.0, 7.0],
  fov = 38,
  enableOrbit = true,
  enableDamping = true,
  autoRotate = false,
  autoRotateSpeed = 1.0,
  showShadows = true,
  background = 'transparent',
  className = 'w-full h-full min-h-[380px]',
  autoFit = true,
  targetFill = 0.88,
  autoCenter = true,
  minDistance = 1.2,
  maxDistance = 60,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentGroupRef = useRef<THREE.Group>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [shadowY, setShadowY] = useState<number>(-2.1);
  const [shadowScale, setShadowScale] = useState<number>(14);

  // ResizeObserver ensures canvas re-fits dynamically on window resize, breakpoints, and container flex changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerSize({ width: Math.round(width), height: Math.round(height) });
        }
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleBoundsComputed = (
    box: THREE.Box3,
    size: THREE.Vector3,
    _center: THREE.Vector3
  ) => {
    setShadowY(box.min.y - 0.02);
    setShadowScale(Math.max(size.x, size.z) * 2.2);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        background: background !== 'transparent' ? background : undefined,
      }}
    >
      <Canvas
        shadows
        camera={{ position: cameraPosition, fov }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Calibrated Studio Lighting Rig */}
          <ambientLight intensity={0.55} />

          {/* Key Light */}
          <directionalLight
            position={[6, 10, 6]}
            intensity={1.4}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-bias={-0.0001}
            shadow-camera-near={0.5}
            shadow-camera-far={35}
          />

          {/* Cool Fill Light */}
          <directionalLight position={[-6, 4, -4]} intensity={0.7} color="#93C5FD" />

          {/* Warm Specular Rim */}
          <directionalLight position={[0, 8, -6]} intensity={0.9} color="#FEF3C7" />

          {/* Front Diffuse Fill */}
          <directionalLight position={[0, 2, 8]} intensity={0.4} color="#FFFFFF" />

          {/* Ground Bounce */}
          <directionalLight position={[0, -4, 2]} intensity={0.3} color="#64748B" />

          {/* Dynamic Content Group */}
          <group ref={contentGroupRef} position={[0, 0, 0]}>
            {autoCenter ? <Center>{children}</Center> : children}
          </group>

          {/* Smooth Damped Orbit Controls */}
          {enableOrbit && (
            <OrbitControls
              enableDamping={enableDamping}
              dampingFactor={0.06}
              autoRotate={autoRotate}
              autoRotateSpeed={autoRotateSpeed}
              maxPolarAngle={Math.PI / 2 + 0.12}
              minDistance={minDistance}
              maxDistance={maxDistance}
            />
          )}

          {/* Auto-Framing Controller */}
          {autoFit && (
            <CameraAutoFramer
              enabled={autoFit}
              targetFill={targetFill}
              initialCameraPos={cameraPosition}
              contentGroupRef={contentGroupRef}
              containerSize={containerSize}
              onBoundsComputed={handleBoundsComputed}
            />
          )}

          {/* Ground Contact Shadow */}
          {showShadows && (
            <ContactShadows
              position={[0, shadowY, 0]}
              opacity={0.65}
              scale={shadowScale}
              blur={2.4}
              far={6}
              resolution={512}
              color="#090D14"
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
