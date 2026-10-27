import { describe, it, expect, beforeEach } from 'vitest';
import { useAssemblyStore } from './assemblyStore';
import { calculateScore, calculateAssemblyScore, calculateConnectionScore, calculateQuizScore } from '../utils/scoring';
import { saveSession, loadSession, clearSession, saveRawSession } from '../utils/persistence';

describe('AssemblyStore and Simulation Utilities', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAssemblyStore.getState().restart();
    clearSession();
  });

  describe('useAssemblyStore', () => {
    it('initializes with default explore mode and empty slots', () => {
      const state = useAssemblyStore.getState();
      expect(state.mode).toBe('explore');
      expect(state.installedPal).toHaveLength(0);
      expect(Object.keys(state.occupiedSlots)).toHaveLength(0);
      expect(state.connections).toHaveLength(0);
      expect(state.incorrectAttempts).toBe(0);
    });

    it('changes modes cleanly', () => {
      useAssemblyStore.getState().startMode('assemble');
      expect(useAssemblyStore.getState().mode).toBe('assemble');
    });

    it('records incorrect attempt and rejects invalid placement', () => {
      const store = useAssemblyStore.getState();
      // Trying to install CPU directly without motherboard
      const result = store.installComponent('cpu-ryzen-7800x3d', 'slot-cpu');
      expect(result.ok).toBe(false);

      const updated = useAssemblyStore.getState();
      expect(updated.incorrectAttempts).toBe(1);
      expect(updated.installedPal).toHaveLength(0);
      expect(updated.lastFeedback?.ok).toBe(false);
    });

    it('installs motherboard correctly and tracks occupied slots', () => {
      const store = useAssemblyStore.getState();
      const result = store.installComponent('motherboard-b650-01', 'slot-motherboard');
      expect(result.ok).toBe(true);

      const state = useAssemblyStore.getState();
      expect(state.installedPal).toEqual([
        { componentId: 'motherboard-b650-01', slotId: 'slot-motherboard' },
      ]);
      expect(state.occupiedSlots['slot-motherboard']).toBe('motherboard-b650-01');
    });

    it('supports undo and redo', () => {
      const store = useAssemblyStore.getState();
      store.installComponent('motherboard-b650-01', 'slot-motherboard');
      expect(useAssemblyStore.getState().installedPal).toHaveLength(1);

      // Undo
      const undoResult = useAssemblyStore.getState().undo();
      expect(undoResult).toBe(true);
      expect(useAssemblyStore.getState().installedPal).toHaveLength(0);
      expect(useAssemblyStore.getState().occupiedSlots['slot-motherboard']).toBeUndefined();

      // Redo
      const redoResult = useAssemblyStore.getState().redo();
      expect(redoResult).toBe(true);
      expect(useAssemblyStore.getState().installedPal).toHaveLength(1);
      expect(useAssemblyStore.getState().occupiedSlots['slot-motherboard']).toBe('motherboard-b650-01');
    });

    it('removes component and cascades dependent items and cables', () => {
      const store = useAssemblyStore.getState();
      store.installComponent('motherboard-b650-01', 'slot-motherboard');
      store.installComponent('cpu-ryzen-7800x3d', 'slot-cpu');
      store.installComponent('cooler-peerless-assassin', 'slot-cooler');

      expect(useAssemblyStore.getState().installedPal).toHaveLength(3);

      // Remove CPU -> cooler should also be removed
      const removed = useAssemblyStore.getState().removeComponent('cpu-ryzen-7800x3d');
      expect(removed).toBe(true);

      const state = useAssemblyStore.getState();
      expect(state.installedPal).toHaveLength(1);
      expect(state.installedPal[0].componentId).toBe('motherboard-b650-01');
    });

    it('connects power cables and updates connections', () => {
      const store = useAssemblyStore.getState();
      const res = store.connect('cable-24pin-atx', 'socket-mb-24pin');
      expect(res.ok).toBe(true);
      expect(useAssemblyStore.getState().connections).toEqual([
        { cableId: 'cable-24pin-atx', socketId: 'socket-mb-24pin' },
      ]);
    });

    it('computes derived progress accurately', () => {
      const store = useAssemblyStore.getState();
      store.installComponent('motherboard-b650-01', 'slot-motherboard');
      const progress = store.getProgress();
      expect(progress.installedCount).toBe(1);
      expect(progress.totalInstallable).toBe(7);
      expect(progress.percent).toBe(10); // 1 / 10 = 10%
    });
  });

  describe('Scoring Utility', () => {
    it('calculates assembly score correctly (max 60)', () => {
      expect(calculateAssemblyScore(0, 7)).toBe(0);
      expect(calculateAssemblyScore(7, 7)).toBe(60);
      expect(calculateAssemblyScore(3, 7)).toBe(26);
    });

    it('calculates connection score correctly (max 20)', () => {
      expect(calculateConnectionScore(0, 3)).toBe(0);
      expect(calculateConnectionScore(3, 3)).toBe(20);
    });

    it('calculates quiz score correctly (max 20)', () => {
      expect(calculateQuizScore(0, 5)).toBe(0);
      expect(calculateQuizScore(5, 5)).toBe(20);
    });

    it('calculates total score and complete breakdown with remediation', () => {
      const result = calculateScore({
        installedCount: 7,
        totalInstallable: 7,
        connectedCount: 3,
        totalConnections: 3,
        quizCorrectCount: 5,
        totalQuizQuestions: 5,
        incorrectAttempts: 2,
      });

      expect(result.assemblyScore).toBe(60);
      expect(result.connectionScore).toBe(20);
      expect(result.quizScore).toBe(20);
      expect(result.totalScore).toBe(100);
      expect(result.isBuildFullyComplete).toBe(true);
      expect(result.remediationAdvice.length).toBeGreaterThan(0);
    });
  });

  describe('Persistence Utility', () => {
    it('saves and loads versioned session data', () => {
      const sampleState = {
        mode: 'assemble' as const,
        installedPal: [{ componentId: 'motherboard-b650-01', slotId: 'slot-motherboard' }],
        occupiedSlots: { 'slot-motherboard': 'motherboard-b650-01' },
        connections: [{ cableId: 'cable-24pin-atx', socketId: 'socket-mb-24pin' }],
        incorrectAttempts: 1,
      };

      const saved = saveSession(sampleState);
      expect(saved).toBe(true);

      const loaded = loadSession();
      expect(loaded).not.toBeNull();
      expect(loaded?.version).toBe(1);
      expect(loaded?.mode).toBe('assemble');
      expect(loaded?.installedPal).toHaveLength(1);
      expect(loaded?.progress.installedCount).toBe(1);
      expect(loaded?.progress.connectedCount).toBe(1);
    });

    it('returns null on version mismatch', () => {
      saveSession({ mode: 'assemble' });
      // Tamper with session version
      saveRawSession(JSON.stringify({ version: 999, installedPal: [] }));

      const loaded = loadSession();
      expect(loaded).toBeNull();
    });

    it('clears session cleanly', () => {
      saveSession({ mode: 'assemble' });
      clearSession();
      expect(loadSession()).toBeNull();
    });
  });
});
