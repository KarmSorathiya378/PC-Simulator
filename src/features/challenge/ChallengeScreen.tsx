import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  AlertTriangle,
  Timer,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Shield,
  Cable,
  Sparkles,
  Layers,
  Box,
  Eye,
  Info,
  Maximize2,
  Check,
} from 'lucide-react';
import { useAssemblyStore } from '../../store/assemblyStore';
import { components } from '../../data/components';
import { slots, requiredConnections } from '../../data/buildConfig';
import { AssemblyCanvas } from '../../simulator/AssemblyCanvas';
import Assembly3DCanvas from '../../simulator/Assembly3DCanvas';
import { ViewModeToggle } from '../../components/ViewModeToggle';
import type { CanvasViewMode } from '../../components/guidedAssemblyTypes';
import { calculateScore } from '../../utils/scoring';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { BrandBadge, GlowCard, GradientText, GlassPanel } from '../../components/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import { Scene3D, Part3D } from '../../three';
import type { HardwarePartType } from '../../three/types';

const CATEGORY_TO_3D: Record<string, HardwarePartType | undefined> = {
  cpu: 'cpu',
  gpu: 'gpu',
  ram: 'ram',
  motherboard: 'motherboard',
  psu: 'psu',
  cooler: 'fan',
  case: 'case',
  ssd: 'ssd',
};

