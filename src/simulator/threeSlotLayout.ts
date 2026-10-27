import type { HardwarePartType } from '../three/types';
import type { Slot } from '../types';

export interface Slot3DTransform {
  /** 3D position [x, y, z] in the case world coordinate system */
  position: [number, number, number];
  /** 3D Euler rotation in radians [x, y, z] */
  rotation?: [number, number, number];
  /** Uniform or axis-specific scale */
  scale?: number | [number, number, number];
  /** Bounding box dimension for placeholders or outlines [width, height, depth] */
  placeholderSize: [number, number, number];
  /** Direction and distance offset [x, y, z] applied when exploded view is engaged */
  explodedOffset?: [number, number, number];
  /** Matching HardwarePartType for procedural 3D model rendering */
  partType: HardwarePartType;
}

/**
 * Hardcoded, coherent 3D coordinates and orientations for standard PC builder slots.
 * Coordinates are tuned to sit believably inside the Case3D chassis geometry:
 * - Motherboard mounted vertically on the right-hand chassis tray facing the glass window.
 * - CPU socket seated in the upper-left quadrant of the motherboard.
 * - Cooler heatsink mounted directly on the CPU substrate protruding outwards.
 * - RAM sticks standing upright perpendicular to the motherboard in the DIMM channels.
 * - M.2 NVMe SSD resting flush in the primary PCIe slot area.
 * - GPU expansion card slotted horizontally into the primary PCIe x16 slot.
 * - Modular ATX Power Supply Unit seated in the lower rear chamber/shroud.
 */
export const SLOT_3D_TRANSFORMS: Record<string, Slot3DTransform> = {
  'slot-motherboard': {
    position: [0.65, 0.95, -0.5],
    rotation: [Math.PI / 2, 0, Math.PI / 2],
    scale: 0.68,
    placeholderSize: [0.22, 5.3, 5.3],
    explodedOffset: [-1.2, 0, 0],
    partType: 'motherboard',
  },
  'slot-cpu': {
    position: [0.51, 1.63, -1.04],
    rotation: [Math.PI / 2, 0, Math.PI / 2],
    scale: 0.55,
    placeholderSize: [0.18, 1.8, 1.8],
    explodedOffset: [-2.0, 0, 0],
    partType: 'cpu',
  },
  'slot-cooler': {
    position: [0.1, 1.63, -1.04],
    rotation: [0, Math.PI / 2, 0],
    scale: 0.48,
    placeholderSize: [1.3, 2.2, 2.2],
    explodedOffset: [-3.2, 0, 0],
    partType: 'fan',
  },
  'slot-ram-1': {
    position: [0.42, 1.56, 0.32],
    rotation: [0, 0, Math.PI / 2],
    scale: 0.45,
    placeholderSize: [0.75, 2.35, 0.16],
    explodedOffset: [-1.6, 0.8, 0],
    partType: 'ram',
  },
  'slot-ram-2': {
    position: [0.42, 1.56, 0.59],
    rotation: [0, 0, Math.PI / 2],
    scale: 0.45,
    placeholderSize: [0.75, 2.35, 0.16],
    explodedOffset: [-1.6, 0.8, 0],
    partType: 'ram',
  },
  'slot-ram-3': {
    position: [0.42, 1.56, 0.86],
    rotation: [0, 0, Math.PI / 2],
    scale: 0.45,
    placeholderSize: [0.75, 2.35, 0.16],
    explodedOffset: [-1.6, 0.8, 0],
    partType: 'ram',
  },
  'slot-ram-4': {
    position: [0.42, 1.56, 1.13],
    rotation: [0, 0, Math.PI / 2],
    scale: 0.45,
    placeholderSize: [0.75, 2.35, 0.16],
    explodedOffset: [-1.6, 0.8, 0],
    partType: 'ram',
  },
  'slot-m2': {
    position: [0.5, 0.68, -1.04],
    rotation: [Math.PI / 2, 0, Math.PI / 2],
    scale: 0.35,
    placeholderSize: [0.18, 1.95, 0.6],
    explodedOffset: [-1.4, -0.6, 0],
    partType: 'ssd',
  },
  'slot-pcie-x16': {
    position: [-0.1, 0.27, -0.4],
    rotation: [Math.PI / 2, 0, Math.PI / 2],
    scale: 0.65,
    placeholderSize: [1.8, 1.7, 4.8],
    explodedOffset: [-2.4, 0, 0],
    partType: 'gpu',
  },
  'slot-psu': {
    position: [-0.2, -4.0, -1.8],
    rotation: [0, 0, 0],
    scale: 0.65,
    placeholderSize: [3.2, 2.15, 3.4],
    explodedOffset: [0, -1.8, 0],
    partType: 'psu',
  },
};

/**
 * Fallback mapping helper from 2D slot coordinates (canvas scale approx 500x500)
 * to 3D chassis space.
 */
export function map2DTo3DPosition(
  x2d: number,
  y2d: number,
  options?: { depth?: number }
): [number, number, number] {
  // 2D canvas origin is top-left:
  // x: 0..500 maps to case depth Z: -3.5 .. +3.5
  // y: 0..500 maps to case height Y: +3.5 .. -3.5
  const z = ((x2d - 250) / 250) * 3.5;
  const y = -((y2d - 250) / 250) * 3.5;
  const x = options?.depth ?? 0.5;
  return [x, y, z];
}

/**
 * Returns the 3D position, rotation, scale, and visual bounds for any given slot ID.
 * Defaults to the custom tuned layout if registered, otherwise computes a coherent
 * 3D fallback from the 2D slot configuration.
 */
export function getSlot3DTransform(slotId: string, slot?: Slot): Slot3DTransform {
  if (SLOT_3D_TRANSFORMS[slotId]) {
    return SLOT_3D_TRANSFORMS[slotId];
  }

  const fallbackPosition = slot
    ? map2DTo3DPosition(slot.position.x, slot.position.y)
    : ([0, 0, 0] as [number, number, number]);

  const category = slot?.accepts[0] ?? 'motherboard';
  const partType: HardwarePartType =
    category === 'cooler' ? 'fan' : (category as HardwarePartType);

  return {
    position: fallbackPosition,
    rotation: [0, 0, 0],
    scale: 0.5,
    placeholderSize: [1.2, 1.2, 1.2],
    explodedOffset: [-1.2, 0, 0],
    partType,
  };
}
