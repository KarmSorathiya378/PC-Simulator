import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Cable,
  Zap,
  CheckCircle2,
  AlertCircle,
  Power,
  Box,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Activity,
} from 'lucide-react';
import { useAssemblyStore } from '../../store/assemblyStore';
import { requiredConnections } from '../../data/buildConfig';
import { AssemblyCanvas } from '../../simulator/AssemblyCanvas';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { BrandBadge, GlowCard, GradientText, GlassPanel, Chip } from '../../components/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import { Scene3D, Part3D } from '../../three';

interface CableOption {
  cableId: string;
  name: string;
  socketId: string;
  voltage: string;
  description: string;
  wireGauge: string;
  specStandard: string;
}

const CABLE_OPTIONS: CableOption[] = [
  {
    cableId: 'cable-24pin-atx',
    name: '24-Pin ATX Main Motherboard Power',
    socketId: 'socket-mb-24pin',
    voltage: '+3.3V, +5V, +12V Rails',
    description: 'Delivers primary DC operational current to motherboard chipset, RAM channels, and PCIe trace lanes.',
    wireGauge: '18 AWG High-Flex Sleeved',
    specStandard: 'ATX12V v3.0 / EPS12V',
  },
  {
    cableId: 'cable-8pin-eps',
    name: '8-Pin (4+4) EPS CPU 12V Power',
    socketId: 'socket-cpu-8pin',
    voltage: '+12V Dedicated Rail',
    description: 'Powers the motherboard Voltage Regulator Modules (VRMs) to feed the multi-core AMD Ryzen processor.',
    wireGauge: '16 AWG Heavy Duty',
    specStandard: 'EPS12V Dedicated Rail',
  },
  {
    cableId: 'cable-8pin-pcie',
    name: '8-Pin (6+2) PCIe Graphics Power',
    socketId: 'socket-gpu-pcie',
    voltage: '+12V High-Amperage Rail',
    description: 'Delivers auxiliary dedicated wattage (up to 150W per connector) for the NVIDIA RTX 4070 Super GPU.',
    wireGauge: '16 AWG Copper Core',
    specStandard: 'PCIe Auxiliary Spec',
  },
];

