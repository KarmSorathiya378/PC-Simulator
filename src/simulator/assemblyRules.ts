import type {
  ComponentDefinition,
  Slot,
  SlotId,
  ConnectionRequirement,
} from '../types';
import { components as defaultComponents } from '../data/components';
import { slots as defaultSlots, compatibilityRules as defaultRules, requiredConnections as defaultRequiredConnections } from '../data/buildConfig';

export interface ValidationResult {
  ok: boolean;
  reason?: string;
}

export interface ProgressResult {
  installedCount: number;
  totalInstallable: number;
  connectedCount: number;
  totalConnections: number;
  percent: number;
}

export interface ConnectionPair {
  cableId: string;
  socketId: string;
}

export interface InstalledPart {
  componentId: string;
  slotId: string;
}

/**
 * Validates whether a candidate component can be placed into a target slot.
 *
 * Checks in sequence:
 * 1. Existence of candidate component and target slot
 * 2. Occupied slot duplicate reject (both slot already taken and component already installed)
 * 3. Generic category-slot mismatch
 * 4. Motherboard prerequisite check for components mounted on motherboard
 * 5. Cooler requires CPU installed check (and cooler socket support)
 * 6. CPU-socket compatibility check with motherboard
 * 7. RAM DDR generation check with motherboard
 * 8. GPU PCIe expansion slot availability check
 * 9. PSU form factor compatibility with chassis
 * 10. Any additional active build compatibility rules
 */
export function validatePlacement(
  components: ComponentDefinition[],
  installedIds: (string | { componentId: string; slotId?: string })[],
  accumulatedId: string,
  slot: Slot | string
): ValidationResult {
  const candidate = components.find((c) => c.id === accumulatedId);
  if (!candidate) {
    return {
      ok: false,
      reason: `Component "${accumulatedId}" was not found in the component catalog.`,
    };
  }

  const targetSlot: Slot | undefined =
    typeof slot === 'string'
      ? defaultSlots.find((s) => s.id === slot)
      : slot;

  if (!targetSlot) {
    const slotIdStr = typeof slot === 'string' ? slot : '(unspecified)';
    return {
      ok: false,
      reason: `Target slot "${slotIdStr}" does not exist.`,
    };
  }

  // Normalize installed IDs and occupied slots
  const installedComponentIdSet = new Set<string>();
  const occupiedSlotIdSet = new Set<string>();

  for (const item of installedIds) {
    if (typeof item === 'string') {
      installedComponentIdSet.add(item);
    } else {
      if (item.componentId) installedComponentIdSet.add(item.componentId);
      if (item.slotId) occupiedSlotIdSet.add(item.slotId);
    }
  }

  // 1. Occupied-slot duplicate reject
  if (installedComponentIdSet.has(candidate.id)) {
    return {
      ok: false,
      reason: `${candidate.name} is already installed in the computer.`,
    };
  }

  if (occupiedSlotIdSet.has(targetSlot.id)) {
    return {
      ok: false,
      reason: `Slot "${targetSlot.label}" is already occupied.`,
    };
  }

  // 2. Generic category-slot mismatch
  if (!targetSlot.accepts.includes(candidate.category)) {
    return {
      ok: false,
      reason: `Slot "${targetSlot.label}" accepts ${targetSlot.accepts.join(
        ', '
      )}, but "${candidate.name}" is a ${candidate.category}.`,
    };
  }

  // Find installed motherboard if any
  const installedMb = components.find(
    (c) => c.category === 'motherboard' && installedComponentIdSet.has(c.id)
  );

  // 3. Motherboard prerequisite check: if target slot belongs to motherboard, motherboard must be installed first
  const isMotherboardHosted =
    targetSlot.hostComponentId.startsWith('motherboard') ||
    targetSlot.accepts.some((cat) => ['cpu', 'cooler', 'ram', 'ssd', 'gpu'].includes(cat));

  if (candidate.category !== 'motherboard' && isMotherboardHosted && !installedMb) {
    return {
      ok: false,
      reason: `Cannot install ${candidate.name} before the motherboard is installed onto the chassis standoffs.`,
    };
  }

  // 4. Cooler requires CPU installed first
  if (candidate.category === 'cooler') {
    const installedCpu = components.find(
      (c) => c.category === 'cpu' && installedComponentIdSet.has(c.id)
    );

    if (!installedCpu) {
      return {
        ok: false,
        reason:
          'The CPU cooler requires the processor (CPU) to be seated in the socket with thermal paste applied first.',
      };
    }

    if (
      installedCpu.socket &&
      candidate.supportedSockets &&
      !candidate.supportedSockets.includes(installedCpu.socket)
    ) {
      return {
        ok: false,
        reason: `Cooler mounting bracket is incompatible with CPU socket "${installedCpu.socket}". Supported: ${candidate.supportedSockets.join(
          ', '
        )}.`,
      };
    }
  }

  // 5. CPU socket compatibility with motherboard
  if (candidate.category === 'cpu' && installedMb) {
    if (
      candidate.socket &&
      installedMb.supportedSockets &&
      !installedMb.supportedSockets.includes(candidate.socket)
    ) {
      return {
        ok: false,
        reason: `CPU socket "${candidate.socket}" does not match motherboard socket standard (${installedMb.supportedSockets.join(
          ', '
        )}).`,
      };
    }
  }

  // 6. RAM DDR generation check with motherboard
  if (candidate.category === 'ram' && installedMb) {
    if (
      candidate.ddr &&
      installedMb.supportedDdr &&
      !installedMb.supportedDdr.includes(candidate.ddr)
    ) {
      return {
        ok: false,
        reason: `RAM memory generation "${candidate.ddr}" is not supported by motherboard DIMM slots (${installedMb.supportedDdr.join(
          ', '
        )}).`,
      };
    }
  }

  // 7. GPU requires PCIe expansion slot
  if (candidate.category === 'gpu') {
    if (targetSlot.accepts.includes('gpu')) {
      if (installedMb && installedMb.pcieSlot && candidate.pcieSlot && installedMb.pcieSlot !== candidate.pcieSlot) {
        return {
          ok: false,
          reason: `Graphics card requires a ${candidate.pcieSlot} slot, but motherboard provides ${installedMb.pcieSlot}.`,
        };
      }
    }
  }

  // 8. PSU form factor check with chassis
  if (candidate.category === 'psu') {
    const chassis = components.find((c) => c.category === 'case');
    if (chassis?.supportedFormFactors && candidate.formFactor) {
      if (!chassis.supportedFormFactors.includes(candidate.formFactor)) {
        return {
          ok: false,
          reason: `PSU form factor "${candidate.formFactor}" does not fit into the chassis PSU bay (${chassis.supportedFormFactors.join(
            ', '
          )}).`,
        };
      }
    }
  }

  // 9. Built-in build config compatibility rules
  for (const rule of defaultRules) {
    if (installedMb) {
      const passes = rule.check(candidate, installedMb);
      if (!passes) {
        return {
          ok: false,
          reason: rule.description,
        };
      }
    }
  }

  return { ok: true };
}

