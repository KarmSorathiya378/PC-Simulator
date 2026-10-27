import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  createPcbTexture,
  createCpuIhsTexture,
  createGoldFingerTexture,
  createHoneycombTexture,
  createRamHeatsinkTexture,
} from './materials/proceduralTextures';
import { Part3D } from './Part3D';
import { Scene3D } from './Scene3D';
import { Hardware3DPreview } from './Hardware3DPreview';
import { Case3D } from './parts/Case3D';
import { Ssd3D } from './parts/Ssd3D';

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
});
