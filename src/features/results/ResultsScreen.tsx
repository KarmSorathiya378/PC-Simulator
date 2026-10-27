import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Award,
  BarChart3,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Wrench,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Activity,
} from 'lucide-react';
import { useAssemblyStore } from '../../store/assemblyStore';
import { quizQuestions } from '../../data/quiz';
import { slots, requiredConnections } from '../../data/buildConfig';
import { calculateScore, getRemediationAdvice } from '../../utils/scoring';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { BrandBadge, GlowCard, GradientText, GlassPanel, Chip } from '../../components/ui';

export const ResultsScreen: React.FC = () => {
  const store = useAssemblyStore();
  const navigate = useNavigate();

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);

  const progress = store.getProgress();

  // Count correct quiz answers
  const quizCorrectCount = useMemo(() => {
    return Object.entries(userAnswers).filter(([id, answerIdx]) => {
      const q = quizQuestions.find((item) => item.id === id);
      return q && q.correctIndex === answerIdx;
    }).length;
  }, [userAnswers]);

  const scoreData = useMemo(() => {
    return calculateScore({
      installedCount: progress.installedCount,
      totalInstallable: slots.length,
      connectedCount: progress.connectedCount,
      totalConnections: requiredConnections.length,
      quizCorrectCount: submittedQuiz ? quizCorrectCount : 0,
      totalQuizQuestions: quizQuestions.length,
      incorrectAttempts: store.incorrectAttempts,
    });
  }, [progress.installedCount, progress.connectedCount, submittedQuiz, quizCorrectCount, store.incorrectAttempts]);

  const remediationAdvice = useMemo(() => {
    return getRemediationAdvice(store.incorrectAttempts);
  }, [store.incorrectAttempts]);

  const rank = useMemo(() => {
    const score = scoreData.totalScore;
    if (score >= 90) {
      return {
        title: 'Master System Architect',
        badgeVariant: 'emerald' as const,
        glowColor: 'emerald' as const,
        badgeBg: 'bg-emerald-600 text-white',
      };
    }
    if (score >= 75) {
      return {
        title: 'Certified Hardware Technician',
        badgeVariant: 'cyan' as const,
        glowColor: 'cyan' as const,
        badgeBg: 'bg-primary text-primary-foreground',
      };
    }
    if (score >= 60) {
      return {
        title: 'Junior PC Builder',
        badgeVariant: 'amber' as const,
        glowColor: 'amber' as const,
        badgeBg: 'bg-amber-600 text-white',
      };
    }
    return {
      title: 'Apprentice Hardware Student',
      badgeVariant: 'slate' as const,
      glowColor: 'violet' as const,
      badgeBg: 'bg-secondary text-secondary-foreground',
    };
  }, [scoreData.totalScore]);

  const handleSelectAnswer = (questionId: string, optionIdx: number) => {
    if (submittedQuiz) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleRestartAll = () => {
    if (window.confirm('Reset all assembly progress and quiz submissions to start fresh?')) {
      store.restart();
      setUserAnswers({});
      setSubmittedQuiz(false);
      setCurrentQuizIndex(0);
      navigate('/');
    }
  };

  const currentQ = quizQuestions[currentQuizIndex];

  return (
    <div className="space-y-8 py-2 w-full max-w-full overflow-hidden font-sans">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground border-b border-border/60 pb-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <Link to="/" className="hover:text-foreground transition-colors">
            Platform
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-semibold text-foreground">Assessment &amp; Results</span>
        </nav>
        <div className="flex items-center gap-2.5 font-mono text-[11px]">
          <BrandBadge variant="cyan" pulse>Academic Certification</BrandBadge>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-muted-foreground">Rubric v2.0 Standard</span>
        </div>
      </div>

      {/* Hero Scorecard Banner */}
      <GlowCard glowColor={rank.glowColor} className="p-6 sm:p-8 card-elevated">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2">
              <BrandBadge variant="cyan">
                <Award className="size-3 mr-1 inline" />
                FINAL ASSESSMENT // EVALUATION REPORT
              </BrandBadge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
              Build Performance &amp; <GradientText variant="cyan-violet">Scorecard</GradientText>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Comprehensive audit evaluating physical chassis placement, auxiliary power rail wiring,
              and academic hardware knowledge.
            </p>
          </div>

          {/* Big Score Stamp Medallion */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-primary/30 bg-card/90 backdrop-blur-xs shadow-md text-center min-w-[200px] shrink-0 card-elevated">
            <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground font-semibold">
              Final Composite Score
            </span>
            <div className="text-5xl sm:text-6xl font-black tracking-tight text-primary font-mono mt-1 font-display">
              {scoreData.totalScore}
              <span className="text-xl font-normal text-muted-foreground font-sans">/100</span>
            </div>
            <span className={`mt-2 text-xs font-bold px-3 py-1 rounded-full shadow-2xs font-mono uppercase tracking-wider ${rank.badgeBg}`}>
              {rank.title}
            </span>
          </div>
        </div>

        {/* 3 Rubric Metrics Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/60">
          <div className="p-4 rounded-xl border border-border/80 bg-card/80 backdrop-blur-xs shadow-2xs space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase tracking-wider font-mono text-muted-foreground">
                1. Hardware Assembly
              </span>
              <span className="font-mono font-bold text-foreground">
                {scoreData.assemblyScore} / {scoreData.maxAssemblyScore} pts
              </span>
            </div>
            <Progress value={(scoreData.assemblyScore / scoreData.maxAssemblyScore) * 100} className="h-2" />
            <span className="text-[11px] text-muted-foreground block font-mono">
              {progress.installedCount} of {slots.length} core parts seated
            </span>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-card/80 backdrop-blur-xs shadow-2xs space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase tracking-wider font-mono text-muted-foreground">
                2. Power Rail Cabling
              </span>
              <span className="font-mono font-bold text-foreground">
                {scoreData.connectionScore} / {scoreData.maxConnectionScore} pts
              </span>
            </div>
            <Progress value={(scoreData.connectionScore / scoreData.maxConnectionScore) * 100} className="h-2" />
            <span className="text-[11px] text-muted-foreground block font-mono">
              {progress.connectedCount} of {requiredConnections.length} power harnesses latched
            </span>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-card/80 backdrop-blur-xs shadow-2xs space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase tracking-wider font-mono text-muted-foreground">
                3. Technical Quiz
              </span>
              <span className="font-mono font-bold text-foreground">
                {submittedQuiz ? `${scoreData.quizScore} / ${scoreData.maxQuizScore} pts` : 'Pending Submission'}
              </span>
            </div>
            <Progress
              value={submittedQuiz ? (scoreData.quizScore / scoreData.maxQuizScore) * 100 : 0}
              className="h-2"
            />
            <span className="text-[11px] text-muted-foreground block font-mono">
              {submittedQuiz
                ? `${quizCorrectCount} of ${quizQuestions.length} questions correct`
                : 'Complete the questions below to earn points'}
            </span>
          </div>
        </div>
      </GlowCard>

      {/* Two Column Layout: Quiz on Left, Remediation & Actions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Knowledge Assessment Quiz */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-border/80 bg-card shadow-xs card-elevated">
            <CardHeader className="space-y-3 pb-4 border-b border-border/60">
              <div className="flex items-center justify-between">
                <BrandBadge variant="cyan">
                  Question {currentQuizIndex + 1} of {quizQuestions.length}
                </BrandBadge>
                <span className="text-xs text-muted-foreground font-mono">
                  Topic: <strong className="text-foreground capitalize">{currentQ.topic}</strong>
                </span>
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-snug font-display">
                {currentQ.question}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 pt-4">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx;
                const isCorrect = currentQ.correctIndex === idx;

                let stateClasses = 'border-border/80 bg-card hover:border-border-strong hover:bg-card/70';
                if (submittedQuiz) {
                  if (isCorrect) {
                    stateClasses = 'border-emerald-500/50 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500/30 shadow-xs font-bold';
                  } else if (isSelected && !isCorrect) {
                    stateClasses = 'border-destructive/50 bg-destructive/15 text-destructive ring-1 ring-destructive/30 line-through';
                  }
                } else if (isSelected) {
                  stateClasses = 'border-primary/50 bg-primary/15 text-primary ring-1 ring-primary/30 shadow-xs font-bold';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectAnswer(currentQ.id, idx)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all duration-150 pressable-element ${stateClasses}`}
                  >
                    <div
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-mono font-bold mt-0.5 ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground shadow-2xs'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                    {submittedQuiz && isCorrect && (
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {submittedQuiz && isSelected && !isCorrect && (
                      <XCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                    )}
                  </div>
                );
              })}

              {/* Instant Explanation Box when submitted */}
              {submittedQuiz && (
                <div className="mt-4 p-4 rounded-xl border border-primary/30 bg-primary/10 text-xs text-foreground space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1.5 font-bold text-primary font-mono text-[11px] uppercase tracking-wider">
                    <Sparkles className="size-3.5 text-primary" />
                    <span>Technical Architecture Explanation</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border/60 pt-4 bg-muted/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentQuizIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuizIndex === 0}
                className="text-xs pressable-element"
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {!submittedQuiz ? (
                  currentQuizIndex < quizQuestions.length - 1 ? (
                    <Button
                      size="sm"
                      onClick={() => setCurrentQuizIndex((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
                      className="text-xs gap-1.5 font-semibold pressable-element"
                    >
                      <span>Next Question</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setSubmittedQuiz(true)}
                      className="text-xs gap-1.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs pressable-element"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Submit Quiz for Grading</span>
                    </Button>
                  )
                ) : (
                  currentQuizIndex < quizQuestions.length - 1 && (
                    <Button
                      size="sm"
                      onClick={() => setCurrentQuizIndex((prev) => prev + 1)}
                      className="text-xs gap-1.5 font-semibold pressable-element"
                    >
                      <span>Next Review</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  )
                )}
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column: Remediation Advice & Actions */}
        <div className="lg:col-span-5 space-y-4">
          {/* Remediation Advice Card */}
          <Card className="border-border/80 bg-card shadow-xs card-elevated">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <AlertTriangle className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold tracking-tight text-foreground font-display">
                    Diagnostic Remediation Advice
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Targeted guidance based on recorded assembly mistakes.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs text-muted-foreground pt-4">
              {remediationAdvice.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-muted/20"
                >
                  <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-foreground/90">{tip}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Action Navigation Deck */}
          <Card className="border-border/80 bg-card shadow-xs p-5 space-y-3.5 card-elevated">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Recommended Next Actions
            </h4>

            <div className="space-y-2">
              <Link to="/guided" className="block w-full">
                <Button variant="outline" className="w-full justify-between text-xs h-9 pressable-element">
                  <span className="flex items-center gap-2">
                    <Wrench className="size-3.5 text-primary" />
                    <span>Practice in Guided 3D Mode</span>
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Button>
              </Link>

              <Link to="/challenge" className="block w-full">
                <Button variant="outline" className="w-full justify-between text-xs h-9 pressable-element">
                  <span className="flex items-center gap-2">
                    <Trophy className="size-3.5 text-amber-500" />
                    <span>Retake Assembly Challenge</span>
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Button>
              </Link>

              <Link to="/learn" className="block w-full">
                <Button variant="outline" className="w-full justify-between text-xs h-9 pressable-element">
                  <span className="flex items-center gap-2">
                    <BookOpen className="size-3.5 text-blue-500" />
                    <span>Browse Component Catalog</span>
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Button>
              </Link>
            </div>

            <div className="pt-2 border-t border-border/60">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRestartAll}
                className="w-full gap-2 text-xs pressable-element"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset All &amp; Start Over</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
