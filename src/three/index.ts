/**
 * 3D PC Hardware Visual Engine for PC Builder Lab.
 * Clean, modular, typed, and fully procedural with Three.js & React Three Fiber.
 */

export { Scene3D } from './Scene3D';
export type { Scene3DProps } from './Scene3D';

export { Part3D } from './Part3D';
export type { Part3DProps, HardwarePartType, PartVisualMetadata } from './types';

export { Hardware3DPreview } from './Hardware3DPreview';

// Individual 3D Part Modules
export { Cpu3D } from './parts/Cpu3D';
export { Ram3D } from './parts/Ram3D';
export { Gpu3D } from './parts/Gpu3D';
export { Motherboard3D } from './parts/Motherboard3D';
export { Psu3D } from './parts/Psu3D';
export { CaseFan3D } from './parts/CaseFan3D';
export { Cable3D } from './parts/Cable3D';
export { Case3D } from './parts/Case3D';
export { Ssd3D } from './parts/Ssd3D';

// Procedural PBR Textures
export {
  createPcbTexture,
  createCpuIhsTexture,
  createGoldFingerTexture,
  createHoneycombTexture,
  createRamHeatsinkTexture,
} from './materials/proceduralTextures';
