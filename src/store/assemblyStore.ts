import { create } from 'zustand';
import type { SlotId } from '../types';
import { components } from '../data/components';
import {
  validatePlacement,
  completeConnection,
  deriveProgress,
  type ProgressResult,
  type ValidationResult,
  type InstalledPart,
  type ConnectionPair,
} from '../simulator/assemblyRules';
import {
  saveSession,
  loadSession,
  clearSession,
  type SimulatorMode,
} from '../utils/persistence';

export interface AssemblySnapshot {
  installedPal: InstalledPart[];
  occupiedSlots: Record<SlotId, string>;
  connections: ConnectionPair[];
}

export interface AssemblyStoreState {
  mode: SimulatorMode;
  installedPal: InstalledPart[];
  occupiedSlots: Record<SlotId, string>;
  connections: ConnectionPair[];
  history: {
    past: AssemblySnapshot[];
    future: AssemblySnapshot[];
  };
  incorrectAttempts: number;
  lastFeedback: { ok: boolean; message: string } | null;

  // Actions
  startMode: (mode: SimulatorMode) => void;
  installComponent: (componentId: string, slotId: SlotId) => ValidationResult;
  removeComponent: (identifier: string) => boolean;
  connect: (cableId: string, socketId: string) => ValidationResult;
  undo: () => boolean;
  redo: () => boolean;
  getProgress: () => ProgressResult;
  restart: () => void;
  reset: () => void;
}

// Auto-restore persisted session on initial module load if available
const restored = typeof window !== 'undefined' ? loadSession() : null;

const initialInstalledPal: InstalledPart[] = restored?.installedPal ?? [];
const initialOccupiedSlots: Record<SlotId, string> = restored?.occupiedSlots ?? {};
const initialConnections: ConnectionPair[] = restored?.connections ?? [];
const initialMode: SimulatorMode = restored?.mode ?? 'explore';
const initialIncorrectAttempts: number = restored?.incorrectAttempts ?? 0;

