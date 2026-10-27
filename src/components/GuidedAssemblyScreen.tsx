import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  Undo2,
  Redo2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Cable,
  Eye,
  Box,
  Layers,
  HelpCircle,
  Sparkles,
  Check,
  ChevronRight,
  Info,
  Maximize2,
} from 'lucide-react';
import { useAssemblyStore } from '../store/assemblyStore';
import { components } from '../data/components';
import { slots } from '../data/buildConfig';
import { AssemblyCanvas } from './AssemblyCanvas';
import Assembly3DCanvas from '../simulator/Assembly3DCanvas';
import { ViewModeToggle } from './ViewModeToggle';
import {
  GUIDED_STEPS,
  CATEGORY_TO_3D,
  type CanvasViewMode,
} from './guidedAssemblyTypes';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Card } from './ui/card';
import { BrandBadge, GlowCard, GradientText } from './ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Scene3D, Part3D } from '../three';

export const GuidedAssemblyScreen: React.FC = () => {
  const store = useAssemblyStore();

  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [preview3DCompId, setPreview3DCompId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [viewMode, setViewMode] = useState<CanvasViewMode>('3d');
  const [filterCategory, setFilterCategory] = useState<'all' | 'bench' | 'installed'>('all');

  // Initialize assemble mode on mount
  useEffect(() => {
    store.startMode('assemble');
  }, []);

  const progress = store.getProgress();
  const isComplete = progress.installedCount >= slots.length;

  // Derive current step and active slot mapping
  const currentStep = useMemo(() => {
    return (
      GUIDED_STEPS.find((step) => !store.occupiedSlots[step.slotId]) ||
      GUIDED_STEPS[GUIDED_STEPS.length - 1]
    );
  }, [store.occupiedSlots]);

  const activeSlotId = isComplete ? null : currentStep?.slotId ?? null;

  // Derive array of already installed slot IDs
  const completedSlotIds = useMemo(() => {
    return Object.keys(store.occupiedSlots).filter((slotId) =>
      Boolean(store.occupiedSlots[slotId])
    );
  }, [store.occupiedSlots]);

  const handleInstallClick = (componentId: string, slotId?: string) => {
    const comp = components.find((c) => c.id === componentId);
    let targetSlot = slotId;
    if (!targetSlot && comp) {
      const emptyMatching = slots.find(
        (s) => s.accepts.includes(comp.category) && !store.occupiedSlots[s.id]
      );
      targetSlot = emptyMatching ? emptyMatching.id : currentStep?.slotId || 'slot-motherboard';
    }
    const result = store.installComponent(componentId, targetSlot || 'slot-motherboard');

    if (result.ok) {
      setFeedback({
        ok: true,
        message: `Successfully installed ${components.find((c) => c.id === componentId)?.name}!`,
      });
      setSelectedCompId(null);
    } else {
      setFeedback({
        ok: false,
        message: result.reason || 'Placement rejected. Check compatibility or prerequisites.',
      });
    }
  };

  const handleUndo = () => {
    const success = store.undo();
    if (success) {
      setFeedback({ ok: true, message: 'Reverted previous assembly step.' });
    }
  };

  const handleRedo = () => {
    const success = store.redo();
    if (success) {
      setFeedback({ ok: true, message: 'Restored previously undone step.' });
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the assembly? All installed parts will be removed.')) {
      store.reset();
      setFeedback(null);
      setSelectedCompId(null);
    }
  };

  // Filter hardware list
  const filteredComponents = useMemo(() => {
    return components
      .filter((c) => c.category !== 'case')
      .filter((c) => {
        const isInstalled = Boolean(
          store.installedPal.some((item) => item.componentId === c.id)
        );
        if (filterCategory === 'bench') return !isInstalled;
        if (filterCategory === 'installed') return isInstalled;
        return true;
      });
  }, [store.installedPal, filterCategory]);

  return (
    <div className="space-y-6 py-2 max-w-7xl mx-auto font-sans">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground border-b border-border/60 pb-3">
        <Link to="/" className="hover:text-foreground transition-colors">
          Platform
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Guided Assembly Lab</span>
      </nav>

      {/* Screen Title & Top Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
              <Wrench className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <GradientText variant="cyan-violet" as="h1" className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
                  Guided Assembly Lab
                </GradientText>
                <BrandBadge variant="cyan" pulse className="hidden sm:inline-flex">
                  Interactive 3D Engine
                </BrandBadge>
              </div>
              <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                Step-by-step physical hardware assembly sequence with real-time 3D chassis inspection.
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar Controls: 3D/2D View Toggle, Undo, Redo, Reset */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />

          <div className="h-5 w-px bg-border hidden sm:block mx-0.5" />

          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={store.history.past.length === 0}
            className="gap-1.5 btn-glass pressable-element cursor-pointer"
            title="Undo last action"
          >
            <Undo2 className="size-3.5" />
            <span className="hidden sm:inline">Undo</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={store.history.future.length === 0}
            className="gap-1.5 btn-glass pressable-element cursor-pointer"
            title="Redo action"
          >
            <Redo2 className="size-3.5" />
            <span className="hidden sm:inline">Redo</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-border pressable-element cursor-pointer"
            title="Reset assembly to start"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>

      {/* Horizontal Step Progression Timeline */}
      <div className="overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex items-center gap-2 min-w-max">
          {GUIDED_STEPS.map((step, idx) => {
            const isStepInstalled = Boolean(store.occupiedSlots[step.slotId]);
            const isStepActive = !isComplete && currentStep?.slotId === step.slotId;
            const comp = components.find((c) => c.id === step.componentId);

            return (
              <div
                key={step.slotId}
                onClick={() => {
                  if (comp) {
                    setSelectedCompId(comp.id);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition-all pressable-element ${
                  isStepActive
                    ? 'bg-cyan-950/60 text-cyan-200 border-cyan-500/60 font-bold shadow-[0_0_16px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/40'
                    : isStepInstalled
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-medium'
                    : 'bg-slate-900/40 border-slate-800/80 text-muted-foreground hover:text-foreground hover:border-slate-700'
                }`}
              >
                <div
                  className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                    isStepActive
                      ? 'bg-cyan-400 text-slate-950'
                      : isStepInstalled
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-muted-foreground'
                  }`}
                >
                  {isStepInstalled ? <Check className="size-3 stroke-[3]" /> : idx + 1}
                </div>
                <span className="truncate max-w-[120px] sm:max-w-[140px]">
                  {comp?.category.toUpperCase() || `Step ${idx + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress & Active Step Guidance Glass Card */}
      <GlowCard
        glowColor={isComplete ? 'emerald' : 'cyan'}
        interactive={false}
        className="p-4 sm:p-5 space-y-3.5 transition-colors border-slate-800/80"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <BrandBadge
                variant={isComplete ? 'emerald' : 'cyan'}
                pulse={!isComplete}
              >
                {isComplete ? 'Hardware Complete' : `Step ${progress.installedCount + 1} of ${slots.length}`}
              </BrandBadge>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground">
                {isComplete ? 'All Core Hardware Components Mounted!' : currentStep.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isComplete
                ? 'All components are seated in the chassis standoffs and slots. Proceed to Connection Mode to complete power wiring.'
                : 'Select the highlighted hardware part from the tray and click Install, or click directly on the glowing 3D slot.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            {!isComplete && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="gap-1.5 text-xs font-medium pressable-element cursor-pointer"
              >
                <Lightbulb className="size-3.5 text-accent-warm" />
                <span>{showHint ? 'Hide Hint' : 'Show Technician Hint'}</span>
              </Button>
            )}

            {isComplete && (
              <Link to="/connection">
                <Button size="sm" className="gap-2 font-bold shadow-xs shadow-primary/30 animate-pulse pressable-element">
                  <Cable className="size-4" />
                  <span>Proceed to Cabling</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Expandable Hint Box */}
        {showHint && !isComplete && (
          <div className="rounded-xl border border-accent-warm-border bg-accent-warm-light p-3.5 text-xs text-foreground flex items-start gap-2.5 animate-in fade-in duration-200">
            <HelpCircle className="size-4 text-accent-warm shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-accent-warm-foreground">Hardware Assembly Hint: </strong>
              <span>{currentStep.hint}</span>
            </div>
          </div>
        )}

        {/* Dynamic Feedback Banner */}
        {feedback && (
          <div
            className={`rounded-xl border p-3.5 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
              feedback.ok
                ? 'border-success-border bg-success-light text-success-foreground'
                : 'border-destructive-border bg-destructive-light text-destructive'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.ok ? (
                <CheckCircle2 className="size-4 shrink-0 text-success" />
              ) : (
                <AlertCircle className="size-4 shrink-0 text-destructive" />
              )}
              <span className="font-semibold">{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-xs underline opacity-80 hover:opacity-100 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span>Chassis Mounting Progress</span>
            </span>
            <span className="text-foreground font-mono font-bold">
              {progress.installedCount} / {slots.length} ({Math.round((progress.installedCount / slots.length) * 100)}%)
            </span>
          </div>
          <Progress value={(progress.installedCount / slots.length) * 100} className="h-2 rounded-full" />
        </div>
      </GlowCard>

      {/* Main Workspace Layout: Viewport (3D or 2D) & Hardware Inspector / Tray */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Main Viewport Container */}
        <div className="xl:col-span-8 flex flex-col items-center w-full">
          {viewMode === '3d' ? (
            <div className="w-full space-y-2.5">
              {/* Premium 3D Viewport Framing */}
              <div className="relative w-full rounded-2xl border border-border card-elevated overflow-hidden bg-blueprint-dots">
                {/* Viewport Corner CAD Reticles */}
                <div className="absolute top-3 left-3 size-4 border-t-2 border-l-2 border-border-strong pointer-events-none z-10 opacity-70" />
                <div className="absolute top-3 right-3 size-4 border-t-2 border-r-2 border-border-strong pointer-events-none z-10 opacity-70" />
                <div className="absolute bottom-3 left-3 size-4 border-b-2 border-l-2 border-border-strong pointer-events-none z-10 opacity-70" />
                <div className="absolute bottom-3 right-3 size-4 border-b-2 border-r-2 border-border-strong pointer-events-none z-10 opacity-70" />

                {/* Top Viewport Floating Status HUD */}
                <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none px-2">
                  <div className="glass-surface px-3 py-1.5 rounded-lg border border-border text-[11px] text-muted-foreground flex items-center gap-1.5 shadow-xs pointer-events-auto">
                    <Maximize2 className="size-3 text-primary" />
                    <span>Orbit: Drag • Zoom: Scroll</span>
                  </div>

                  {activeSlotId && (
                    <div className="glass-surface px-3 py-1.5 rounded-lg border border-primary-border bg-primary-light text-primary text-[11px] font-mono font-semibold flex items-center gap-1.5 shadow-xs pointer-events-auto animate-in fade-in">
                      <span className="size-2 rounded-full bg-primary animate-pulse" />
                      <span>Active Target: {slots.find((s) => s.id === activeSlotId)?.label || activeSlotId}</span>
                    </div>
                  )}
                </div>

                {/* Interactive 3D Canvas */}
                <Assembly3DCanvas
                  activeSlotId={activeSlotId}
                  completedSlotIds={completedSlotIds}
                  onSlotSelect={(slotId) => {
                    const targetSlot = slots.find((s) => s.id === slotId);
                    if (targetSlot) {
                      const matchingComp = components.find((c) =>
                        targetSlot.accepts.includes(c.category)
                      );
                      if (matchingComp) {
                        setSelectedCompId(matchingComp.id);
                      }
                    }
                  }}
                  className="w-full h-[580px]"
                />

                {/* Bottom Viewport HUD Controls */}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none px-2">
                  <div className="glass-surface px-2.5 py-1 rounded-md border border-border text-[10px] text-muted-foreground font-mono shadow-xs">
                    Installed: {completedSlotIds.length} / {slots.length} parts
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewMode('2d')}
                    className="glass-surface px-2.5 py-1 rounded-md border border-border text-[10px] text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 cursor-pointer pointer-events-auto transition-colors shadow-xs"
                  >
                    <Layers className="size-3 text-primary" />
                    <span>Switch to 2D Schematic</span>
                  </button>
                </div>
              </div>

              {/* Viewport Caption Bar */}
              <div className="flex items-center justify-between px-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Box className="size-3.5 text-primary" />
                  <span>Interactive 3D Assembly • Click any highlighted slot or part to inspect</span>
                </span>
                <span className="font-mono text-[10px]">
                  Real-time WebGL PBR Engine
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center space-y-2.5">
              <div className="w-full flex justify-center bg-card rounded-2xl border border-border p-3 card-elevated shadow-xs overflow-hidden">
                <AssemblyCanvas
                  selectedComponentId={selectedCompId}
                  onSelectComponent={(comp) => {
                    setSelectedCompId(comp ? comp.id : null);
                  }}
                  interactiveMode="assemble"
                  width={680}
                  height={560}
                />
              </div>
              <div className="w-full flex items-center justify-between px-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" />
                  <span>2D Schematic Layout • Drag or click parts into target motherboard slots</span>
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className="hover:text-foreground underline flex items-center gap-1 cursor-pointer"
                >
                  <Box className="size-3 text-primary" />
                  <span>Switch to 3D view</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Component Inspector & Hardware Tray */}
        <div className="xl:col-span-4 space-y-4 w-full">
          {/* Selected Component Quick Action Card */}
          {selectedCompId ? (
            (() => {
              const comp = components.find((c) => c.id === selectedCompId);
              if (!comp) return null;
              const isInstalled = Boolean(
                store.installedPal.some((item) => item.componentId === comp.id)
              );

              return (
                <GlowCard
                  glowColor="cyan"
                  interactive={false}
                  className="p-5 space-y-3.5 border-slate-800/80 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <BrandBadge variant="cyan">
                      {comp.category}
                    </BrandBadge>
                    {isInstalled ? (
                      <BrandBadge variant="emerald" pulse>
                        Installed in Chassis
                      </BrandBadge>
                    ) : (
                      <BrandBadge variant="slate">
                        Ready on Bench
                      </BrandBadge>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold font-display text-foreground">{comp.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {comp.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-mono text-[11px]">Socket / Slot:</span>
                      <span className="font-semibold text-foreground">
                        {comp.socket || comp.pcieSlot || comp.interfaceType || comp.formFactor || 'Standard'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-800/60 pt-1.5">
                      <span className="text-muted-foreground font-mono text-[11px]">Chassis Location:</span>
                      <span className="font-semibold text-foreground truncate max-w-[170px] text-right">
                        {comp.locationText}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    {CATEGORY_TO_3D[comp.category] && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreview3DCompId(comp.id)}
                        className="gap-1.5 text-xs font-medium shrink-0 btn-glass pressable-element cursor-pointer"
                      >
                        <Box className="size-3.5 text-cyan-400" />
                        <span>3D View</span>
                      </Button>
                    )}

                    {!isInstalled && (
                      <Button
                        size="sm"
                        onClick={() => handleInstallClick(comp.id)}
                        className="w-full gap-2 font-bold btn-primary pressable-element cursor-pointer"
                      >
                        <Wrench className="size-3.5" />
                        <span>Install into Slot</span>
                      </Button>
                    )}

                    {isInstalled && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          store.removeComponent(comp.id);
                          setFeedback({ ok: true, message: `Removed ${comp.name} from chassis.` });
                        }}
                        className="w-full gap-2 text-xs pressable-element cursor-pointer"
                      >
                        <span>Remove Component</span>
                      </Button>
                    )}
                  </div>
                </GlowCard>
              );
            })()
          ) : (
            <GlowCard
              glowColor="violet"
              interactive={false}
              className="p-5 text-center space-y-3.5 border-slate-800/80"
            >
              <div className="flex justify-center">
                <div className="size-11 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Sparkles className="size-5" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold font-display text-foreground">
                  {isComplete ? 'Hardware Complete' : 'Recommended Next Action'}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isComplete
                    ? 'All parts are mounted! Switch to 3D view to inspect your completed desktop rig.'
                    : `Next recommended install: ${components.find((c) => c.id === currentStep?.componentId)?.name || 'Next component'}.`}
                </p>
              </div>

              {!isComplete && currentStep && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const comp = components.find((c) => c.id === currentStep.componentId);
                    if (comp) setSelectedCompId(comp.id);
                  }}
                  className="w-full text-xs font-semibold pressable-element cursor-pointer gap-1.5 border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/40"
                >
                  <Eye className="size-3.5" />
                  <span>Select Recommended Part</span>
                </Button>
              )}
            </GlowCard>
          )}

          {/* Component Tray / Inventory Dock */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Hardware Tray
              </span>

              <div className="flex items-center gap-2">
                <BrandBadge variant="slate">{filteredComponents.length} parts</BrandBadge>

                {/* Status Filter Toggle */}
                <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 p-0.5 rounded-lg text-[10px] font-medium backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setFilterCategory('all')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      filterCategory === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterCategory('bench')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      filterCategory === 'bench' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Bench
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterCategory('installed')}
                    className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      filterCategory === 'installed' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-2xs' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Placed
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredComponents.map((comp) => {
                const isInstalled = Boolean(
                  store.installedPal.some((item) => item.componentId === comp.id)
                );
                const isSelected = selectedCompId === comp.id;
                const isCurrentRecommended = currentStep?.componentId === comp.id && !isInstalled;

                return (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedCompId(comp.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all pressable-element ${
                      isSelected
                        ? 'border-cyan-500/60 bg-cyan-950/40 ring-1 ring-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.18)]'
                        : isInstalled
                        ? 'border-slate-800/60 bg-slate-900/30 opacity-70'
                        : isCurrentRecommended
                        ? 'border-cyan-500/30 bg-cyan-950/20 ring-1 ring-cyan-500/15'
                        : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="size-8 rounded-lg shrink-0 border border-slate-700/80 flex items-center justify-center text-white text-[10px] font-extrabold uppercase font-mono shadow-2xs"
                        style={{ backgroundColor: comp.visual.color }}
                      >
                        {comp.category.substring(0, 3)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold truncate text-foreground">
                            {comp.name}
                          </span>
                          {isCurrentRecommended && (
                            <span
                              className="size-2 rounded-full bg-cyan-400 shrink-0 animate-pulse"
                              title="Next recommended step"
                            />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {comp.category}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      {isInstalled ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                          <CheckCircle2 className="size-3.5" />
                          <span>Placed</span>
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant={isCurrentRecommended ? 'default' : 'secondary'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstallClick(comp.id);
                          }}
                          className={`h-7 text-xs px-2.5 pressable-element shadow-2xs font-semibold cursor-pointer ${
                            isCurrentRecommended ? 'btn-primary' : 'btn-glass'
                          }`}
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
      {preview3DCompId &&
        (() => {
          const comp3D = components.find((c) => c.id === preview3DCompId);
          const partType = comp3D ? CATEGORY_TO_3D[comp3D.category] : undefined;
          if (!comp3D || !partType) return null;

          return (
            <Dialog open={true} onOpenChange={(open) => !open && setPreview3DCompId(null)}>
              <DialogContent className="max-w-2xl bg-slate-900/95 border-slate-800/90 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <BrandBadge variant="cyan">
                      {comp3D.category}
                    </BrandBadge>
                    <DialogTitle className="text-lg font-bold font-display text-foreground">
                      <GradientText variant="subtle" as="span">
                        {comp3D.name}
                      </GradientText>
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Interactive 3D model: drag to rotate and inspect contacts, pins, and physical form factor.
                  </DialogDescription>
                </DialogHeader>

                <div className="relative w-full h-84 sm:h-96 min-h-[350px] rounded-xl overflow-hidden bg-blueprint-dots border border-slate-800/80 shadow-inner">
                  {/* Studio Reticles */}
                  <div className="absolute top-2 left-2 size-3 border-t-2 border-l-2 border-slate-600/70 pointer-events-none z-10 opacity-70" />
                  <div className="absolute top-2 right-2 size-3 border-t-2 border-r-2 border-slate-600/70 pointer-events-none z-10 opacity-70" />
                  <div className="absolute bottom-2 left-2 size-3 border-b-2 border-l-2 border-slate-600/70 pointer-events-none z-10 opacity-70" />
                  <div className="absolute bottom-2 right-2 size-3 border-b-2 border-r-2 border-slate-600/70 pointer-events-none z-10 opacity-70" />

                  <Scene3D
                    key={partType}
                    cameraPosition={[4.5, 3.5, 5.5]}
                    autoFit={true}
                    targetFill={0.84}
                    autoCenter={true}
                    autoRotate
                    autoRotateSpeed={0.8}
                  >
                    <Part3D type={partType} animated fitContainer autoCenter />
                  </Scene3D>
                </div>

                <div className="text-xs text-muted-foreground space-y-1.5 bg-cyan-950/30 p-3.5 rounded-xl border border-cyan-500/30">
                  <div className="text-cyan-300 font-bold uppercase font-mono text-[11px] flex items-center gap-1.5">
                    <Info className="size-3.5" />
                    <span>Physical Architecture &amp; Installation Guidance:</span>
                  </div>
                  <p className="text-foreground leading-relaxed">{comp3D.conceptText}</p>
                </div>
              </DialogContent>
            </Dialog>
          );
        })()}
    </div>
  );
};

export default GuidedAssemblyScreen;
