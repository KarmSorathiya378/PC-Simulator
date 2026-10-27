import type { BuildConfig, Slot, CompatibilityRule, ConnectionRequirement } from '../types';

export const slots: Slot[] = [
  {
    id: 'slot-motherboard',
    label: 'Motherboard Tray (ATX)',
    position: { x: 120, y: 80 },
    accepts: ['motherboard'],
    hostComponentId: 'case-atx-01',
  },
  {
    id: 'slot-cpu',
    label: 'CPU Socket (AM5)',
    position: { x: 200, y: 150 },
    accepts: ['cpu'],
    hostComponentId: 'motherboard-b650-01',
  },
  {
    id: 'slot-cooler',
    label: 'CPU Cooler Mount',
    position: { x: 200, y: 150 },
    accepts: ['cooler'],
    hostComponentId: 'motherboard-b650-01',
  },
  {
    id: 'slot-ram-1',
    label: 'DDR5 Slot DIMM A1',
    position: { x: 275, y: 130 },
    accepts: ['ram'],
    hostComponentId: 'motherboard-b650-01',
  },
  {
    id: 'slot-ram-2',
    label: 'DDR5 Slot DIMM A2 (First Channel)',
    position: { x: 290, y: 130 },
    accepts: ['ram'],
    hostComponentId: 'motherboard-b650-01',
  },
  {
    id: 'slot-ram-3',
    label: 'DDR5 Slot DIMM B1',
    position: { x: 305, y: 130 },
    accepts: ['ram'],
    hostComponentId: 'motherboard-b650-01',
  },
  {
    id: 'slot-ram-4',
    label: 'DDR5 Slot DIMM B2 (Second Channel)',
    position: { x: 320, y: 130 },
    accepts: ['ram'],
    hostComponentId: 'motherboard-b650-01',
  },
  {
    id: 'slot-m2',
    label: 'M.2 NVMe SSD Slot (PCIe 4.0)',
    position: { x: 200, y: 225 },
    accepts: ['ssd'],
    hostComponentId: 'motherboard-b650-01',
  },
  {
    id: 'slot-pcie-x16',
    label: 'PCIe 4.0 x16 Expansion Slot',
    position: { x: 150, y: 270 },
    accepts: ['gpu'],
    hostComponentId: 'motherboard-b650-01',
  },
  {
    id: 'slot-psu',
    label: 'ATX Power Supply Bay',
    position: { x: 60, y: 410 },
    accepts: ['psu'],
    hostComponentId: 'case-atx-01',
  },
];

export const compatibilityRules: CompatibilityRule[] = [
  {
    id: 'rule-cpu-socket-match',
    description: 'CPU socket must match the motherboard socket (e.g., AM5 with AM5, LGA1700 with LGA1700).',
    check: (comp, host) => {
      if (comp.category !== 'cpu') return true;
      if (host.category !== 'motherboard') return false;
      if (!comp.socket || !host.supportedSockets) return true;
      return host.supportedSockets.includes(comp.socket);
    },
  },
  {
    id: 'rule-ram-ddr-match',
    description: 'RAM memory generation (DDR4 vs DDR5) must match the motherboard DIMM specification.',
    check: (comp, host) => {
      if (comp.category !== 'ram') return true;
      if (host.category !== 'motherboard') return false;
      if (!comp.ddr || !host.supportedDdr) return true;
      return host.supportedDdr.includes(comp.ddr);
    },
  },
  {
    id: 'rule-cooler-cpu-dependency',
    description: 'CPU cooler mounting requires an installed CPU and socket bracket compatibility.',
    check: (comp, host) => {
      if (comp.category !== 'cooler') return true;
      // Host can be CPU or motherboard with socket info
      if (host.category === 'cpu') {
        if (!host.socket || !comp.supportedSockets) return true;
        return comp.supportedSockets.includes(host.socket);
      }
      if (host.category === 'motherboard') {
        if (!host.socket || !comp.supportedSockets) return true;
        return comp.supportedSockets.includes(host.socket);
      }
      return false;
    },
  },
  {
    id: 'rule-gpu-pcie-slot',
    description: 'Graphics card requires an available PCIe x16 expansion slot.',
    check: (comp, host) => {
      if (comp.category !== 'gpu') return true;
      if (host.category !== 'motherboard') return false;
      return host.pcieSlot === 'PCIe x16' || !!host.pcieSlot;
    },
  },
  {
    id: 'rule-psu-form-factor',
    description: 'Power supply form factor (ATX/SFX) must be supported by the case chassis mounting bay.',
    check: (comp, host) => {
      if (comp.category !== 'psu') return true;
      if (host.category !== 'case') return false;
      if (!comp.formFactor || !host.supportedFormFactors) return true;
      return host.supportedFormFactors.includes(comp.formFactor);
    },
  },
];

export const requiredConnections: ConnectionRequirement[] = [
  {
    cableId: 'cable-24pin-atx',
    sourceLabel: '24-pin Main ATX Power Cable',
    socketId: 'socket-mb-24pin',
    required: true,
  },
  {
    cableId: 'cable-8pin-eps',
    sourceLabel: '8-pin EPS / CPU 12V Power Cable',
    socketId: 'socket-cpu-8pin',
    required: true,
  },
  {
    cableId: 'cable-8pin-pcie',
    sourceLabel: '8-pin (6+2) PCIe Graphics Power Cable',
    socketId: 'socket-gpu-pcie',
    required: true,
  },
];

export const buildConfig: BuildConfig = {
  slots,
  compatibilityRules,
  requiredConnections,
  caseVisual: {
    width: 600,
    height: 520,
  },
};
