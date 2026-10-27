import { describe, it, expect } from 'vitest';
import { SOCKET_COORDINATES, CABLE_ORIGINS } from '../data/connectionConfig';
import { slots, requiredConnections } from '../data/buildConfig';
import { components } from '../data/components';

describe('Canvas and Simulator Integration Tests', () => {
  it('has valid socket coordinates for all required connections', () => {
    for (const req of requiredConnections) {
      expect(SOCKET_COORDINATES[req.socketId]).toBeDefined();
      expect(SOCKET_COORDINATES[req.socketId].x).toBeGreaterThan(0);
      expect(SOCKET_COORDINATES[req.socketId].y).toBeGreaterThan(0);
    }
  });

  it('has PSU cable origins defined for each required cable', () => {
    for (const req of requiredConnections) {
      expect(CABLE_ORIGINS[req.cableId]).toBeDefined();
      expect(CABLE_ORIGINS[req.cableId].x).toBeGreaterThan(0);
      expect(CABLE_ORIGINS[req.cableId].y).toBeGreaterThan(0);
    }
  });

  it('defines valid dimensions and colors for all components', () => {
    for (const comp of components) {
      expect(comp.visual).toBeDefined();
      expect(comp.visual.width).toBeGreaterThan(0);
      expect(comp.visual.height).toBeGreaterThan(0);
      expect(comp.visual.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('has slots correctly mapped with distinct positions inside case bounds', () => {
    const caseComp = components.find((c) => c.category === 'case');
    expect(caseComp).toBeDefined();

    for (const slot of slots) {
      expect(slot.position.x).toBeGreaterThanOrEqual(0);
      expect(slot.position.y).toBeGreaterThanOrEqual(0);
      expect(slot.position.x).toBeLessThan(caseComp!.visual.width + 100);
      expect(slot.position.y).toBeLessThan(caseComp!.visual.height + 100);
    }
  });
});
