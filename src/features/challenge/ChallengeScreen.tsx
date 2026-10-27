import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  AlertTriangle,
  Timer,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Undo2,
  ArrowRight,
  Shield,
  Cable,
} from 'lucide-react';
import { useAssemblyStore } from '../../store/assemblyStore';
import { components } from '../../data/components';
import { slots, requiredConnections } from '../../data/buildConfig';
import { AssemblyCanvas } from '../../simulator/AssemblyCanvas';
import { calculateScore } from '../../utils/scoring';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

export const ChallengeScreen: React.FC = () => {
  const store = useAssemblyStore();
  const navigate = useNavigate();

  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(true);

  // Set mode to challenge
  useEffect(() => {
    store.startMode('challenge');
  }, []);

  // Timer ticker
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const progress = store.getProgress();
  const isAssemblyComplete = progress.installedCount >= slots.length;

  const scoreData = calculateScore({
    installedCount: progress.installedCount,
    totalInstallable: slots.length,
    connectedCount: progress.connectedCount,
    totalConnections: requiredConnections.length,
    incorrectAttempts: store.incorrectAttempts,
    quizCorrectCount: 0,
  });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleInstallClick = (componentId: string) => {
    // In challenge mode, user attempts placement without automatic target assignment
    // Attempt placement into component's intended category slot or first matching slot
    const comp = components.find((c) => c.id === componentId);
    if (!comp) return;

    // Find candidate first unoccupied slot for category
    const matchingSlot =
      slots.find((s) => s.accepts.includes(comp.category) && !store.occupiedSlots[s.id]) ||
      slots.find((s) => s.accepts.includes(comp.category));
    const targetSlotId = matchingSlot ? matchingSlot.id : 'slot-motherboard';

    const result = store.installComponent(componentId, targetSlotId);

    if (result.ok) {
      setFeedback({
        ok: true,
        message: `Correct! ${comp.name} successfully mounted into ${matchingSlot?.label}.`,
      });
      setSelectedCompId(null);
    } else {
      setFeedback({
        ok: false,
        message: result.reason || 'Incorrect placement attempt. Review hardware prerequisites.',
      });
    }
  };

  const handleResetChallenge = () => {
    if (window.confirm('Restart challenge? All current progress and mistake counts will be reset.')) {
      store.restart();
      setElapsedSeconds(0);
      setFeedback(null);
      setSelectedCompId(null);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Challenge Mode</span>
      </div>

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Trophy className="size-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Assembly Challenge Mode
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Assemble the computer independently without contextual hints. Incorrect actions deduct points from your final 100-point rubric.
          </p>
        </div>

        {/* Live Metrics Header Badges */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono">
            <Timer className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Time:</span>
            <strong className="text-foreground">{formatTime(elapsedSeconds)}</strong>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs">
            <AlertTriangle className="size-3.5 text-amber-500" />
            <span className="text-muted-foreground">Mistakes:</span>
            <strong className="font-mono text-amber-600 dark:text-amber-400 font-bold">
              {store.incorrectAttempts}
            </strong>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs">
            <Trophy className="size-3.5 text-primary" />
            <span className="text-muted-foreground">Live Score:</span>
            <strong className="font-mono text-primary font-bold">
              {scoreData.totalScore} / 100
            </strong>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetChallenge}
            className="text-destructive hover:text-destructive active:scale-95 transition-transform"
            title="Reset Challenge"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Dynamic Feedback Banner */}
      {feedback && (
        <div
          className={`rounded-lg border p-3.5 text-xs flex items-center justify-between gap-3 shadow-xs ${
            feedback.ok
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : 'border-destructive/30 bg-destructive/10 text-destructive'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.ok ? (
              <CheckCircle2 className="size-4 shrink-0" />
            ) : (
              <AlertCircle className="size-4 shrink-0" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs underline opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Center: Konva 2D Canvas */}
        <div className="xl:col-span-8 flex flex-col items-center gap-3">
          <AssemblyCanvas
            selectedComponentId={selectedCompId}
            onSelectComponent={(comp) => {
              setSelectedCompId(comp ? comp.id : null);
            }}
            interactiveMode="assemble"
            width={680}
            height={560}
          />

          {/* Quick Finish / Continue Action Bar */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border/80 bg-card">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="size-4 text-primary" />
              <span>
                {isAssemblyComplete
                  ? 'Hardware assembled! Proceed to Cable Connections or submit for quiz grading.'
                  : `${slots.length - progress.installedCount} components remaining to be installed.`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/connection">
                <Button variant="secondary" size="sm" className="gap-1.5 text-xs active:scale-95">
                  <Cable className="size-3.5" />
                  <span>Connection Mode</span>
                </Button>
              </Link>

              <Link to="/results">
                <Button
                  size="sm"
                  className="gap-1.5 text-xs font-semibold active:scale-95 shadow-xs"
                >
                  <span>Finish &amp; Grade Assessment</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Independent Hardware Tray & Live Scorecard */}
        <div className="xl:col-span-4 space-y-4">
          {/* Live Scorecard Preview */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold tracking-tight text-foreground">
                  Challenge Scorecard
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  Rubric v2.0
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Assembly Phase (Max 60 pts)</span>
                  <span className="font-mono font-semibold text-foreground">
                    {scoreData.assemblyScore} / {scoreData.maxAssemblyScore}
                  </span>
                </div>
                <Progress value={(scoreData.assemblyScore / scoreData.maxAssemblyScore) * 100} className="h-1.5" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Connection Phase (Max 20 pts)</span>
                  <span className="font-mono font-semibold text-foreground">
                    {scoreData.connectionScore} / {scoreData.maxConnectionScore}
                  </span>
                </div>
                <Progress value={(scoreData.connectionScore / scoreData.maxConnectionScore) * 100} className="h-1.5" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Knowledge Assessment (Max 20 pts)</span>
                  <span className="font-mono text-muted-foreground">
                    Pending Quiz
                  </span>
                </div>
              </div>

              <div className="border-t border-border/60 pt-2 flex items-center justify-between font-semibold">
                <span className="text-foreground">Total Score so far:</span>
                <span className="text-primary font-mono text-base font-bold">
                  {scoreData.totalScore} pts
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Component Tray */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hardware Tray
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                Independent selection
              </span>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {components
                .filter((c) => c.category !== 'case')
                .map((comp) => {
                  const isInstalled = Boolean(
                    store.installedPal.some((item) => item.componentId === comp.id)
                  );
                  const isSelected = selectedCompId === comp.id;

                  return (
                    <div
                      key={comp.id}
                      onClick={() => setSelectedCompId(comp.id)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-xs'
                          : isInstalled
                          ? 'border-border/60 bg-muted/40 opacity-70'
                          : 'border-border/80 bg-card hover:border-border'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="size-8 rounded-md shrink-0 border border-border/80 flex items-center justify-center text-white text-[10px] font-bold uppercase font-mono"
                          style={{ backgroundColor: comp.visual.color }}
                        >
                          {comp.category.substring(0, 3)}
                        </div>

                        <div className="min-w-0">
                          <span className="text-xs font-semibold truncate block text-foreground">
                            {comp.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground capitalize">
                            {comp.category}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 pl-2">
                        {isInstalled ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-3.5" />
                            <span>Installed</span>
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInstallClick(comp.id);
                            }}
                            className="h-7 text-xs px-2.5 active:scale-95"
                          >
                            Install
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeScreen;
