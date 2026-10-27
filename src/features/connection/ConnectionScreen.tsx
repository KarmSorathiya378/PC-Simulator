import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cable,
  Zap,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Power,
  Cpu,
  Layers,
  Sparkles,
  Box,
} from 'lucide-react';
import { useAssemblyStore } from '../../store/assemblyStore';
import { requiredConnections } from '../../data/buildConfig';
import { SOCKET_COORDINATES } from '../../data/connectionConfig';
import { AssemblyCanvas } from '../../simulator/AssemblyCanvas';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
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
}

const CABLE_OPTIONS: CableOption[] = [
  {
    cableId: 'cable-24pin-atx',
    name: '24-Pin ATX Main Motherboard Power',
    socketId: 'socket-mb-24pin',
    voltage: '+3.3V, +5V, +12V Rails',
    description: 'Delivers primary DC operational current to motherboard chipset, RAM channels, and PCIe trace lanes.',
  },
  {
    cableId: 'cable-8pin-eps',
    name: '8-Pin (4+4) EPS CPU 12V Power',
    socketId: 'socket-cpu-8pin',
    voltage: '+12V Dedicated Rail',
    description: 'Powers the motherboard Voltage Regulator Modules (VRMs) to feed the multi-core AMD Ryzen processor.',
  },
  {
    cableId: 'cable-8pin-pcie',
    name: '8-Pin (6+2) PCIe Graphics Power',
    socketId: 'socket-gpu-pcie',
    voltage: '+12V High-Amperage Rail',
    description: 'Delivers auxiliary dedicated wattage (up to 150W per connector) for the NVIDIA RTX 4070 Super GPU.',
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
        message: `Successfully connected ${cableId} to ${socketId}! Power rail established.`,
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
          message: 'POST Passed! All motherboard diagnostic LEDs illuminated green. System successfully boots into UEFI BIOS!',
        });
      } else {
        setPowerOnSuccess(false);
        setFeedback({
          ok: false,
          message: 'POST Failed: No power delivered to one or more components. Check missing cables on the checklist.',
        });
      }
    }, 1200);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Connection Mode</span>
      </div>

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Cable className="size-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Power Cabling &amp; Wiring Studio
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Route and latch the essential modular power cables from the 850W PSU to motherboard and graphics sockets.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShow3DInspector(true)}
            className="gap-1.5 text-xs font-medium"
          >
            <Box className="size-3.5 text-primary" />
            <span>3D Wiring Inspector</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSimulatePost}
            disabled={isPoweringUp}
            className={`gap-1.5 font-semibold active:scale-95 transition-all shadow-xs ${
              powerOnSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            <Power className={`size-3.5 ${isPoweringUp ? 'animate-spin' : ''}`} />
            <span>{isPoweringUp ? 'Running POST...' : 'Simulate Power ON'}</span>
          </Button>

          <Link to="/results">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <span>View Scorecard</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
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
        {/* Center: Konva 2D Canvas in Connection Mode */}
        <div className="xl:col-span-8 flex flex-col items-center gap-4">
          <AssemblyCanvas
            interactiveMode="connection"
            width={680}
            height={560}
          />

          {/* Diagnostic Status Box */}
          <div className="w-full rounded-xl border border-border/80 bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                  powerOnSuccess === true
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : powerOnSuccess === false
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                <Zap className="size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Power Rails Status
                </h4>
                <p className="text-xs text-muted-foreground">
                  {allConnected
                    ? 'All 3 essential power cables securely seated and latched. Ready for POST ignition.'
                    : `${progress.connectedCount} of ${requiredConnections.length} cables connected. Route remaining rails.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {allConnected && (
                <Link to="/results">
                  <Button size="sm" className="gap-2 font-semibold shadow-xs">
                    <Sparkles className="size-3.5" />
                    <span>Proceed to Assessment Quiz</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Cable Roster & Checklist */}
        <div className="xl:col-span-4 space-y-4">
          {/* Progress Tracker Card */}
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold tracking-tight text-foreground">
                  Cabling Checklist
                </CardTitle>
                <Badge variant={allConnected ? 'default' : 'secondary'} className="font-mono text-xs">
                  {progress.connectedCount} / {requiredConnections.length} Rails
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                All cables must be routed from the bottom PSU shroud to their target sockets.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
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
                      className={`p-3 rounded-lg border cursor-pointer transition-all active:scale-[0.99] ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-xs'
                          : isConnected
                          ? 'border-emerald-500/40 bg-emerald-500/5'
                          : 'border-border/80 bg-card hover:border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Zap
                            className={`size-4 shrink-0 ${
                              isConnected ? 'text-emerald-500' : 'text-muted-foreground'
                            }`}
                          />
                          <span className="text-xs font-semibold truncate text-foreground">
                            {cable.name}
                          </span>
                        </div>
                        {isConnected ? (
                          <Badge variant="default" className="bg-emerald-600 text-white text-[10px] shrink-0">
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            Unplugged
                          </Badge>
                        )}
                      </div>

                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Target: <code className="font-mono text-foreground">{cable.socketId}</code></span>
                        <span>{cable.voltage}</span>
                      </div>

                      {!isConnected && (
                        <div className="mt-2 pt-2 border-t border-border/60 flex justify-end">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConnectCable(cable.cableId, cable.socketId);
                            }}
                            className="h-7 text-xs px-3 gap-1 active:scale-95"
                          >
                            <Cable className="size-3" />
                            <span>Connect Cable</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Cable Details */}
          {selectedCableId && (() => {
            const cable = CABLE_OPTIONS.find((c) => c.cableId === selectedCableId);
            if (!cable) return null;
            const isConnected = store.connections.some((c) => c.cableId === cable.cableId);

            return (
              <Card className="border-border/80 bg-muted/20 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Hardware Pinout Spec
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {cable.description}
                </p>
                <div className="text-xs font-mono text-muted-foreground pt-1 border-t border-border/60 flex justify-between">
                  <span>Rail: {cable.voltage}</span>
                  <span className={isConnected ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                    {isConnected ? 'LATCHED' : 'AWAITING SEATING'}
                  </span>
                </div>
              </Card>
            );
          })()}
        </div>
      </div>

      {/* 3D Power Harness & Cabling Inspection Modal */}
      {show3DInspector && (
        <Dialog open={true} onOpenChange={(open) => !open && setShow3DInspector(false)}>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs uppercase font-mono">
                  Modular Harness 3D
                </Badge>
                <DialogTitle className="text-lg font-bold">24-Pin Sleeved ATX Power Cable</DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Rotate with mouse to examine the molded terminal block, dual-row gold pins, and retention snap latch.
              </DialogDescription>
            </DialogHeader>

            <div className="w-full h-72 rounded-xl overflow-hidden bg-slate-950/80 border border-border/80 shadow-inner">
              <Scene3D cameraPosition={[3, 2, 4]} autoRotate autoRotateSpeed={1.0}>
                <Part3D type="cable" animated />
              </Scene3D>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 bg-muted/30 p-3 rounded-lg border border-border/60">
              <div className="text-foreground font-semibold">Cabling Key Safety Rule:</div>
              <p>
                Modern high-wattage power supplies use keyed latching pins to prevent reverse polarity.
                Ensure the release tab snaps firmly over the header clip before powering on.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ConnectionScreen;
