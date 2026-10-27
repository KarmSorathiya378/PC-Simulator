import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Award,
  BarChart3,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Wrench,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAssemblyStore } from '../../store/assemblyStore';
import { quizQuestions } from '../../data/quiz';
import { slots, requiredConnections } from '../../data/buildConfig';
import { calculateScore, getRemediationAdvice } from '../../utils/scoring';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';

export const ResultsScreen: React.FC = () => {
  const store = useAssemblyStore();
  const navigate = useNavigate();

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);

  const progress = store.getProgress();

  // Count correct quiz answers
  const quizCorrectCount = Object.entries(userAnswers).filter(
    ([id, answerIdx]) => {
      const q = quizQuestions.find((item) => item.id === id);
      return q && q.correctIndex === answerIdx;
    }
  ).length;

  const scoreData = calculateScore({
    installedCount: progress.installedCount,
    totalInstallable: slots.length,
    connectedCount: progress.connectedCount,
    totalConnections: requiredConnections.length,
    quizCorrectCount: submittedQuiz ? quizCorrectCount : 0,
    totalQuizQuestions: quizQuestions.length,
    incorrectAttempts: store.incorrectAttempts,
  });

  const remediationAdvice = getRemediationAdvice(store.incorrectAttempts);

  const getRankBadge = (score: number) => {
    if (score >= 90) return { title: 'Master PC System Architect', color: 'bg-emerald-500 text-white' };
    if (score >= 75) return { title: 'Certified Hardware Technician', color: 'bg-blue-500 text-white' };
    if (score >= 60) return { title: 'Junior PC Builder', color: 'bg-amber-500 text-white' };
    return { title: 'Apprentice Hardware Student', color: 'bg-secondary text-secondary-foreground' };
  };

  const rank = getRankBadge(scoreData.totalScore);

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
  const isCurrentAnswered = userAnswers[currentQ.id] !== undefined;

  return (
    <div className="space-y-6 py-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Results &amp; Scorecard</span>
      </div>

      {/* Hero Scorecard Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-muted/20 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Award className="size-3.5" />
              <span>Assessment &amp; Performance Report</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Build Performance Scorecard
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Comprehensive evaluation of hardware placement accuracy, power rail cabling, and technical hardware knowledge.
            </p>
          </div>

          {/* Big Score Stamp */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-primary/30 bg-card/80 shadow-md text-center min-w-[180px]">
            <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground">Final Score</span>
            <div className="text-5xl font-black tracking-tight text-primary font-mono mt-1">
              {scoreData.totalScore}
              <span className="text-xl font-normal text-muted-foreground">/100</span>
            </div>
            <Badge className={`mt-2 text-xs font-semibold ${rank.color}`}>
              {rank.title}
            </Badge>
          </div>
        </div>

        {/* 3 Rubric Metrics Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/60">
          <div className="p-3.5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-muted-foreground">1. Component Assembly</span>
              <span className="font-mono font-bold text-foreground">
                {scoreData.assemblyScore} / {scoreData.maxAssemblyScore} pts
              </span>
            </div>
            <Progress value={(scoreData.assemblyScore / scoreData.maxAssemblyScore) * 100} className="h-2" />
            <span className="text-[11px] text-muted-foreground block">
              {progress.installedCount} of {slots.length} chassis components installed
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-muted-foreground">2. Power Cable Routing</span>
              <span className="font-mono font-bold text-foreground">
                {scoreData.connectionScore} / {scoreData.maxConnectionScore} pts
              </span>
            </div>
            <Progress value={(scoreData.connectionScore / scoreData.maxConnectionScore) * 100} className="h-2" />
            <span className="text-[11px] text-muted-foreground block">
              {progress.connectedCount} of {requiredConnections.length} power rails latched
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-muted-foreground">3. Technical Knowledge Quiz</span>
              <span className="font-mono font-bold text-foreground">
                {submittedQuiz ? `${scoreData.quizScore} / ${scoreData.maxQuizScore} pts` : 'Pending Submission'}
              </span>
            </div>
            <Progress
              value={submittedQuiz ? (scoreData.quizScore / scoreData.maxQuizScore) * 100 : 0}
              className="h-2"
            />
            <span className="text-[11px] text-muted-foreground block">
              {submittedQuiz
                ? `${quizCorrectCount} of ${quizQuestions.length} questions answered correctly`
                : 'Complete the 10 questions below to earn points'}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Quiz on Left, Remediation & Actions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Knowledge Assessment Quiz */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-xs">
                  Question {currentQuizIndex + 1} of {quizQuestions.length}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  Topic: <strong className="text-foreground capitalize">{currentQ.topic}</strong>
                </span>
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-snug">
                {currentQ.question}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx;
                const isCorrect = currentQ.correctIndex === idx;

                let stateClasses = 'border-border/80 bg-card hover:border-border';
                if (submittedQuiz) {
                  if (isCorrect) {
                    stateClasses = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    stateClasses = 'border-destructive bg-destructive/10 text-destructive line-through';
                  }
                } else if (isSelected) {
                  stateClasses = 'border-primary bg-primary/10 ring-1 ring-primary/30 font-semibold';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectAnswer(currentQ.id, idx)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all active:scale-[0.99] ${stateClasses}`}
                  >
                    <div
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-mono font-bold mt-0.5 ${
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-muted-foreground'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                    {submittedQuiz && isCorrect && (
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    )}
                    {submittedQuiz && isSelected && !isCorrect && (
                      <XCircle className="size-4 text-destructive shrink-0" />
                    )}
                  </div>
                );
              })}

              {/* Instant Explanation Box when submitted */}
              {submittedQuiz && (
                <div className="mt-4 p-3.5 rounded-lg border border-primary/20 bg-primary/5 text-xs text-foreground space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <Sparkles className="size-3.5" />
                    <span>Hardware Insight:</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border/60 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentQuizIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuizIndex === 0}
                className="text-xs"
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {!submittedQuiz ? (
                  currentQuizIndex < quizQuestions.length - 1 ? (
                    <Button
                      size="sm"
                      onClick={() => setCurrentQuizIndex((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
                      className="text-xs gap-1"
                    >
                      <span>Next</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setSubmittedQuiz(true)}
                      className="text-xs gap-1.5 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
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
                      className="text-xs gap-1"
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
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <AlertTriangle className="size-4" />
                </div>
                <CardTitle className="text-sm font-bold tracking-tight text-foreground">
                  Technician Remediation Advice
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Actionable tips generated from recorded assembly errors and compatibility friction.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs text-muted-foreground">
              {remediationAdvice.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border/60 bg-muted/20"
                >
                  <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
                  <span className="leading-relaxed text-foreground/90">{tip}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Action Buttons */}
          <Card className="border-border/80 bg-card shadow-xs p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Next Learning Actions
            </h4>

            <div className="space-y-2">
              <Link to="/guided" className="block w-full">
                <Button variant="outline" className="w-full justify-between text-xs h-9">
                  <span className="flex items-center gap-2">
                    <Wrench className="size-3.5 text-primary" />
                    <span>Practice in Guided Mode</span>
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Button>
              </Link>

              <Link to="/challenge" className="block w-full">
                <Button variant="outline" className="w-full justify-between text-xs h-9">
                  <span className="flex items-center gap-2">
                    <Trophy className="size-3.5 text-amber-500" />
                    <span>Retake Assembly Challenge</span>
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
                </Button>
              </Link>

              <Link to="/learn" className="block w-full">
                <Button variant="outline" className="w-full justify-between text-xs h-9">
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
                className="w-full gap-2 text-xs active:scale-95 transition-transform"
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
