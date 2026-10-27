import { describe, it, expect } from 'vitest';
import { components } from '../data/components';
import { quizQuestions } from '../data/quiz';
import { slots, requiredConnections } from '../data/buildConfig';
import { calculateScore, getRemediationAdvice } from '../utils/scoring';

describe('Feature Screens Integration & Domain Logic', () => {
  it('supplies complete component catalogue for Learn Mode', () => {
    expect(components.length).toBeGreaterThanOrEqual(8);
    for (const comp of components) {
      expect(comp.id).toBeTruthy();
      expect(comp.name).toBeTruthy();
      expect(comp.category).toBeTruthy();
      expect(comp.description).toBeTruthy();
      expect(comp.functionText).toBeTruthy();
      expect(comp.locationText).toBeTruthy();
      expect(comp.ruleText).toBeTruthy();
      expect(comp.conceptText).toBeTruthy();
    }
  });

  it('provides comprehensive hardware quiz questions for Results & Assessment', () => {
    expect(quizQuestions.length).toBeGreaterThanOrEqual(10);
    for (const q of quizQuestions) {
      expect(q.id).toBeTruthy();
      expect(q.topic).toMatch(/^(purpose|placement|compatibility|dependency)$/);
      expect(q.options.length).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.explanation.length).toBeGreaterThan(10);
    }
  });

  it('evaluates perfect score when assembly, cabling, and quiz are 100% correct', () => {
    const perfectScore = calculateScore({
      installedCount: slots.length,
      totalInstallable: slots.length,
      connectedCount: requiredConnections.length,
      totalConnections: requiredConnections.length,
      quizCorrectCount: quizQuestions.length,
      totalQuizQuestions: quizQuestions.length,
      incorrectAttempts: 0,
    });

    expect(perfectScore.assemblyScore).toBe(60);
    expect(perfectScore.connectionScore).toBe(20);
    expect(perfectScore.quizScore).toBe(20);
    expect(perfectScore.totalScore).toBe(100);
    expect(perfectScore.isBuildFullyComplete).toBe(true);
  });

  it('correctly handles partial builds with deductions for incorrect attempts', () => {
    const partialScore = calculateScore({
      installedCount: 4,
      totalInstallable: 7,
      connectedCount: 1,
      totalConnections: 3,
      quizCorrectCount: 5,
      totalQuizQuestions: 10,
      incorrectAttempts: 3,
    });

    expect(partialScore.assemblyScore).toBeLessThan(60);
    expect(partialScore.connectionScore).toBeLessThan(20);
    expect(partialScore.quizScore).toBe(10);
    expect(partialScore.incorrectAttempts).toBe(3);
    expect(partialScore.isBuildFullyComplete).toBe(false);
  });

  it('generates constructive remediation advice when errors occur', () => {
    const adviceWithMistakes = getRemediationAdvice(4);
    expect(adviceWithMistakes.length).toBeGreaterThan(1);
    expect(adviceWithMistakes[0]).toContain('4');

    const cleanAdvice = getRemediationAdvice(0);
    expect(cleanAdvice[0]).toContain('Zero incorrect');
  });
});
