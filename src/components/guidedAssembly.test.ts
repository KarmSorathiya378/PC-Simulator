import { describe, it, expect, beforeEach } from 'vitest';
import { GUIDED_STEPS, CATEGORY_TO_3D } from './guidedAssemblyTypes';
import { slots } from '../data/buildConfig';
import { components } from '../data/components';
import { useAssemblyStore } from '../store/assemblyStore';

describe('Guided Assembly Integration & Logic', () => {
  beforeEach(() => {
    useAssemblyStore.getState().reset();
  });

  it('defines logical step order covering standard hardware build', () => {
    expect(GUIDED_STEPS.length).toBeGreaterThanOrEqual(7);

    // Initial step should be Motherboard
    expect(GUIDED_STEPS[0].slotId).toBe('slot-motherboard');
    expect(GUIDED_STEPS[0].componentId).toBe('motherboard-b650-01');

    // All steps map to valid known slot IDs
    for (const step of GUIDED_STEPS) {
      expect(slots.some((s) => s.id === step.slotId)).toBe(true);
      expect(components.some((c) => c.id === step.componentId)).toBe(true);
      expect(step.title).toBeTruthy();
      expect(step.hint).toBeTruthy();
    }
  });

  it('correctly maps component categories to 3D hardware part types', () => {
    expect(CATEGORY_TO_3D['cpu']).toBe('cpu');
    expect(CATEGORY_TO_3D['gpu']).toBe('gpu');
    expect(CATEGORY_TO_3D['ram']).toBe('ram');
    expect(CATEGORY_TO_3D['motherboard']).toBe('motherboard');
    expect(CATEGORY_TO_3D['psu']).toBe('psu');
    expect(CATEGORY_TO_3D['cooler']).toBe('fan');
    expect(CATEGORY_TO_3D['ssd']).toBe('ssd');
  });

  it('dynamically tracks active slot and completed slots as components are installed', () => {
    const store = useAssemblyStore.getState();

    // Initially no occupied slots
    expect(Object.keys(store.occupiedSlots).length).toBe(0);

    // Initial active step is motherboard
    let currentStep = GUIDED_STEPS.find((step) => !store.occupiedSlots[step.slotId]) || GUIDED_STEPS[GUIDED_STEPS.length - 1];
    expect(currentStep.slotId).toBe('slot-motherboard');

    // Install motherboard
    store.installComponent('motherboard-b650-01', 'slot-motherboard');

    // Completed slots should now contain slot-motherboard
    const completedSlotIds = Object.keys(useAssemblyStore.getState().occupiedSlots).filter(
      (id) => Boolean(useAssemblyStore.getState().occupiedSlots[id])
    );
    expect(completedSlotIds).toContain('slot-motherboard');

    // Next recommended active slot should advance to CPU
    const nextStep = GUIDED_STEPS.find((step) => !useAssemblyStore.getState().occupiedSlots[step.slotId]);
    expect(nextStep?.slotId).toBe('slot-cpu');
  });
});
