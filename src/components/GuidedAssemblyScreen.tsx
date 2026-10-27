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

  // Initialize assemble mode
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

  return (
    <div className="space-y-6 py-2">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-foreground">Guided Assembly</span>
      </nav>

      {/* Screen Title & Top Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs shadow-primary/25">
              <Wrench className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Guided Assembly Lab
                </h1>
                <Badge variant="outline" className="hidden sm:inline-flex text-[11px] font-mono border-primary/30 text-primary">
                  Interactive 3D
                </Badge>
              </div>
              <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                Follow standard hardware build sequence with physical 3D chassis inspection.
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar Controls: 3D/2D View Toggle, Undo, Redo, Reset */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />

          <div className="h-5 w-px bg-border/80 hidden sm:block mx-1" />

          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={store.history.past.length === 0}
            className="gap-1.5 active:scale-95 transition-transform"
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
            className="gap-1.5 active:scale-95 transition-transform"
            title="Redo action"
          >
            <Redo2 className="size-3.5" />
            <span className="hidden sm:inline">Redo</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 active:scale-95 transition-transform"
            title="Reset assembly to start"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>

      {/* Progress & Step Guidance Banner */}
      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={isComplete ? 'success' : 'default'} className="text-xs font-semibold">
                {isComplete ? 'Hardware Assembled' : `Step ${progress.installedCount + 1} of ${slots.length}`}
              </Badge>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {isComplete ? 'All Core Hardware Components Mounted!' : currentStep.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isComplete
                ? 'All components are seated in the chassis. Proceed to Connection Mode to cable the power and data connectors.'
                : 'Select the highlighted hardware part from the tray and click Install, or click directly on the glowing 3D slot.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            {!isComplete && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowHint(!showHint)}
                className="gap-1.5 text-xs font-medium active:scale-95 transition-transform"
              >
                <Lightbulb className="size-3.5 text-amber-500" />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </Button>
            )}

            {isComplete && (
              <Link to="/connection">
                <Button size="sm" className="gap-2 font-semibold shadow-xs animate-pulse">
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
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-foreground flex items-start gap-2.5 animate-in fade-in duration-150">
            <HelpCircle className="size-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-amber-700 dark:text-amber-300">Technician Hint: </strong>
              <span>{currentStep.hint}</span>
            </div>
          </div>
        )}

        {/* Dynamic Feedback Banner */}
        {feedback && (
          <div
            className={`rounded-lg border p-3 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-150 ${
              feedback.ok
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                : 'border-destructive/30 bg-destructive/10 text-destructive'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.ok ? (
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="size-4 shrink-0 text-destructive" />
              )}
              <span className="font-medium">{feedback.message}</span>
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
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>Chassis Installation Progress</span>
            <span className="text-foreground font-mono font-semibold">
              {progress.installedCount} / {slots.length} ({Math.round((progress.installedCount / slots.length) * 100)}%)
            </span>
          </div>
          <Progress value={(progress.installedCount / slots.length) * 100} className="h-2" />
        </div>
      </div>

      {/* Main Workspace: Canvas (3D or 2D) & Hardware Palette */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Main Canvas Area */}
        <div className="xl:col-span-8 flex flex-col items-center">
          {viewMode === '3d' ? (
            <div className="w-full space-y-2">
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
                className="w-full h-[580px] rounded-xl shadow-xs border border-border/80"
              />
              <div className="flex items-center justify-between px-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Box className="size-3.5 text-primary" />
                  <span>Interactive 3D Assembly • Active target glowing cyan</span>
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode('2d')}
                  className="hover:text-foreground underline flex items-center gap-1 cursor-pointer"
                >
                  <Layers className="size-3" />
                  <span>Switch to 2D view</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center space-y-2">
              <div className="w-full flex justify-center bg-card rounded-xl border border-border/80 p-2 shadow-xs">
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
                  <span>2D Schematic Layout • Drag or click parts into target slots</span>
                </span>
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className="hover:text-foreground underline flex items-center gap-1 cursor-pointer"
                >
                  <Box className="size-3" />
                  <span>Switch to 3D view</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Component Inspector & Hardware Tray */}
        <div className="xl:col-span-4 space-y-4">
          {/* Selected Component Quick Action Card */}
          {selectedCompId ? (
            (() => {
              const comp = components.find((c) => c.id === selectedCompId);
              if (!comp) return null;
              const isInstalled = Boolean(
                store.installedPal.some((item) => item.componentId === comp.id)
              );

              return (
                <Card className="border-primary/40 bg-card shadow-xs">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs uppercase font-mono">
                        {comp.category}
                      </Badge>
                      {isInstalled ? (
                        <Badge variant="success" className="text-xs">
                          Installed in Case
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          Ready on Bench
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-foreground">{comp.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {comp.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border/60 pt-2">
                      <div>
                        <strong className="text-foreground">Socket/Slot: </strong>
                        <span>{comp.socket || comp.pcieSlot || comp.interfaceType || comp.formFactor || 'Standard'}</span>
                      </div>
                      <div>
                        <strong className="text-foreground">Chassis Location: </strong>
                        <span>{comp.locationText}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {CATEGORY_TO_3D[comp.category] && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPreview3DCompId(comp.id)}
                          className="gap-1.5 text-xs font-medium shrink-0 active:scale-95 transition-transform"
                        >
                          <Box className="size-3.5 text-primary" />
                          <span>3D View</span>
                        </Button>
                      )}

                      {!isInstalled && (
                        <Button
                          size="sm"
                          onClick={() => handleInstallClick(comp.id)}
                          className="w-full gap-2 font-medium active:scale-95 transition-transform"
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
                          className="w-full gap-2 text-xs active:scale-95 transition-transform"
                        >
                          <span>Remove Component</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })()
          ) : (
            <Card className="border-border/80 bg-muted/20 p-4 text-center space-y-2">
              <div className="flex justify-center">
                <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <Eye className="size-5" />
                </div>
              </div>
              <h4 className="text-xs font-semibold text-foreground">No Component Selected</h4>
              <p className="text-xs text-muted-foreground">
                Click any part from the hardware tray below or select a slot in the 3D canvas to inspect details and actions.
              </p>
            </Card>
          )}

          {/* Component Tray / Inventory Dock */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hardware Tray ({components.filter((c) => c.category !== 'case').length} parts)
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                Click to inspect or mount
              </span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {components
                .filter((c) => c.category !== 'case')
                .map((comp) => {
                  const isInstalled = Boolean(
                    store.installedPal.some((item) => item.componentId === comp.id)
                  );
                  const isSelected = selectedCompId === comp.id;
                  const isCurrentRecommended = currentStep?.componentId === comp.id && !isInstalled;

                  return (
                    <div
                      key={comp.id}
                      onClick={() => setSelectedCompId(comp.id)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-xs'
                          : isInstalled
                          ? 'border-border/60 bg-muted/40 opacity-70'
                          : isCurrentRecommended
                          ? 'border-primary/50 bg-primary/5 ring-1 ring-primary/10'
                          : 'border-border/80 bg-card hover:border-border'
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
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold truncate text-foreground">
                              {comp.name}
                            </span>
                            {isCurrentRecommended && (
                              <span className="flex size-2 rounded-full bg-primary shrink-0 animate-pulse" title="Next recommended step" />
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground capitalize">
                            {comp.category}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 pl-2">
                        {isInstalled ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
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
                            className="h-7 text-xs px-2.5 active:scale-95 shadow-2xs"
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
              <DialogContent className="max-w-2xl bg-card border-border">
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs uppercase font-mono">
                      {comp3D.category}
                    </Badge>
                    <DialogTitle className="text-lg font-bold">{comp3D.name}</DialogTitle>
                  </div>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Rotate with mouse or drag to inspect contacts, pins, and physical details in 3D.
                  </DialogDescription>
                </DialogHeader>

                <div className="w-full h-72 rounded-xl overflow-hidden bg-slate-950/80 border border-border/80 shadow-inner">
                  <Scene3D cameraPosition={[4, 3, 5]} autoRotate autoRotateSpeed={0.8}>
                    <Part3D type={partType} animated />
                  </Scene3D>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-3 rounded-lg border border-border/60">
                  <div className="text-foreground font-semibold">Anatomy &amp; Assembly Tips:</div>
                  <p>{comp3D.conceptText}</p>
                </div>
              </DialogContent>
            </Dialog>
          );
        })()}
    </div>
  );
};

export default GuidedAssemblyScreen;