/**
 * Returns the list of slot IDs where the specified component can currently be placed.
 */
export function getHighlightedSlots(
  state: {
    installedPal?: { componentId: string; slotId: string }[];
    occupiedSlots?: Record<string, string> | string[];
    installedIds?: string[];
  },
  componentId: string
): SlotId[] {
  // Extract installed list and occupied slots from state
  const installedList: { componentId: string; slotId?: string }[] = [];
  const occupiedSet = new Set<string>();

  if (state.installedPal && Array.isArray(state.installedPal)) {
    for (const item of state.installedPal) {
      installedList.push(item);
      occupiedSet.add(item.slotId);
    }
  }

  if (state.occupiedSlots) {
    if (Array.isArray(state.occupiedSlots)) {
      for (const slotId of state.occupiedSlots) {
        occupiedSet.add(slotId);
      }
    } else {
      for (const [slotId, cId] of Object.entries(state.occupiedSlots)) {
        occupiedSet.add(slotId);
        installedList.push({ componentId: cId, slotId });
      }
    }
  }

  if (state.installedIds && Array.isArray(state.installedIds)) {
    for (const cId of state.installedIds) {
      installedList.push({ componentId: cId });
    }
  }

  // Import components catalog from data
  // We dynamically use defaultSlots and default components
  const validSlotIds: SlotId[] = [];

  for (const slot of defaultSlots) {
    if (occupiedSet.has(slot.id)) {
      continue;
    }
    const validation = validatePlacement(
      defaultComponents,
      installedList,
      componentId,
      slot
    );

    if (validation.ok) {
      validSlotIds.push(slot.id);
    }
  }

  return validSlotIds;
}

/**
 * Validates and completes a connection between a cable and a target socket.
 * Enforces one-to-one cable matching, required connections, and prevents duplicate connections.
 */
export function completeConnection(
  connections: (ConnectionPair | string)[],
  cableId: string,
  socketId: string
): ValidationResult {
  const req = defaultRequiredConnections.find(
    (r) => r.cableId === cableId || r.socketId === socketId
  );

  if (!req) {
    return {
      ok: false,
      reason: `No matching power specification found for cable "${cableId}" and socket "${socketId}".`,
    };
  }

  if (req.cableId !== cableId || req.socketId !== socketId) {
    return {
      ok: false,
      reason: `Cable "${cableId}" cannot connect to socket "${socketId}". Expected socket "${req.socketId}".`,
    };
  }

  // Check if connection is already completed
  const alreadyConnected = connections.some((c) => {
    if (typeof c === 'string') {
      return c === cableId || c === socketId;
    }
    return c.cableId === cableId || c.socketId === socketId;
  });

  if (alreadyConnected) {
    return {
      ok: false,
      reason: `Connection for "${req.sourceLabel}" is already completed.`,
    };
  }

  return { ok: true };
}

/**
 * Derives current assembly and connection progress.
 * Total installable components default to 7 (motherboard, cpu, cooler, ram, ssd, gpu, psu).
 */
export function deriveProgress(
  installed: (InstalledPart | string)[],
  connections: (ConnectionPair | string)[],
  requirements?:
    | ConnectionRequirement[]
    | { requiredConnections?: ConnectionRequirement[]; totalInstallable?: number }
): ProgressResult {
  const installedCount = installed.length;

  let totalInstallable = 7;
  let activeRequirements = defaultRequiredConnections;

  if (requirements) {
    if (Array.isArray(requirements)) {
      activeRequirements = requirements;
    } else {
      if (typeof requirements.totalInstallable === 'number') {
        totalInstallable = requirements.totalInstallable;
      }
      if (requirements.requiredConnections) {
        activeRequirements = requirements.requiredConnections;
      }
    }
  }

  // Count valid required connections
  let connectedCount = 0;
  for (const req of activeRequirements) {
    const isCompleted = connections.some((c) => {
      if (typeof c === 'string') {
        return c === req.cableId || c === req.socketId;
      }
      return c.cableId === req.cableId && c.socketId === req.socketId;
    });

    if (isCompleted) {
      connectedCount++;
    }
  }

  const totalConnections = activeRequirements.length;
  const totalTasks = totalInstallable + totalConnections;
  const completedTasks = Math.min(totalTasks, installedCount + connectedCount);
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    installedCount,
    totalInstallable,
    connectedCount,
    totalConnections,
    percent,
  };
}
