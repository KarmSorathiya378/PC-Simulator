import { describe, it, expect } from 'vitest';
import {
  validatePlacement,
  getHighlightedSlots,
  completeConnection,
  deriveProgress,
} from './assemblyRules';
import { components } from '../data/components';
import { slots, requiredConnections } from '../data/buildConfig';

describe('Assembly Rules Simulator Engine', () => {
  const mbSlot = slots.find((s) => s.id === 'slot-motherboard')!;
  const cpuSlot = slots.find((s) => s.id === 'slot-cpu')!;
  const coolerSlot = slots.find((s) => s.id === 'slot-cooler')!;
  const ramSlot = slots.find((s) => s.id === 'slot-ram-2')!;
  const gpuSlot = slots.find((s) => s.id === 'slot-pcie-x16')!;
  const psuSlot = slots.find((s) => s.id === 'slot-psu')!;

  describe('validatePlacement', () => {
    it('rejects placement when target slot category mismatches component', () => {
      // Trying to install CPU directly into motherboard tray
      const res = validatePlacement(components, [], 'cpu-ryzen-7800x3d', mbSlot);
      expect(res.ok).toBe(false);
      expect(res.reason).toMatch(/accepts motherboard/i);
    });

    it('rejects placement of motherboard child components if motherboard is not installed', () => {
      // Trying to install CPU without motherboard installed
      const res = validatePlacement(components, [], 'cpu-ryzen-7800x3d', cpuSlot);
      expect(res.ok).toBe(false);
      expect(res.reason).toMatch(/motherboard is installed/i);
    });

    it('allows motherboard installation onto empty case standoffs', () => {
      const res = validatePlacement(components, [], 'motherboard-b650-01', mbSlot);
      expect(res.ok).toBe(true);
    });

    it('rejects duplicate installation if component is already installed', () => {
      const res = validatePlacement(
        components,
        [{ componentId: 'motherboard-b650-01', slotId: mbSlot.id }],
        'motherboard-b650-01',
        mbSlot
      );
      expect(res.ok).toBe(false);
      expect(res.reason).toMatch(/already installed/i);
    });

    it('rejects installation into an already occupied slot', () => {
      const res = validatePlacement(
        components,
        [{ componentId: 'motherboard-b650-01', slotId: mbSlot.id }],
        'psu-corsair-rm750e',
        mbSlot
      );
      expect(res.ok).toBe(false);
      expect(res.reason).toMatch(/already occupied|accepts/i);
    });

    it('rejects CPU cooler if CPU is not installed first', () => {
      const res = validatePlacement(
        components,
        [{ componentId: 'motherboard-b650-01', slotId: mbSlot.id }],
        'cooler-peerless-assassin',
        coolerSlot
      );
      expect(res.ok).toBe(false);
      expect(res.reason).toMatch(/requires the processor|CPU/i);
    });

    it('allows CPU cooler once CPU and motherboard are installed', () => {
      const installed = [
        { componentId: 'motherboard-b650-01', slotId: mbSlot.id },
        { componentId: 'cpu-ryzen-7800x3d', slotId: cpuSlot.id },
      ];
      const res = validatePlacement(
        components,
        installed,
        'cooler-peerless-assassin',
        coolerSlot
      );
      expect(res.ok).toBe(true);
    });

    it('allows RAM installation once motherboard is installed', () => {
      const installed = [{ componentId: 'motherboard-b650-01', slotId: mbSlot.id }];
      const res = validatePlacement(
        components,
        installed,
        'ram-corsair-ddr5-32gb',
        ramSlot
      );
      expect(res.ok).toBe(true);
    });

    it('rejects incompatible DDR generation RAM', () => {
      const fakeDdr4Ram = {
        ...components.find((c) => c.id === 'ram-corsair-ddr5-32gb')!,
        id: 'fake-ddr4-ram',
        ddr: 'DDR4' as const,
      };
      const customComponents = [...components, fakeDdr4Ram];
      const installed = [{ componentId: 'motherboard-b650-01', slotId: mbSlot.id }];
      const res = validatePlacement(
        customComponents,
        installed,
        'fake-ddr4-ram',
        ramSlot
      );
      expect(res.ok).toBe(false);
      expect(res.reason).toMatch(/DDR/i);
    });

    it('rejects incompatible CPU socket', () => {
      const fakeIntelCpu = {
        ...components.find((c) => c.id === 'cpu-ryzen-7800x3d')!,
        id: 'fake-intel-cpu',
        socket: 'LGA1700',
      };
      const customComponents = [...components, fakeIntelCpu];
      const installed = [{ componentId: 'motherboard-b650-01', slotId: mbSlot.id }];
      const res = validatePlacement(
        customComponents,
        installed,
        'fake-intel-cpu',
        cpuSlot
      );
      expect(res.ok).toBe(false);
      expect(res.reason).toMatch(/socket/i);
    });

    it('allows GPU in PCIe slot when motherboard is installed', () => {
      const installed = [{ componentId: 'motherboard-b650-01', slotId: mbSlot.id }];
      const res = validatePlacement(
        components,
        installed,
        'gpu-rtx-4070-super',
        gpuSlot
      );
      expect(res.ok).toBe(true);
    });

    it('allows PSU in case PSU bay', () => {
      const res = validatePlacement(
        components,
        [],
        'psu-corsair-rm750e',
        psuSlot
      );
      expect(res.ok).toBe(true);
    });

    it('rejects unsupported PSU form factor', () => {
      const fakeSfxPsu = {
        ...components.find((c) => c.id === 'psu-corsair-rm750e')!,
        id: 'fake-sfx-psu',
        formFactor: 'SFX' as const,
      };
      // Suppose case only accepted ATX
      const fakeCase = {
        ...components.find((c) => c.id === 'case-atx-01')!,
        supportedFormFactors: ['Micro-ATX'] as ('ATX' | 'Micro-ATX' | 'Mini-ITX' | 'SFX')[],
      };
      const customComponents = components.map((c) =>
        c.id === 'case-atx-01' ? fakeCase : c
      ).concat(fakeSfxPsu);

      const res = validatePlacement(
        customComponents,
        [],
        'fake-sfx-psu',
        psuSlot
      );
      expect(res.ok).toBe(false);
      expect(res.reason).toMatch(/form factor/i);
    });
  });

  describe('getHighlightedSlots', () => {
    it('returns motherboard tray when starting clean', () => {
      const highlighted = getHighlightedSlots({}, 'motherboard-b650-01');
      expect(highlighted).toContain('slot-motherboard');
    });

    it('returns empty array if motherboard is already installed', () => {
      const highlighted = getHighlightedSlots(
        {
          installedPal: [{ componentId: 'motherboard-b650-01', slotId: 'slot-motherboard' }],
          occupiedSlots: { 'slot-motherboard': 'motherboard-b650-01' },
        },
        'motherboard-b650-01'
      );
      expect(highlighted).toEqual([]);
    });

    it('highlights CPU socket once motherboard is installed', () => {
      const highlighted = getHighlightedSlots(
        {
          installedPal: [{ componentId: 'motherboard-b650-01', slotId: 'slot-motherboard' }],
          occupiedSlots: { 'slot-motherboard': 'motherboard-b650-01' },
        },
        'cpu-ryzen-7800x3d'
      );
      expect(highlighted).toContain('slot-cpu');
    });
  });

  describe('completeConnection', () => {
    it('validates matching 24-pin cable to 24-pin motherboard socket', () => {
      const res = completeConnection([], 'cable-24pin-atx', 'socket-mb-24pin');
      expect(res.ok).toBe(true);
    });

    it('rejects mismatched cable and socket', () => {
      const res = completeConnection([], 'cable-24pin-atx', 'socket-cpu-8pin');
      expect(res.ok).toBe(false);
      expect(res.reason).toMatch(/cannot connect|mismatch/i);
    });

    it('rejects duplicate connections', () => {
      const res = completeConnection(
        [{ cableId: 'cable-24pin-atx', socketId: 'socket-mb-24pin' }],
        'cable-24pin-atx',
        'socket-mb-24pin'
      );
      expect(res.ok).toBe(false);
      expect(res.reason).toMatch(/already completed/i);
    });
  });

  describe('deriveProgress', () => {
    it('returns 0% when nothing is installed or connected', () => {
      const prog = deriveProgress([], [], requiredConnections);
      expect(prog.installedCount).toBe(0);
      expect(prog.connectedCount).toBe(0);
      expect(prog.percent).toBe(0);
    });

    it('returns accurate percentage as items are installed and connected', () => {
      const installed = [
        { componentId: 'motherboard-b650-01', slotId: 'slot-motherboard' },
        { componentId: 'cpu-ryzen-7800x3d', slotId: 'slot-cpu' },
        { componentId: 'cooler-peerless-assassin', slotId: 'slot-cooler' },
        { componentId: 'ram-corsair-ddr5-32gb', slotId: 'slot-ram-2' },
        { componentId: 'ssd-samsung-990-pro', slotId: 'slot-m2' },
      ];
      const connections = [
        { cableId: 'cable-24pin-atx', socketId: 'socket-mb-24pin' },
      ];
      // 5 installed + 1 connected = 6 completed tasks out of (7 + 3 = 10) -> 60%
      const prog = deriveProgress(installed, connections, requiredConnections);
      expect(prog.installedCount).toBe(5);
      expect(prog.connectedCount).toBe(1);
      expect(prog.totalInstallable).toBe(7);
      expect(prog.totalConnections).toBe(3);
      expect(prog.percent).toBe(60);
    });

    it('returns 100% when all 7 parts and 3 connections are completed', () => {
      const installed = [
        { componentId: 'motherboard-b650-01', slotId: 'slot-motherboard' },
        { componentId: 'cpu-ryzen-7800x3d', slotId: 'slot-cpu' },
        { componentId: 'cooler-peerless-assassin', slotId: 'slot-cooler' },
        { componentId: 'ram-corsair-ddr5-32gb', slotId: 'slot-ram-2' },
        { componentId: 'ssd-samsung-990-pro', slotId: 'slot-m2' },
        { componentId: 'gpu-rtx-4070-super', slotId: 'slot-pcie-x16' },
        { componentId: 'psu-corsair-rm750e', slotId: 'slot-psu' },
      ];
      const connections = [
        { cableId: 'cable-24pin-atx', socketId: 'socket-mb-24pin' },
        { cableId: 'cable-8pin-eps', socketId: 'socket-cpu-8pin' },
        { cableId: 'cable-8pin-pcie', socketId: 'socket-gpu-pcie' },
      ];
      const prog = deriveProgress(installed, connections, requiredConnections);
      expect(prog.percent).toBe(100);
    });
  });
});