export const useAssemblyStore = create<AssemblyStoreState>()((set, get) => ({
  mode: initialMode,
  installedPal: initialInstalledPal,
  occupiedSlots: initialOccupiedSlots,
  connections: initialConnections,
  history: {
    past: [],
    future: [],
  },
  incorrectAttempts: initialIncorrectAttempts,
  lastFeedback: null,

  startMode: (mode: SimulatorMode) => {
    set({ mode, lastFeedback: null });
    saveSession({
      mode,
      installedPal: get().installedPal,
      occupiedSlots: get().occupiedSlots,
      connections: get().connections,
      incorrectAttempts: get().incorrectAttempts,
    });
  },

  installComponent: (componentId: string, slotId: SlotId): ValidationResult => {
    const state = get();

    // Pure validation via assemblyRules engine
    const validation = validatePlacement(
      components,
      state.installedPal,
      componentId,
      slotId
    );

    if (!validation.ok) {
      const newAttempts = state.incorrectAttempts + 1;
      set({
        incorrectAttempts: newAttempts,
        lastFeedback: {
          ok: false,
          message: validation.reason || 'Placement validation failed.',
        },
      });

      saveSession({
        mode: state.mode,
        installedPal: state.installedPal,
        occupiedSlots: state.occupiedSlots,
        connections: state.connections,
        incorrectAttempts: newAttempts,
      });

      return validation;
    }

    // Capture current snapshot for undo stack
    const currentSnapshot: AssemblySnapshot = {
      installedPal: [...state.installedPal],
      occupiedSlots: { ...state.occupiedSlots },
      connections: [...state.connections],
    };

    const nextInstalled = [...state.installedPal, { componentId, slotId }];
    const nextOccupied = { ...state.occupiedSlots, [slotId]: componentId };

    set({
      installedPal: nextInstalled,
      occupiedSlots: nextOccupied,
      history: {
        past: [...state.history.past.slice(-49), currentSnapshot],
        future: [],
      },
      lastFeedback: {
        ok: true,
        message: 'Component successfully positioned and locked into place.',
      },
    });

    saveSession({
      mode: state.mode,
      installedPal: nextInstalled,
      occupiedSlots: nextOccupied,
      connections: state.connections,
      incorrectAttempts: state.incorrectAttempts,
    });

    return { ok: true };
  },

  removeComponent: (identifier: string): boolean => {
    const state = get();
    const target = state.installedPal.find(
      (p) => p.componentId === identifier || p.slotId === identifier
    );

    if (!target) {
      return false;
    }

    // Snapshot before removal
    const currentSnapshot: AssemblySnapshot = {
      installedPal: [...state.installedPal],
      occupiedSlots: { ...state.occupiedSlots },
      connections: [...state.connections],
    };

    // Remove component
    const compDef = components.find((c) => c.id === target.componentId);
    let nextInstalled = state.installedPal.filter(
      (p) => p.componentId !== target.componentId
    );
    const nextOccupied = { ...state.occupiedSlots };
    delete nextOccupied[target.slotId];

    // Cascade removals if dependencies break:
    // If motherboard is removed, all dependent components must be unseated
    if (compDef?.category === 'motherboard') {
      for (const item of state.installedPal) {
        if (item.componentId !== target.componentId) {
          const itemDef = components.find((c) => c.id === item.componentId);
          if (itemDef?.category !== 'case' && itemDef?.category !== 'psu') {
            nextInstalled = nextInstalled.filter((p) => p.componentId !== item.componentId);
            delete nextOccupied[item.slotId];
          }
        }
      }
    }

    // If CPU is removed, cooler must also be removed
    if (compDef?.category === 'cpu') {
      const coolerPart = nextInstalled.find((p) => {
        const itemDef = components.find((c) => c.id === p.componentId);
        return itemDef?.category === 'cooler';
      });
      if (coolerPart) {
        nextInstalled = nextInstalled.filter((p) => p.componentId !== coolerPart.componentId);
        delete nextOccupied[coolerPart.slotId];
      }
    }

    // Disconnect any cables associated with removed hardware
    let nextConnections = [...state.connections];
    if (compDef?.category === 'motherboard') {
      nextConnections = nextConnections.filter(
        (c) => c.socketId !== 'socket-mb-24pin' && c.socketId !== 'socket-cpu-8pin'
      );
    } else if (compDef?.category === 'gpu') {
      nextConnections = nextConnections.filter(
        (c) => c.socketId !== 'socket-gpu-pcie'
      );
    } else if (compDef?.category === 'psu') {
      nextConnections = [];
    }

    set({
      installedPal: nextInstalled,
      occupiedSlots: nextOccupied,
      connections: nextConnections,
      history: {
        past: [...state.history.past.slice(-49), currentSnapshot],
        future: [],
      },
      lastFeedback: {
        ok: true,
        message: `Removed component from slot ${target.slotId}.`,
      },
    });

    saveSession({
      mode: state.mode,
      installedPal: nextInstalled,
      occupiedSlots: nextOccupied,
      connections: nextConnections,
      incorrectAttempts: state.incorrectAttempts,
    });

    return true;
  },

  connect: (cableId: string, socketId: string): ValidationResult => {
    const state = get();
    const validation = completeConnection(state.connections, cableId, socketId);

    if (!validation.ok) {
      set({
        lastFeedback: {
          ok: false,
          message: validation.reason || 'Cable connection failed.',
        },
      });
      return validation;
    }

    const currentSnapshot: AssemblySnapshot = {
      installedPal: [...state.installedPal],
      occupiedSlots: { ...state.occupiedSlots },
      connections: [...state.connections],
    };

    const nextConnections = [...state.connections, { cableId, socketId }];

    set({
      connections: nextConnections,
      history: {
        past: [...state.history.past.slice(-49), currentSnapshot],
        future: [],
      },
      lastFeedback: {
        ok: true,
        message: 'Power cable securely connected to socket.',
      },
    });

    saveSession({
      mode: state.mode,
      installedPal: state.installedPal,
      occupiedSlots: state.occupiedSlots,
      connections: nextConnections,
      incorrectAttempts: state.incorrectAttempts,
    });

    return { ok: true };
  },

  undo: (): boolean => {
    const state = get();
    if (state.history.past.length === 0) {
      return false;
    }

    const previousSnapshot = state.history.past[state.history.past.length - 1];
    const newPast = state.history.past.slice(0, -1);

    const currentSnapshot: AssemblySnapshot = {
      installedPal: [...state.installedPal],
      occupiedSlots: { ...state.occupiedSlots },
      connections: [...state.connections],
    };

    set({
      installedPal: previousSnapshot.installedPal,
      occupiedSlots: previousSnapshot.occupiedSlots,
      connections: previousSnapshot.connections,
      history: {
        past: newPast,
        future: [currentSnapshot, ...state.history.future.slice(0, 49)],
      },
      lastFeedback: {
        ok: true,
        message: 'Reverted previous action (Undo).',
      },
    });

    saveSession({
      mode: state.mode,
      installedPal: previousSnapshot.installedPal,
      occupiedSlots: previousSnapshot.occupiedSlots,
      connections: previousSnapshot.connections,
      incorrectAttempts: state.incorrectAttempts,
    });

    return true;
  },

  redo: (): boolean => {
    const state = get();
    if (state.history.future.length === 0) {
      return false;
    }

    const nextSnapshot = state.history.future[0];
    const newFuture = state.history.future.slice(1);

    const currentSnapshot: AssemblySnapshot = {
      installedPal: [...state.installedPal],
      occupiedSlots: { ...state.occupiedSlots },
      connections: [...state.connections],
    };

    set({
      installedPal: nextSnapshot.installedPal,
      occupiedSlots: nextSnapshot.occupiedSlots,
      connections: nextSnapshot.connections,
      history: {
        past: [...state.history.past.slice(-49), currentSnapshot],
        future: newFuture,
      },
      lastFeedback: {
        ok: true,
        message: 'Restored action (Redo).',
      },
    });

    saveSession({
      mode: state.mode,
      installedPal: nextSnapshot.installedPal,
      occupiedSlots: nextSnapshot.occupiedSlots,
      connections: nextSnapshot.connections,
      incorrectAttempts: state.incorrectAttempts,
    });

    return true;
  },

  getProgress: (): ProgressResult => {
    const state = get();
    return deriveProgress(state.installedPal, state.connections);
  },

  restart: () => {
    set({
      installedPal: [],
      occupiedSlots: {},
      connections: [],
      history: {
        past: [],
        future: [],
      },
      incorrectAttempts: 0,
      lastFeedback: {
        ok: true,
        message: 'Assembly workspace reset to clean state.',
      },
    });

    clearSession();
  },

  reset: () => {
    get().restart();
  },
}));
