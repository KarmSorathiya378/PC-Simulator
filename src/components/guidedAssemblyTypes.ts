import type { HardwarePartType } from '../three/types';

export type CanvasViewMode = '3d' | '2d';

export interface GuidedStep {
  componentId: string;
  slotId: string;
  title: string;
  hint: string;
}

export const CATEGORY_TO_3D: Record<string, HardwarePartType | undefined> = {
  cpu: 'cpu',
  gpu: 'gpu',
  ram: 'ram',
  motherboard: 'motherboard',
  psu: 'psu',
  cooler: 'fan',
  case: 'case',
  ssd: 'ssd',
};

export const GUIDED_STEPS: GuidedStep[] = [
  {
    componentId: 'motherboard-b650-01',
    slotId: 'slot-motherboard',
    title: 'Install the Motherboard onto the Chassis Standoffs',
    hint: 'Line up the motherboard with the pre-installed brass standoffs in the main tray and align the rear I/O shield.',
  },
  {
    componentId: 'cpu-ryzen-7800x3d',
    slotId: 'slot-cpu',
    title: 'Seat the AMD AM5 Ryzen Processor into the CPU Socket',
    hint: 'Lift the socket retention lever, align the golden triangle indicator on the CPU corner, and lower without force.',
  },
  {
    componentId: 'cooler-peerless-assassin',
    slotId: 'slot-cooler',
    title: 'Mount the Dual-Tower CPU Cooler over the Processor',
    hint: 'Ensure thermal paste is applied to the CPU heat spreader before securing the cooler mounting crossbar.',
  },
  {
    componentId: 'ram-corsair-ddr5-32gb',
    slotId: 'slot-ram-1',
    title: 'Install DDR5 Memory Module into DIMM Slot',
    hint: 'Open the RAM slot retention latches, align the DDR5 offset center notch, and press firmly until it clicks.',
  },
  {
    componentId: 'ssd-samsung-990-pro',
    slotId: 'slot-m2',
    title: 'Mount High-Speed NVMe M.2 SSD into Primary M.2 Slot',
    hint: 'Insert the M.2 SSD into the M-key slot at a 30-degree angle, then gently fasten the retention screw or latch.',
  },
  {
    componentId: 'gpu-rtx-4070-super',
    slotId: 'slot-pcie-x16',
    title: 'Seat the GeForce RTX 4070 Super into PCIe x16 Slot',
    hint: 'Release the PCIe retention latch on the motherboard, align the expansion brackets, and push until the lock snaps.',
  },
  {
    componentId: 'psu-corsair-rm750e',
    slotId: 'slot-psu',
    title: 'Slide the 750W Modular Power Supply into the Lower Shroud',
    hint: 'Position the PSU fan facing down towards the bottom dust filter and secure with four standard chassis screws.',
  },
];
