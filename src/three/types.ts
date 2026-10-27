export type HardwarePartType =
  | 'cpu'
  | 'gpu'
  | 'ram'
  | 'motherboard'
  | 'psu'
  | 'fan'
  | 'cable'
  | 'case'
  | 'ssd';

export interface Part3DProps {
  type: HardwarePartType;
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  hoverHighlight?: boolean;
  autoRotate?: boolean;
  wireframe?: boolean;
  animated?: boolean;
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
  className?: string;
}

export interface PartVisualMetadata {
  id: HardwarePartType;
  name: string;
  category: string;
  description: string;
  keySpecs: string[];
  dimensionsMm: { width: number; height: number; depth: number };
}
