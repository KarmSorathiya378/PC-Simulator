export type Category = 'case' | 'motherboard' | 'cpu' | 'cooler' | 'ram' | 'ssd' | 'gpu' | 'psu';

export interface ComponentDefinition {
  id: string;
  name: string;
  category: Category;
  description: string;
  functionText: string;
  locationText: string;
  ruleText: string;
  conceptText: string;
  visual: {
    width: number;
    height: number;
    color: string;
  };
  // Optional hardware specifications for compatibility verification
  socket?: string;
  supportedSockets?: string[];
  ddr?: 'DDR4' | 'DDR5';
  supportedDdr?: ('DDR4' | 'DDR5')[];
  formFactor?: 'ATX' | 'Micro-ATX' | 'Mini-ITX' | 'SFX';
  supportedFormFactors?: ('ATX' | 'Micro-ATX' | 'Mini-ITX' | 'SFX')[];
  pcieSlot?: 'PCIe x16';
  interfaceType?: 'NVMe M.2 PCIe 4.0' | 'SATA';
  supportedInterfaces?: string[];
  wattage?: number;
  tdp?: number;
  powerConnectors?: string[];
}

export type SlotId = string;

export interface Slot {
  id: SlotId;
  label: string;
  position: { x: number; y: number };
  accepts: Category[];
  hostComponentId: string;
}

export interface CompatibilityRule {
  id: string;
  description: string;
  check: (comp: ComponentDefinition, host: ComponentDefinition) => boolean;
}

export interface ConnectionRequirement {
  cableId: string;
  sourceLabel: string;
  socketId: string;
  required: boolean;
}

export interface QuizQuestion {
  id: string;
  topic: 'purpose' | 'placement' | 'compatibility' | 'dependency';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BuildConfig {
  slots: Slot[];
  compatibilityRules: CompatibilityRule[];
  requiredConnections: ConnectionRequirement[];
  caseVisual: { width: number; height: number };
}
