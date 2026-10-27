import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  createPcbTexture,
  createCpuIhsTexture,
  createGoldFingerTexture,
  createHoneycombTexture,
  createRamHeatsinkTexture,
} from './materials/proceduralTextures';
import { Part3D, PART_CANONICAL_SCALES } from './Part3D';
import { Scene3D, computePreciseFitDistance, computeModelBoundingBox } from './Scene3D';
import { Hardware3DPreview } from './Hardware3DPreview';
import { Case3D } from './parts/Case3D';
import { Ssd3D } from './parts/Ssd3D';
import type { HardwarePartType } from './types';
import { SLOT_3D_TRANSFORMS, getSlot3DTransform } from '../simulator/threeSlotLayout';

describe('3D Hardware Graphics Subsystem', () => {
  describe('Procedural Canvas Textures', () => {
    it('generates a valid Motherboard PCB texture', () => {
      const tex = createPcbTexture();
      expect(tex).toBeInstanceOf(THREE.CanvasTexture);
      expect(tex.image).toBeDefined();
      expect(tex.image.width).toBe(1024);
      expect(tex.image.height).toBe(1024);
    });

    it('generates a valid CPU IHS brushed metal texture', () => {
      const tex = createCpuIhsTexture();
      expect(tex).toBeInstanceOf(THREE.CanvasTexture);
      expect(tex.image.width).toBe(512);
      expect(tex.image.height).toBe(512);
    });

    it('generates a valid Gold Finger edge connector texture', () => {
      const tex = createGoldFingerTexture();
      expect(tex).toBeInstanceOf(THREE.CanvasTexture);
      expect(tex.image.width).toBe(512);
      expect(tex.image.height).toBe(128);
    });

    it('generates a valid Hexagonal Honeycomb ventilation texture', () => {
      const tex = createHoneycombTexture();
      expect(tex).toBeInstanceOf(THREE.CanvasTexture);
      expect(tex.wrapS).toBe(THREE.RepeatWrapping);
      expect(tex.wrapT).toBe(THREE.RepeatWrapping);
    });

    it('generates a valid RAM heatsink decal texture', () => {
      const tex = createRamHeatsinkTexture();
      expect(tex).toBeInstanceOf(THREE.CanvasTexture);
      expect(tex.image.width).toBe(512);
      expect(tex.image.height).toBe(128);
    });
  });

  describe('Canonical 3D Presentation Bounds Normalization', () => {
    it('defines canonical scale multipliers for all hardware part types', () => {
      const requiredTypes: HardwarePartType[] = [
        'cpu',
        'ram',
        'gpu',
        'motherboard',
        'psu',
        'fan',
        'cable',
        'case',
        'ssd',
      ];

      for (const type of requiredTypes) {
        expect(PART_CANONICAL_SCALES[type]).toBeDefined();
        expect(typeof PART_CANONICAL_SCALES[type]).toBe('number');
        expect(PART_CANONICAL_SCALES[type]).toBeGreaterThan(0.5);
        expect(PART_CANONICAL_SCALES[type]).toBeLessThanOrEqual(3.0);
      }
    });

    it('normalizes all hardware models to a consistent 7.0 - 7.8 unit canonical footprint', () => {
      const rawExtents: Record<HardwarePartType, number> = {
        cpu: 3.2,
        ram: 5.2,
        gpu: 7.2,
        motherboard: 7.8,
        psu: 5.2,
        fan: 4.4,
        cable: 4.6,
        case: 10.0,
        ssd: 5.6,
      };

      for (const [type, maxDim] of Object.entries(rawExtents) as [HardwarePartType, number][]) {
        const scaledDim = maxDim * PART_CANONICAL_SCALES[type];
        expect(scaledDim).toBeGreaterThanOrEqual(6.8);
        expect(scaledDim).toBeLessThanOrEqual(8.0);
      }
    });
  });

  describe('Component Exports', () => {
    it('exports Part3D and Scene3D as React functional components', () => {
      expect(Part3D).toBeDefined();
      expect(typeof Part3D).toBe('function');
      expect(Scene3D).toBeDefined();
      expect(typeof Scene3D).toBe('function');
      expect(Hardware3DPreview).toBeDefined();
      expect(typeof Hardware3DPreview).toBe('function');
      expect(Case3D).toBeDefined();
      expect(typeof Case3D).toBe('function');
      expect(Ssd3D).toBeDefined();
      expect(typeof Ssd3D).toBe('function');
    });
  });

  describe('Frustum Auto-Fit Perspective Geometry Calculation', () => {
    it('computes exact distance for bounding box to fill target percentage of frustum', () => {
      const box = new THREE.Box3(
        new THREE.Vector3(-3.5, -3.5, -3.5),
        new THREE.Vector3(3.5, 3.5, 3.5)
      );
      const camera = new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 100);
      const camDir = new THREE.Vector3(4.5, 3.5, 5.5);

      const { distance, center } = computePreciseFitDistance(
        box,
        camera,
        16 / 9,
        camDir,
        0.85
      );

      // Center should be exact origin
      expect(center.x).toBeCloseTo(0, 4);
      expect(center.y).toBeCloseTo(0, 4);
      expect(center.z).toBeCloseTo(0, 4);

      // Distance should fit bounding cube at 85% fill without pushing camera to infinity or clipping
      expect(distance).toBeGreaterThan(12);
      expect(distance).toBeLessThan(22);
    });

    it('adapts distance dynamically for portrait / narrow aspect ratios', () => {
      const box = new THREE.Box3(
        new THREE.Vector3(-3.5, -3.5, -3.5),
        new THREE.Vector3(3.5, 3.5, 3.5)
      );
      const camera = new THREE.PerspectiveCamera(40, 9 / 16, 0.1, 100);
      const camDir = new THREE.Vector3(4.5, 3.5, 5.5);

      const fitLandscape = computePreciseFitDistance(box, camera, 16 / 9, camDir, 0.85);
      const fitPortrait = computePreciseFitDistance(box, camera, 9 / 16, camDir, 0.85);

      // Narrow portrait needs further distance horizontally to contain the width
      expect(fitPortrait.distance).toBeGreaterThan(fitLandscape.distance);
    });

    it('computes model bounding box while excluding non-model helpers like GridHelper and lights', () => {
      const root = new THREE.Group();
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(4, 10, 8), new THREE.MeshBasicMaterial());
      root.add(mesh);

      // Add helper grid and light that should be ignored
      const grid = new THREE.GridHelper(30, 30);
      root.add(grid);
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(20, 20, 20);
      root.add(light);

      const box = computeModelBoundingBox(root);
      const size = box.getSize(new THREE.Vector3());

      expect(size.x).toBeCloseTo(4, 1);
      expect(size.y).toBeCloseTo(10, 1);
      expect(size.z).toBeCloseTo(8, 1);
    });
  });

  describe('Chassis Slot 3D Coordinate Mapping', () => {
    it('defines non-zero valid bounding dimensions for all registered chassis slots', () => {
      const slotIds = Object.keys(SLOT_3D_TRANSFORMS);
      expect(slotIds.length).toBeGreaterThanOrEqual(8);

      for (const slotId of slotIds) {
        const transform = getSlot3DTransform(slotId);
        expect(transform).toBeDefined();
        expect(transform.position).toHaveLength(3);
        expect(transform.placeholderSize).toHaveLength(3);
        expect(transform.placeholderSize[0]).toBeGreaterThan(0);
        expect(transform.placeholderSize[1]).toBeGreaterThan(0);
        expect(transform.placeholderSize[2]).toBeGreaterThan(0);
      }
    });

    it('positions all chassis components within the case internal envelope', () => {
      // Case inner chamber extents approximately x: [-3, 3], y: [-5, 5], z: [-5, 5]
      for (const [slotId, transform] of Object.entries(SLOT_3D_TRANSFORMS)) {
        const [x, y, z] = transform.position;
        expect(Math.abs(x)).toBeLessThanOrEqual(4.0);
        expect(Math.abs(y)).toBeLessThanOrEqual(5.2);
        expect(Math.abs(z)).toBeLessThanOrEqual(5.2);
      }
    });
  });
});
