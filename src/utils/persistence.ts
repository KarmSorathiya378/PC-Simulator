import { deriveProgress, type ProgressResult, type InstalledPart, type ConnectionPair } from '../simulator/assemblyRules';

export const SESSION_STORAGE_KEY = 'pcsim-session-v1';
export const CURRENT_SESSION_VERSION = 1;

export type SimulatorMode = 'explore' | 'assemble' | 'challenge' | 'connection' | 'assessment';

export interface SavedSessionState {
  version: number;
  savedAt: string;
  mode: SimulatorMode;
  installedPal: InstalledPart[];
  occupiedSlots: Record<string, string>;
  connections: ConnectionPair[];
  incorrectAttempts: number;
  quizAnswers?: Record<string, number>;
  progress: ProgressResult;
}

// In-memory fallback map for non-browser / server / headless test environments
const memoryStore = new Map<string, string>();

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis && (globalThis as unknown as { localStorage: Storage }).localStorage) {
    return (globalThis as unknown as { localStorage: Storage }).localStorage;
  }
  return {
    getItem: (key: string): string | null => memoryStore.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      memoryStore.set(key, value);
    },
    removeItem: (key: string): void => {
      memoryStore.delete(key);
    },
  };
}

/**
 * Persists the current simulation engine session state to LocalStorage (or memory storage fallback).
 * Saves under the versioned key 'pcsim-session-v1'.
 */
export function saveSession(state: {
  mode?: SimulatorMode;
  installedPal?: InstalledPart[];
  occupiedSlots?: Record<string, string>;
  connections?: ConnectionPair[];
  incorrectAttempts?: number;
  quizAnswers?: Record<string, number>;
}): boolean {
  try {
    const storage = getStorage();
    if (!storage) return false;

    const installed = state.installedPal || [];
    const connections = state.connections || [];
    const progress = deriveProgress(installed, connections);

    const sessionPayload: SavedSessionState = {
      version: CURRENT_SESSION_VERSION,
      savedAt: new Date().toISOString(),
      mode: state.mode || 'assemble',
      installedPal: installed,
      occupiedSlots: state.occupiedSlots || {},
      connections,
      incorrectAttempts: state.incorrectAttempts || 0,
      quizAnswers: state.quizAnswers,
      progress,
    };

    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));
    return true;
  } catch (err) {
    console.warn('[Persistence] Failed to save simulation session:', err);
    return false;
  }
}

/**
 * Loads and restores the saved simulation session from LocalStorage.
 * Validates version matching ('pcsim-session-v1') and automatically
 * recomputes derived progress upon restoration.
 */
export function loadSession(): SavedSessionState | null {
  try {
    const storage = getStorage();
    if (!storage) return null;

    const rawData = storage.getItem(SESSION_STORAGE_KEY);
    if (!rawData) {
      return null;
    }

    const parsed = JSON.parse(rawData);

    // Validate version integrity
    if (!parsed || parsed.version !== CURRENT_SESSION_VERSION) {
      console.info(
        `[Persistence] Version mismatch or corrupt session. Expected v${CURRENT_SESSION_VERSION}, got:`,
        parsed?.version
      );
      return null;
    }

    const installedPal: InstalledPart[] = Array.isArray(parsed.installedPal)
      ? parsed.installedPal
      : [];
    const connections: ConnectionPair[] = Array.isArray(parsed.connections)
      ? parsed.connections
      : [];
    const occupiedSlots: Record<string, string> =
      parsed.occupiedSlots && typeof parsed.occupiedSlots === 'object'
        ? parsed.occupiedSlots
        : {};

    // Derive fresh progress after restore
    const progress = deriveProgress(installedPal, connections);

    const restoredSession: SavedSessionState = {
      version: CURRENT_SESSION_VERSION,
      savedAt: parsed.savedAt || new Date().toISOString(),
      mode: parsed.mode || 'assemble',
      installedPal,
      occupiedSlots,
      connections,
      incorrectAttempts: typeof parsed.incorrectAttempts === 'number' ? parsed.incorrectAttempts : 0,
      quizAnswers: parsed.quizAnswers,
      progress,
    };

    return restoredSession;
  } catch (err) {
    console.warn('[Persistence] Failed to parse saved session:', err);
    return null;
  }
}

/**
 * Clears the saved simulation session from LocalStorage.
 */
export function clearSession(): boolean {
  try {
    const storage = getStorage();
    if (!storage) return false;
    storage.removeItem(SESSION_STORAGE_KEY);
    return true;
  } catch (err) {
    console.warn('[Persistence] Failed to clear session:', err);
    return false;
  }
}

/**
 * Direct write helper primarily for testing corrupted payloads or version migrations.
 */
export function saveRawSession(rawJson: string): void {
  try {
    const storage = getStorage();
    storage.setItem(SESSION_STORAGE_KEY, rawJson);
  } catch (err) {
    console.warn('[Persistence] Failed to write raw session:', err);
  }
}

/**
 * Checks if a valid saved session exists in storage.
 */
export function hasSavedSession(): boolean {
  return loadSession() !== null;
}
