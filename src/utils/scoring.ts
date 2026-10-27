import { requiredConnections as defaultConnections } from '../data/buildConfig';
import { quizQuestions as defaultQuizQuestions } from '../data/quiz';

export const MAX_ASSEMBLY_SCORE = 60;
export const MAX_CONNECTION_SCORE = 20;
export const MAX_QUIZ_SCORE = 20;
export const MAX_TOTAL_SCORE = 100;

export interface ScoreBreakdown {
  assemblyScore: number;
  maxAssemblyScore: number;
  connectionScore: number;
  maxConnectionScore: number;
  quizScore: number;
  maxQuizScore: number;
  totalScore: number;
  maxTotalScore: number;
  percentage: number;
  incorrectAttempts: number;
  remediationAdvice: string[];
  isAssemblyComplete: boolean;
  isConnectionsComplete: boolean;
  isQuizComplete: boolean;
  isBuildFullyComplete: boolean;
}

export interface ScoreInput {
  installedCount: number;
  totalInstallable?: number;
  connectedCount: number;
  totalConnections?: number;
  quizCorrectCount?: number;
  totalQuizQuestions?: number;
  incorrectAttempts?: number;
}

/**
 * Calculates assembly score (0 - 60 points) based on installed components.
 */
export function calculateAssemblyScore(
  installedCount: number,
  totalInstallable: number = 7
): number {
  if (totalInstallable <= 0) return 0;
  const clampedCount = Math.max(0, Math.min(installedCount, totalInstallable));
  return Math.round((clampedCount / totalInstallable) * MAX_ASSEMBLY_SCORE);
}

/**
 * Calculates connection score (0 - 20 points) based on completed required connections.
 */
export function calculateConnectionScore(
  connectedCount: number,
  totalConnections: number = defaultConnections.length
): number {
  if (totalConnections <= 0) return 0;
  const clampedCount = Math.max(0, Math.min(connectedCount, totalConnections));
  return Math.round((clampedCount / totalConnections) * MAX_CONNECTION_SCORE);
}

/**
 * Calculates knowledge quiz score (0 - 20 points) based on correct answers.
 */
export function calculateQuizScore(
  quizCorrectCount: number,
  totalQuestions: number = defaultQuizQuestions.length
): number {
  if (totalQuestions <= 0) return 0;
  const clampedCount = Math.max(0, Math.min(quizCorrectCount, totalQuestions));
  return Math.round((clampedCount / totalQuestions) * MAX_QUIZ_SCORE);
}

/**
 * Generates actionable remediation recommendations based on incorrect placement attempts.
 */
export function getRemediationAdvice(
  incorrectAttempts: number,
  specificIssues: string[] = []
): string[] {
  const tips: string[] = [];

  if (incorrectAttempts === 0) {
    tips.push('Excellent precision! Zero incorrect placement attempts were recorded.');
    return tips;
  }

  tips.push(
    `Total incorrect placement attempts: ${incorrectAttempts}. Review component installation rules before placing parts.`
  );

  if (specificIssues.length > 0) {
    for (const issue of specificIssues) {
      tips.push(`Remediation: ${issue}`);
    }
  } else {
    tips.push(
      'Tip: The motherboard must be mounted before seating CPU, cooler, RAM, or expansion cards.'
    );
    tips.push(
      'Tip: A CPU cooler cannot be mounted until the processor is seated in the socket.'
    );
    tips.push(
      'Tip: Check DDR generations (DDR4 vs DDR5) and socket specifications (AM5 vs LGA1700) for hardware compatibility.'
    );
  }

  return tips;
}

/**
 * Primary scoring function: computes total score and complete category breakdown.
 */
export function calculateScore(input: ScoreInput): ScoreBreakdown {
  const totalInstallable = input.totalInstallable ?? 7;
  const totalConnections = input.totalConnections ?? defaultConnections.length;
  const totalQuizQuestions = input.totalQuizQuestions ?? defaultQuizQuestions.length;
  const incorrectAttempts = input.incorrectAttempts ?? 0;
  const quizCorrectCount = input.quizCorrectCount ?? 0;

  const assemblyScore = calculateAssemblyScore(input.installedCount, totalInstallable);
  const connectionScore = calculateConnectionScore(input.connectedCount, totalConnections);
  const quizScore = calculateQuizScore(quizCorrectCount, totalQuizQuestions);

  const totalScore = Math.min(
    MAX_TOTAL_SCORE,
    assemblyScore + connectionScore + quizScore
  );

  const percentage = Math.round((totalScore / MAX_TOTAL_SCORE) * 100);

  const isAssemblyComplete = input.installedCount >= totalInstallable;
  const isConnectionsComplete = input.connectedCount >= totalConnections;
  const isQuizComplete = quizCorrectCount > 0 && totalQuizQuestions > 0;
  const isBuildFullyComplete = isAssemblyComplete && isConnectionsComplete;

  const remediationAdvice = getRemediationAdvice(incorrectAttempts);

  return {
    assemblyScore,
    maxAssemblyScore: MAX_ASSEMBLY_SCORE,
    connectionScore,
    maxConnectionScore: MAX_CONNECTION_SCORE,
    quizScore,
    maxQuizScore: MAX_QUIZ_SCORE,
    totalScore,
    maxTotalScore: MAX_TOTAL_SCORE,
    percentage,
    incorrectAttempts,
    remediationAdvice,
    isAssemblyComplete,
    isConnectionsComplete,
    isQuizComplete,
    isBuildFullyComplete,
  };
}

/**
 * Alias for calculateScore.
 */
export const calculateTotalScore = calculateScore;