export const ConnectionScreen: React.FC = () => {
  const store = useAssemblyStore();

  const [selectedCableId, setSelectedCableId] = useState<string | null>('cable-24pin-atx');
  const [show3DInspector, setShow3DInspector] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [powerOnSuccess, setPowerOnSuccess] = useState<boolean | null>(null);
  const [isPoweringUp, setIsPoweringUp] = useState<boolean>(false);

  useEffect(() => {
    store.startMode('connection');
  }, []);

  const progress = store.getProgress();
  const allConnected = progress.connectedCount >= requiredConnections.length;

  const handleConnectCable = (cableId: string, socketId: string) => {
    const result = store.connect(cableId, socketId);
    if (result.ok) {
      setFeedback({
        ok: true,
        message: `Connected! ${cableId} latched into ${socketId}. DC power rail established.`,
      });
      // Select next unconnected cable
      const nextUnconnected = CABLE_OPTIONS.find(
        (c) => !store.connections.some((conn) => conn.cableId === c.cableId) && c.cableId !== cableId
      );
      if (nextUnconnected) {
        setSelectedCableId(nextUnconnected.cableId);
      }
    } else {
      setFeedback({
        ok: false,
        message: result.reason || 'Connection rejected. Verify target socket pinout.',
      });
    }
  };

  const handleSimulatePost = () => {
    setIsPoweringUp(true);
    setPowerOnSuccess(null);

    setTimeout(() => {
      setIsPoweringUp(false);
      if (allConnected) {
        setPowerOnSuccess(true);
        setFeedback({
          ok: true,
          message: 'POST Passed! All diagnostic LEDs illuminated green. System successfully boots into UEFI BIOS!',
        });
      } else {
        setPowerOnSuccess(false);
        setFeedback({
          ok: false,
          message: 'POST Failed: Missing DC current to one or more subsystems. Check unconnected cables on the checklist.',
        });
      }
    }, 1100);
  };

  const selectedCable = useMemo(() => {
    return CABLE_OPTIONS.find((c) => c.cableId === selectedCableId) || CABLE_OPTIONS[0];
  }, [selectedCableId]);

  return (
    <div className="space-y-8 py-2 w-full max-w-full overflow-hidden font-sans">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground border-b border-border/60 pb-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <Link to="/" className="hover:text-foreground transition-colors">
            Platform
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-semibold text-foreground">Power Cabling &amp; Wiring</span>
        </nav>
        <div className="flex items-center gap-2.5 font-mono text-[11px]">
          <BrandBadge variant="emerald" pulse>750W Gold Modular Rail</BrandBadge>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-muted-foreground">Keyed Retention Clips</span>
        </div>
      </div>

      {/* Screen Hero Header */}
      <GlowCard glowColor="cyan" className="p-6 sm:p-8 card-elevated">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <BrandBadge variant="cyan">
                <Cable className="size-3 mr-1 inline" />
                DC POWER DISTRIBUTION // MODULAR ATX HARNESS
              </BrandBadge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
              Power Cabling &amp; <GradientText variant="cyan-violet">Wiring Studio</GradientText>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Route and securely latch dedicated modular power rails from the PSU shroud to the
              motherboard 24-Pin ATX, 8-Pin EPS CPU, and PCIe graphics headers.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShow3DInspector(true)}
              className="gap-2 text-xs font-medium pressable-element shadow-2xs"
            >
              <Box className="size-3.5 text-primary" />
              <span>3D Harness Inspector</span>
            </Button>

            <Button
              size="sm"
              onClick={handleSimulatePost}
              disabled={isPoweringUp}
              className={`gap-2 font-bold pressable-element shadow-xs ${
                powerOnSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-primary hover:bg-primary-hover text-primary-foreground'
              }`}
            >
              <Power className={`size-3.5 ${isPoweringUp ? 'animate-spin' : ''}`} />
              <span>{isPoweringUp ? 'Running POST...' : 'Simulate Power ON'}</span>
            </Button>

            <Link to="/results">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs pressable-element">
                <span>Scorecard</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
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
        {/* Center: Konva 2D Canvas in Connection Mode */}
        <div className="xl:col-span-8 flex flex-col items-center gap-4">
          <GlassPanel
            variant="surface"
            withInnerBevel
            className="w-full flex justify-center bg-card rounded-2xl border border-border/80 p-3 shadow-xs card-elevated relative overflow-hidden bg-blueprint-dots"
          >
            {/* Viewport Tech Crosshairs */}
            <div className="absolute top-2 left-2 size-3 border-t-2 border-l-2 border-border-strong pointer-events-none z-10 opacity-70" />
            <div className="absolute top-2 right-2 size-3 border-t-2 border-r-2 border-border-strong pointer-events-none z-10 opacity-70" />
            <div className="absolute bottom-2 left-2 size-3 border-b-2 border-l-2 border-border-strong pointer-events-none z-10 opacity-70" />
            <div className="absolute bottom-2 right-2 size-3 border-b-2 border-r-2 border-border-strong pointer-events-none z-10 opacity-70" />

            <AssemblyCanvas
              interactiveMode="connection"
              width={680}
              height={560}
            />
          </GlassPanel>

          {/* Diagnostic Status Box */}
          <GlassPanel
            variant="surface"
            className="w-full rounded-2xl border border-border/80 bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-elevated"
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl border shadow-inner transition-colors ${
                  powerOnSuccess === true
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                    : powerOnSuccess === false
                    ? 'bg-destructive/10 text-destructive border-destructive/30'
                    : 'bg-primary/10 text-primary border-primary/20'
                }`}
              >
                <Zap className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
                  Power Harness Status // POST Check
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {allConnected
                    ? 'All 3 dedicated modular power harnesses latched into their sockets. Ready for UEFI POST ignition.'
                    : `${progress.connectedCount} of ${requiredConnections.length} cables connected. Route remaining rails before power on.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {allConnected && (
                <Link to="/results">
                  <Button size="sm" className="gap-2 font-bold shadow-xs pressable-element bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Sparkles className="size-3.5" />
                    <span>Proceed to Assessment</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          </GlassPanel>
        </div>

        {/* Right Column: Cable Roster & Checklist */}
        <div className="xl:col-span-4 space-y-4">
          {/* Progress Tracker Card */}
          <Card className="border-border/80 bg-card shadow-xs card-elevated">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold tracking-tight text-foreground font-display">
                  Cabling Checklist
                </CardTitle>
                <BrandBadge variant={allConnected ? 'emerald' : 'slate'}>
                  {progress.connectedCount} / {requiredConnections.length} Latched
                </BrandBadge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Connect each power rail from the lower shroud to the target header.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 pt-4">
              <Progress
                value={(progress.connectedCount / requiredConnections.length) * 100}
                className="h-2"
              />

              <div className="space-y-2 pt-1">
                {CABLE_OPTIONS.map((cable) => {
                  const isConnected = store.connections.some(
                    (conn) => conn.cableId === cable.cableId
                  );
                  const isSelected = selectedCableId === cable.cableId;

                  return (
                    <div
                      key={cable.cableId}
                      onClick={() => setSelectedCableId(cable.cableId)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 pressable-element ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-xs'
                          : isConnected
                          ? 'border-emerald-500/40 bg-emerald-500/5'
                          : 'border-border/80 bg-card hover:border-border-strong hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Zap
                            className={`size-4 shrink-0 ${
                              isConnected ? 'text-emerald-500' : 'text-muted-foreground'
                            }`}
                          />
                          <span className="text-xs font-bold truncate text-foreground font-display">
                            {cable.name}
                          </span>
                        </div>
                        {isConnected ? (
                          <BrandBadge variant="emerald" className="text-[10px] shrink-0 font-mono">
                            Latched
                          </BrandBadge>
                        ) : (
                          <BrandBadge variant="slate" className="text-[10px] shrink-0 font-mono">
                            Awaiting
                          </BrandBadge>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                        <span>Target: <code className="text-foreground font-bold">{cable.socketId}</code></span>
                        <span>{cable.voltage.split(',')[0]}</span>
                      </div>

                      {!isConnected && (
                        <div className="mt-2 pt-2 border-t border-border/60 flex justify-end">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConnectCable(cable.cableId, cable.socketId);
                            }}
                            className="h-7 text-xs px-3 gap-1.5 pressable-element shadow-2xs font-semibold"
                          >
                            <Cable className="size-3" />
                            <span>Latch Cable</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Cable Pinout Spec Card */}
          <Card className="border-border/80 bg-card shadow-xs p-5 space-y-3 card-elevated">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
                  Hardware Pinout Spec
                </h4>
              </div>
              <BrandBadge variant="cyan" className="text-[10px]">
                {selectedCable.specStandard}
              </BrandBadge>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedCable.description}
            </p>

            <div className="space-y-1.5 text-xs font-mono text-muted-foreground pt-1 border-t border-border/60">
              <div className="flex justify-between">
                <span>Wire Standard:</span>
                <span className="text-foreground font-semibold">{selectedCable.wireGauge}</span>
              </div>
              <div className="flex justify-between">
                <span>DC Rails:</span>
                <span className="text-foreground font-semibold">{selectedCable.voltage}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Terminal State:</span>
                <span
                  className={
                    store.connections.some((c) => c.cableId === selectedCable.cableId)
                      ? 'text-emerald-500 font-bold'
                      : 'text-amber-500 font-bold'
                  }
                >
                  {store.connections.some((c) => c.cableId === selectedCable.cableId)
                    ? 'CIRCUIT CLOSED'
                    : 'AWAITING SEATING'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 3D Power Harness & Cabling Inspection Modal */}
      {show3DInspector && (
        <Dialog open={true} onOpenChange={(open) => !open && setShow3DInspector(false)}>
          <DialogContent className="max-w-2xl bg-card/95 border-border/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <BrandBadge variant="cyan">
                  Modular Harness 3D
                </BrandBadge>
                <DialogTitle className="text-lg font-bold font-display text-foreground">
                  High-Flex Sleeved ATX Power Connector
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Rotate with mouse drag to examine molded nylon housing, gold contacts, and keyed retention snap.
              </DialogDescription>
            </DialogHeader>

            <div className="w-full h-84 sm:h-96 min-h-[350px] rounded-xl overflow-hidden bg-secondary/30 border border-border/80 shadow-inner relative bg-blueprint-dots">
              <Scene3D
                key="cable"
                cameraPosition={[4.5, 3.5, 5.5]}
                autoFit={true}
                targetFill={0.84}
                autoCenter={true}
                autoRotate
                autoRotateSpeed={1.0}
              >
                <Part3D type="cable" animated fitContainer autoCenter />
              </Scene3D>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full glass-surface border border-border/80 text-[10px] text-muted-foreground font-mono pointer-events-none shadow-xs">
                Drag: Rotate • Scroll: Zoom • Right Drag: Pan
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 bg-primary/10 p-3.5 rounded-xl border border-primary/30">
              <div className="text-primary font-bold font-mono text-[11px] uppercase tracking-wider">
                Electrical Safety Standard:
              </div>
              <p className="text-foreground leading-relaxed">
                Modern high-wattage power supplies utilize keyed pin geometries (squares and bevels) to prevent
                incorrect polarity insertion. Verify the top retention latch snaps firmly over the header clip.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ConnectionScreen;
