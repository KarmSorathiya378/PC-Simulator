import { describe, it, expect } from 'vitest';
import { components } from './components';
import { buildConfig, slots, compatibilityRules, requiredConnections } from './buildConfig';
import { quizQuestions } from './quiz';

describe('Data Layer & BuildConfig', () => {
  it('exports 8 real PC components', () => {
    expect(components).toHaveLength(8);
    const categories = components.map((c) => c.category);
    expect(categories).toContain('case');
    expect(categories).toContain('motherboard');
    expect(categories).toContain('cpu');
    expect(categories).toContain('cooler');
    expect(categories).toContain('ram');
    expect(categories).toContain('ssd');
    expect(categories).toContain('gpu');
    expect(categories).toContain('psu');
  });

  it('validates all required properties exist on each component', () => {
    components.forEach((c) => {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.description).toBeTruthy();
      expect(c.functionText).toBeTruthy();
      expect(c.locationText).toBeTruthy();
      expect(c.ruleText).toBeTruthy();
      expect(c.conceptText).toBeTruthy();
      expect(c.visual.width).toBeGreaterThan(0);
      expect(c.visual.height).toBeGreaterThan(0);
      expect(c.visual.color).toMatch(/^#/);
    });
  });

  it('provides complete slots, rules, and required connections in buildConfig', () => {
    expect(slots.length).toBeGreaterThanOrEqual(7);
    expect(compatibilityRules.length).toBeGreaterThanOrEqual(4);
    expect(requiredConnections.length).toBeGreaterThanOrEqual(2);
    expect(buildConfig.caseVisual.width).toBeGreaterThan(0);
    expect(buildConfig.caseVisual.height).toBeGreaterThan(0);
  });

  it('tests compatibility rules correctly', () => {
    const cpu = components.find((c) => c.category === 'cpu')!;
    const motherboard = components.find((c) => c.category === 'motherboard')!;
    const ram = components.find((c) => c.category === 'ram')!;
    const cooler = components.find((c) => c.category === 'cooler')!;
    const gpu = components.find((c) => c.category === 'gpu')!;
    const psu = components.find((c) => c.category === 'psu')!;
    const pcCase = components.find((c) => c.category === 'case')!;

    const cpuRule = compatibilityRules.find((r) => r.id === 'rule-cpu-socket-match')!;
    expect(cpuRule.check(cpu, motherboard)).toBe(true);

    const incompatibleCpu = { ...cpu, socket: 'LGA1700' };
    expect(cpuRule.check(incompatibleCpu, motherboard)).toBe(false);

    const ramRule = compatibilityRules.find((r) => r.id === 'rule-ram-ddr-match')!;
    expect(ramRule.check(ram, motherboard)).toBe(true);

    const incompatibleRam = { ...ram, ddr: 'DDR4' as const };
    expect(ramRule.check(incompatibleRam, motherboard)).toBe(false);

    const coolerRule = compatibilityRules.find((r) => r.id === 'rule-cooler-cpu-dependency')!;
    expect(coolerRule.check(cooler, cpu)).toBe(true);

    const gpuRule = compatibilityRules.find((r) => r.id === 'rule-gpu-pcie-slot')!;
    expect(gpuRule.check(gpu, motherboard)).toBe(true);

    const psuRule = compatibilityRules.find((r) => r.id === 'rule-psu-form-factor')!;
    expect(psuRule.check(psu, pcCase)).toBe(true);
  });

  it('contains at least 12 detailed quiz questions', () => {
    expect(quizQuestions.length).toBeGreaterThanOrEqual(12);
    quizQuestions.forEach((q) => {
      expect(['purpose', 'placement', 'compatibility', 'dependency']).toContain(q.topic);
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
      expect(q.explanation.length).toBeGreaterThan(10);
    });
  });
});