export const ChallengeScreen: React.FC = () => {
  const store = useAssemblyStore();
  const navigate = useNavigate();

  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [inspect3DCompId, setInspect3DCompId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<CanvasViewMode>('3d');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(true);

  // Initialize challenge mode on mount
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

  const scoreData = useMemo(() => {
    return calculateScore({
      installedCount: progress.installedCount,
      totalInstallable: slots.length,
      connectedCount: progress.connectedCount,
      totalConnections: requiredConnections.length,
      incorrectAttempts: store.incorrectAttempts,
      quizCorrectCount: 0,
    });
  }, [progress.installedCount, progress.connectedCount, store.incorrectAttempts]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleInstallClick = (componentId: string) => {
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
        message: `Mounted! ${comp.name} successfully installed into ${matchingSlot?.label ?? targetSlotId}.`,
      });
      setSelectedCompId(null);
    } else {
      setFeedback({
        ok: false,
        message: result.reason || 'Placement rejected. Socket standard or sequence conflict.',
      });
    }
  };

  const handleResetChallenge = () => {
    if (window.confirm('Restart challenge? All current progress and mistake counts will be reset.')) {
      store.restart();
      setElapsedSeconds(0);
      setFeedback(null);
      setSelectedCompId(null);
      setInspect3DCompId(null);
    }
  };

  const inspectComp = inspect3DCompId
    ? components.find((c) => c.id === inspect3DCompId)
    : null;
  const inspectPartType = inspectComp
    ? CATEGORY_TO_3D[inspectComp.category]
    : undefined;

  return (
    <div className="space-y-8 py-2 w-full max-w-full overflow-hidden font-sans">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground border-b border-border/60 pb-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <Link to="/" className="hover:text-foreground transition-colors">
            Platform
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-semibold text-foreground">Challenge Exam</span>
        </nav>
        <div className="flex items-center gap-2.5 font-mono text-[11px]">
          <BrandBadge variant="amber" pulse>Autonomous Exam Active</BrandBadge>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-muted-foreground">Contextual hints disabled</span>
        </div>
      </div>

      {/* Screen Hero & Live Metrics Bar */}
      <GlowCard glowColor="amber" className="p-6 sm:p-8 card-elevated">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <BrandBadge variant="amber">
                <Trophy className="size-3 mr-1 inline" />
                TIMED TECHNICAL EVALUATION // 100-POINT RUBRIC
              </BrandBadge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
              Assembly Challenge &amp; <GradientText variant="warm">Diagnostic Exam</GradientText>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Mount all desktop components autonomously without assistance. Invalid placement attempts
              and dependency violations incur point penalties on your final scorecard.
            </p>
          </div>

          {/* Live Floating HUD Dock */}
          <div className="flex flex-wrap items-center gap-2.5 p-2 rounded-xl glass-surface border border-border/80 shadow-xs shrink-0">
            {/* Timer HUD */}
            <div className="flex items-center gap-2 rounded-lg bg-card/90 border border-border/80 px-3.5 py-2 text-xs font-mono shadow-2xs">
              <Timer className="size-4 text-primary animate-pulse" />
              <div>
                <span className="block text-[10px] text-muted-foreground uppercase font-semibold">Elapsed</span>
                <strong className="text-foreground text-sm font-bold">{formatTime(elapsedSeconds)}</strong>
              </div>
            </div>

            {/* Mistakes HUD */}
            <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3.5 py-2 text-xs font-mono shadow-2xs">
              <AlertTriangle className="size-4 text-amber-500" />
              <div>
                <span className="block text-[10px] text-amber-500 dark:text-amber-400 uppercase font-semibold">Mistakes</span>
                <strong className="text-amber-600 dark:text-amber-300 text-sm font-bold">
                  {store.incorrectAttempts}
                </strong>
              </div>
            </div>

            {/* Live Score HUD */}
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/30 px-4 py-2 text-xs font-mono shadow-2xs">
              <Trophy className="size-4 text-primary" />
              <div>
                <span className="block text-[10px] text-primary uppercase font-bold">Live Score</span>
                <strong className="text-primary text-sm font-black">
                  {scoreData.totalScore} <span className="text-xs font-normal text-muted-foreground">/ 100</span>
                </strong>
              </div>
            </div>

            {/* Restart Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleResetChallenge}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 pressable-element shrink-0"
              title="Reset Challenge"
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </div>
      </GlowCard>

      {/* Dynamic Feedback Banner */}
      {feedback && (
        <div
          className={`rounded-xl border p-4 text-xs flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-150 ${
            feedback.ok
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
              : 'border-destructive/30 bg-destructive/10 text-destructive'
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.ok ? (
              <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="size-5 shrink-0 text-destructive" />
            )}
            <span className="font-semibold">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs font-mono underline opacity-80 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Center: Interactive 3D Chassis Viewport or 2D Blueprint Canvas */}
        <div className="xl:col-span-8 flex flex-col items-center gap-4">
          <GlassPanel
            variant="surface"
            withInnerBevel
            className="w-full flex flex-col justify-center bg-card rounded-2xl border border-border/80 p-3 shadow-xs card-elevated relative overflow-hidden bg-blueprint-dots min-h-[580px]"
          >
            {/* Viewport Header Controls: View Toggle */}
            <div className="flex items-center justify-between pb-3 px-1 border-b border-border/60 mb-2">
              <div className="flex items-center gap-2">
                <Box className="size-4 text-primary" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-foreground">
                  {viewMode === '3d' ? '3D Interactive Chassis Assembly' : '2D Architectural Schematic Blueprint'}
                </span>
              </div>
              <ViewModeToggle mode={viewMode} onChange={setViewMode} />
            </div>

            {/* Viewport Tech Corner Crosshairs */}
            <div className="absolute top-12 left-3 size-3 border-t-2 border-l-2 border-border-strong pointer-events-none z-10 opacity-70" />
            <div className="absolute top-12 right-3 size-3 border-t-2 border-r-2 border-border-strong pointer-events-none z-10 opacity-70" />
            <div className="absolute bottom-3 left-3 size-3 border-b-2 border-l-2 border-border-strong pointer-events-none z-10 opacity-70" />
            <div className="absolute bottom-3 right-3 size-3 border-b-2 border-r-2 border-border-strong pointer-events-none z-10 opacity-70" />

            {/* Conditional Rendering between 3D WebGL Canvas and 2D Konva Blueprint */}
            <div className="w-full flex-1 flex items-center justify-center min-h-[500px]">
              {viewMode === '3d' ? (
                <div className="w-full h-[520px] rounded-xl overflow-hidden relative">
                  <Assembly3DCanvas
                    occupiedSlots={store.occupiedSlots}
                    showCase={true}
                    lightingPreset="cyberpunk"
                    showControlsOverlay={true}
                    onSlotSelect={(slotId) => {
                      const compId = store.occupiedSlots[slotId];
                      if (compId) {
                        setInspect3DCompId(compId);
                      }
                    }}
                  />
                </div>
              ) : (
                <AssemblyCanvas
                  selectedComponentId={selectedCompId}
                  onSelectComponent={(comp) => {
                    setSelectedCompId(comp ? comp.id : null);
                  }}
                  interactiveMode="assemble"
                  width={680}
                  height={520}
                />
              )}
            </div>
          </GlassPanel>

          {/* Quick Finish / Continue Action Bar */}
          <GlassPanel
            variant="surface"
            className="w-full flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-card shadow-xs"
          >
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <Shield className="size-4 text-primary shrink-0" />
              <span>
                {isAssemblyComplete
                  ? 'All hardware mounted! Proceed to Cable Connections or submit for quiz grading.'
                  : `${slots.length - progress.installedCount} components remaining to be placed into the chassis.`}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Link to="/connection">
                <Button variant="secondary" size="sm" className="gap-1.5 text-xs pressable-element">
                  <Cable className="size-3.5" />
                  <span>Connection Mode</span>
                </Button>
              </Link>

              <Link to="/results">
                <Button
                  size="sm"
                  className="gap-1.5 text-xs font-bold pressable-element shadow-xs bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <Sparkles className="size-3.5" />
                  <span>Finish &amp; Grade Assessment</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </div>
          </GlassPanel>
        </div>

        {/* Right Column: Independent Hardware Tray & Live Scorecard */}
        <div className="xl:col-span-4 space-y-4">
          {/* Live Scorecard Preview Card */}
          <Card className="border-border/80 bg-card shadow-xs card-elevated">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold tracking-tight text-foreground font-display">
                  Live Scorecard Breakdown
                </CardTitle>
                <BrandBadge variant="amber">Rubric v2.0</BrandBadge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs pt-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span className="font-medium">1. Hardware Assembly</span>
                  <span className="font-mono font-bold text-foreground">
                    {scoreData.assemblyScore} / {scoreData.maxAssemblyScore} pts
                  </span>
                </div>
                <Progress value={(scoreData.assemblyScore / scoreData.maxAssemblyScore) * 100} className="h-2" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span className="font-medium">2. Power Cable Routing</span>
                  <span className="font-mono font-bold text-foreground">
                    {scoreData.connectionScore} / {scoreData.maxConnectionScore} pts
                  </span>
                </div>
                <Progress value={(scoreData.connectionScore / scoreData.maxConnectionScore) * 100} className="h-2" />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span className="font-medium">3. Knowledge Quiz</span>
                  <span className="font-mono text-muted-foreground italic">Pending Submission</span>
                </div>
                <div className="h-2 rounded-full bg-muted/60 w-full" />
              </div>

              <div className="border-t border-border/60 pt-3 flex items-center justify-between font-semibold">
                <span className="text-foreground">Current Total Score:</span>
                <span className="text-primary font-mono text-lg font-black">
                  {scoreData.totalScore} pts
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Component Tray / Inventory Dock */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                <span>Component Tray ({components.filter((c) => c.category !== 'case').length})</span>
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">Select, inspect, or install</span>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
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
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all duration-150 pressable-element ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-xs'
                          : isInstalled
                          ? 'border-border/60 bg-muted/40 opacity-75'
                          : 'border-border/80 bg-card hover:border-border-strong hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="size-8 rounded-md shrink-0 border border-border/80 flex items-center justify-center text-white text-[10px] font-bold uppercase font-mono shadow-2xs"
                          style={{ backgroundColor: comp.visual.color }}
                        >
                          {comp.category.substring(0, 3)}
                        </div>

                        <div className="min-w-0">
                          <span className="text-xs font-bold truncate block text-foreground font-display">
                            {comp.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground capitalize font-mono">
                            {comp.category}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 pl-2">
                        {/* 3D Inspect Button */}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspect3DCompId(comp.id);
                          }}
                          className="size-7 text-muted-foreground hover:text-primary hover:bg-primary/10 pressable-element"
                          title={`Inspect ${comp.name} in 3D`}
                        >
                          <Eye className="size-3.5" />
                        </Button>

                        {isInstalled ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                            <CheckCircle2 className="size-3.5" />
                            <span>Placed</span>
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInstallClick(comp.id);
                            }}
                            className="h-7 text-xs px-2.5 pressable-element shadow-2xs"
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

      {/* 3D Component Inspection Modal */}
      {inspectComp && inspectPartType && (
        <Dialog open={true} onOpenChange={(open) => !open && setInspect3DCompId(null)}>
          <DialogContent className="max-w-2xl bg-card/95 border-border/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <BrandBadge variant="cyan">
                  {inspectComp.category}
                </BrandBadge>
                <DialogTitle className="text-lg font-bold font-display text-foreground">
                  <GradientText variant="subtle" as="span">
                    {inspectComp.name}
                  </GradientText>
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Interactive 3D model: rotate and inspect physical form factor, key notches, and contact points.
              </DialogDescription>
            </DialogHeader>

            <div className="relative w-full h-84 sm:h-96 min-h-[350px] rounded-xl overflow-hidden bg-blueprint-dots border border-border/80 shadow-inner">
              {/* Studio Reticles */}
              <div className="absolute top-2 left-2 size-3 border-t-2 border-l-2 border-border-strong pointer-events-none z-10 opacity-70" />
              <div className="absolute top-2 right-2 size-3 border-t-2 border-r-2 border-border-strong pointer-events-none z-10 opacity-70" />
              <div className="absolute bottom-2 left-2 size-3 border-b-2 border-l-2 border-border-strong pointer-events-none z-10 opacity-70" />
              <div className="absolute bottom-2 right-2 size-3 border-b-2 border-r-2 border-border-strong pointer-events-none z-10 opacity-70" />

              <Scene3D
                key={inspectPartType}
                cameraPosition={[4.5, 3.5, 5.5]}
                autoFit={true}
                targetFill={0.84}
                autoCenter={true}
                autoRotate
                autoRotateSpeed={0.8}
              >
                <Part3D type={inspectPartType} animated fitContainer autoCenter />
              </Scene3D>
            </div>

            <div className="text-xs text-muted-foreground space-y-1.5 bg-primary/10 p-3.5 rounded-xl border border-primary/30">
              <div className="text-primary font-bold font-mono text-[11px] flex items-center gap-1.5">
                <Info className="size-3.5" />
                <span>Physical Architecture &amp; Challenge Guidance:</span>
              </div>
              <p className="text-foreground leading-relaxed">
                {inspectComp.ruleText || inspectComp.description}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ChallengeScreen;
