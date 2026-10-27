import React, { useState } from 'react';
import { Scene3D } from './Scene3D';
import { Part3D } from './Part3D';
import type { HardwarePartType, PartVisualMetadata } from './types';
import {
  RotateCcw,
  Eye,
  Box,
  Layers,
  Sparkles,
  Maximize2,
  Cpu,
  Tv,
  CircuitBoard,
  Zap,
  Fan,
  Cable as CableIcon,
  HardDrive,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

const HARDWARE_CATALOG: PartVisualMetadata[] = [
  {
    id: 'cpu',
    name: 'AMD Ryzen 7 7800X3D Processor',
    category: 'Central Processing Unit',
    description:
      '8-core, 16-thread desktop CPU featuring 3D V-Cache architecture on the AMD AM5 LGA1718 socket.',
    keySpecs: [
      'AM5 LGA1718 Socket Standard',
      'Brushed Nickel Stepped IHS',
      '96MB L3 3D V-Cache',
      'Gold Alignment Triangle & Key Notches',
    ],
    dimensionsMm: { width: 40, height: 40, depth: 4 },
  },
  {
    id: 'ram',
    name: 'Corsair Vengeance DDR5-6000 32GB',
    category: 'System Memory (RAM)',
    description:
      'High-speed dual-channel DDR5 synchronous dynamic RAM with anodized aluminum heat spreaders and frosted RGB lightbar.',
    keySpecs: [
      'DDR5 6000 MT/s Low Latency',
      'Asymmetrical Key Notch',
      'Precision Gold Edge Contacts',
      'Dual-Sided Aluminum Heat Armor',
    ],
    dimensionsMm: { width: 133, height: 35, depth: 7 },
  },
  {
    id: 'gpu',
    name: 'NVIDIA GeForce RTX 4070 SUPER',
    category: 'Graphics Processing Unit',
    description:
      'Dual-slot gaming graphics card featuring dual axial cooling fans, dense aluminum heatsink fin stack, and reinforced PCIe bracket.',
    keySpecs: [
      'PCIe 4.0 x16 Gold Finger Bus',
      'Dual Dynamic Axial Fans',
      'Sinuous Copper Heatpipe Matrix',
      '12VHPWR 16-Pin Power Port',
    ],
    dimensionsMm: { width: 242, height: 112, depth: 40 },
  },
  {
    id: 'motherboard',
    name: 'MSI MAG B650 Tomahawk WiFi Motherboard',
    category: 'Motherboard PCB',
    description:
      'Full-size ATX motherboard featuring AM5 LGA socket, quad DDR5 DIMMs, reinforced PCIe slot, and heavy VRM power heatsinks.',
    keySpecs: [
      'Standard 9-Hole ATX Footprint',
      'Dual M.2 Shield Heatsinks',
      'Heavy Anodized VRM Blocks',
      'Integrated Rear I/O Shield Plate',
    ],
    dimensionsMm: { width: 305, height: 305, depth: 45 },
  },
  {
    id: 'psu',
    name: 'Corsair RM750e 750W 80+ Gold Modular',
    category: 'Power Supply Unit',
    description:
      'High-efficiency compact ATX power supply with bottom intake fan, rear honeycomb exhaust, and full modular socket terminal bay.',
    keySpecs: [
      '80 PLUS Gold Efficiency',
      'Honeycomb Hexagonal Mesh Exhaust',
      'Full Modular Cable Socket Array',
      '120mm Fluid-Dynamic Bearing Fan',
    ],
    dimensionsMm: { width: 150, height: 86, depth: 140 },
  },
  {
    id: 'fan',
    name: '120mm PWM Chassis Cooling Fan',
    category: 'Case Cooling Fan',
    description:
      'High-static-pressure 120mm case fan with 9 aerodynamically swept blades, silicone anti-vibration corner pads, and center badge.',
    keySpecs: [
      '120mm x 25mm Standard Frame',
      '9 Swept Curved Rotor Blades',
      'Anti-Vibration Silicone Pads',
      '4-Pin PWM Speed Regulation',
    ],
    dimensionsMm: { width: 120, height: 120, depth: 25 },
  },
  {
    id: 'cable',
    name: '24-Pin ATX Sleeved Power Harness',
    category: 'Power Delivery Cable',
    description:
      'Premium custom individually sleeved modular cable set with dual acrylic combs and gold-plated terminal pins.',
    keySpecs: [
      '24 Individually Braided Sleeves',
      'Dual Clear Acrylic Cable Combs',
      'Molded Black Nylon Header Plug',
      'High-Current Gold Plated Pins',
    ],
    dimensionsMm: { width: 55, height: 250, depth: 15 },
  },
  {
    id: 'case',
    name: 'Mid-Tower ATX PC Chassis',
    category: 'Computer Enclosure',
    description:
      'High-airflow steel mid-tower enclosure with tempered glass side panel, bottom PSU shroud, and pre-installed motherboard standoffs.',
    keySpecs: [
      'Standard ATX Mid-Tower Form Factor',
      'Tempered Glass Side Window Panel',
      'Bottom PSU Basement Chamber',
      'Front Mesh High-Airflow Intake',
    ],
    dimensionsMm: { width: 210, height: 460, depth: 420 },
  },
  {
    id: 'ssd',
    name: 'Samsung 990 PRO 1TB PCIe 4.0 NVMe SSD',
    category: 'Solid State Storage',
    description:
      'M.2 2280 form factor ultra-fast non-volatile storage drive with nickel-coated controller and M-key gold edge connector.',
    keySpecs: [
      'M.2 2280 Form Factor Standard',
      'PCIe Gen 4.0 x4 NVMe Protocol',
      'Gold M-Key Edge Connector',
      'Semi-Conductive Thermal Heat Shield',
    ],
    dimensionsMm: { width: 22, height: 80, depth: 3.5 },
  },
];

const ICONS: Record<HardwarePartType, React.ElementType> = {
  cpu: Cpu,
  ram: Layers,
  gpu: Tv,
  motherboard: CircuitBoard,
  psu: Zap,
  fan: Fan,
  cable: CableIcon,
  case: Box,
  ssd: HardDrive,
};

/**
 * Presentation configuration for each hardware part.
 * Sets optimal 3D perspective orientation so all physical details
 * (IHS, contacts, ports, fan blades) face the camera attractively.
 */
interface PartPresentationConfig {
  rotation: [number, number, number];
  cameraPosition: [number, number, number];
}

const PART_PRESENTATION_CONFIG: Record<HardwarePartType, PartPresentationConfig> = {
  cpu: {
    rotation: [0.35, 0.4, 0],
    cameraPosition: [4.5, 4.0, 5.5],
  },
  ram: {
    rotation: [0.15, 0.55, 0],
    cameraPosition: [5.0, 3.5, 6.0],
  },
  gpu: {
    rotation: [0.15, -0.4, 0],
    cameraPosition: [6.0, 4.0, 7.5],
  },
  motherboard: {
    rotation: [0.45, 0.35, 0],
    cameraPosition: [6.5, 6.0, 8.0],
  },
  psu: {
    rotation: [0.25, 0.55, 0],
    cameraPosition: [5.5, 4.0, 6.5],
  },
  fan: {
    rotation: [0.15, 0.35, 0],
    cameraPosition: [5.0, 4.0, 6.0],
  },
  cable: {
    rotation: [0.15, 0.3, 0],
    cameraPosition: [5.0, 4.0, 6.5],
  },
  case: {
    rotation: [0.15, -0.6, 0],
    cameraPosition: [7.5, 5.0, 9.5],
  },
  ssd: {
    rotation: [0.25, 0.45, 0],
    cameraPosition: [5.0, 3.5, 6.0],
  },
};

export const Hardware3DPreview: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<HardwarePartType>('gpu');
  const [showExploded, setShowExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

  const activeMeta =
    HARDWARE_CATALOG.find((p) => p.id === selectedPart) ?? HARDWARE_CATALOG[0];

  const partConfig = PART_PRESENTATION_CONFIG[selectedPart] ?? {
    rotation: [0, 0, 0],
    cameraPosition: [6, 4, 8],
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <header className="border-b border-border bg-card/80 glass-surface px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs shadow-primary/25">
            <Box className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight font-display text-foreground">
                Hardware 3D Studio
              </h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-primary-light border border-primary-border text-primary font-mono font-medium">
                Auto-Framed PBR
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Responsive WebGL viewport auto-scaled to 85% container fill with dynamic studio lighting
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowExploded(!showExploded)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer pressable-element ${
              showExploded
                ? 'bg-primary text-primary-foreground border-primary shadow-xs shadow-primary/25 font-bold'
                : 'bg-secondary text-secondary-foreground hover:bg-muted border-border'
            }`}
          >
            <Sparkles className="size-3.5" />
            <span>{showExploded ? 'Single Part Focus' : 'Exploded Hardware Rig'}</span>
          </button>

          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer pressable-element ${
              autoRotate
                ? 'bg-primary-light text-primary border-primary-border font-semibold'
                : 'bg-secondary text-muted-foreground hover:text-foreground border-border'
            }`}
          >
            <RotateCcw className="size-3.5" />
            <span>Auto-Rotate</span>
          </button>

          <button
            type="button"
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer pressable-element ${
              wireframe
                ? 'bg-accent-warm-light text-accent-warm-foreground border-accent-warm-border font-semibold'
                : 'bg-secondary text-muted-foreground hover:text-foreground border-border'
            }`}
          >
            <Eye className="size-3.5" />
            <span>Wireframe</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        {/* Left Sidebar: Part Navigation List */}
        <aside className="lg:col-span-3 border-r border-border bg-background-subtle/40 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-2 mb-2 flex items-center justify-between">
              <span>Hardware Catalog</span>
              <span className="text-[10px] text-primary bg-primary-light px-2 py-0.5 rounded-full border border-primary-border font-mono font-medium">
                {HARDWARE_CATALOG.length} models
              </span>
            </div>

            <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {HARDWARE_CATALOG.map((part) => {
                const Icon = ICONS[part.id];
                const isSelected = selectedPart === part.id && !showExploded;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => {
                      setSelectedPart(part.id);
                      setShowExploded(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center gap-3 cursor-pointer pressable-element ${
                      isSelected
                        ? 'bg-primary-light border-primary-border text-primary shadow-xs ring-1 ring-primary/20 font-medium'
                        : 'border-transparent hover:bg-card text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-primary text-primary-foreground font-bold shadow-2xs'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate text-foreground">
                        {part.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {part.category}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Technical Summary Card */}
          <div className="p-3.5 rounded-xl card-elevated border border-border text-xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-primary font-semibold">
              <Sliders className="size-3.5" />
              <span>Viewport Auto-Framing</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-1.5 rounded-lg bg-background-subtle/80 border border-border-subtle">
                <span className="text-muted-foreground block text-[9px] uppercase font-mono">Fill Target</span>
                <span className="font-semibold text-foreground">85% Viewport</span>
              </div>
              <div className="p-1.5 rounded-lg bg-background-subtle/80 border border-border-subtle">
                <span className="text-muted-foreground block text-[9px] uppercase font-mono">Centering</span>
                <span className="font-semibold text-foreground">Bounding Center</span>
              </div>
              <div className="p-1.5 rounded-lg bg-background-subtle/80 border border-border-subtle">
                <span className="text-muted-foreground block text-[9px] uppercase font-mono">Responsive</span>
                <span className="font-semibold text-foreground">Mobile &amp; Desktop</span>
              </div>
              <div className="p-1.5 rounded-lg bg-background-subtle/80 border border-border-subtle">
                <span className="text-muted-foreground block text-[9px] uppercase font-mono">Shadows</span>
                <span className="font-semibold text-foreground">Ground Dynamic</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: 3D Canvas Viewport */}
        <main className="lg:col-span-6 relative bg-blueprint-dots border-r border-border flex flex-col min-h-[480px] h-[55vh] lg:h-auto overflow-hidden">
          {/* Subtle Radial Pedestal Highlight */}
          <div
            className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-30"
            style={{
              background:
                'radial-gradient(ellipse at 50% 55%, var(--card) 0%, transparent 72%)',
            }}
          />

          {/* Studio Tech Reticle Rings on Floor */}
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 55%, transparent 220px, var(--border-strong) 221px, transparent 222px, transparent 320px, var(--border-strong) 321px, transparent 322px)',
            }}
          />

          {/* Architectural Viewport Frame Crosshairs */}
          <div className="absolute top-3 left-3 size-4 border-t-2 border-l-2 border-border-strong pointer-events-none z-10 opacity-70" />
          <div className="absolute top-3 right-3 size-4 border-t-2 border-r-2 border-border-strong pointer-events-none z-10 opacity-70" />
          <div className="absolute bottom-3 left-3 size-4 border-b-2 border-l-2 border-border-strong pointer-events-none z-10 opacity-70" />
          <div className="absolute bottom-3 right-3 size-4 border-b-2 border-r-2 border-border-strong pointer-events-none z-10 opacity-70" />

          {/* Canvas Navigation Hint HUD */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none glass-surface px-3 py-1.5 rounded-lg border border-border text-[11px] text-muted-foreground flex items-center gap-2 shadow-xs">
            <Maximize2 className="size-3.5 text-primary" />
            <span>Drag to Orbit • Scroll to Zoom</span>
          </div>

          {hoveredInfo && (
            <div className="absolute top-4 right-4 z-10 glass-surface border border-primary-border bg-primary-light text-primary text-xs font-mono font-medium px-3 py-1.5 rounded-lg shadow-sm animate-in fade-in duration-150">
              {hoveredInfo}
            </div>
          )}

          {/* The R3F Scene Viewport with 88% Auto-Fit Framing */}
          <div className="flex-1 w-full h-full min-h-[460px]">
            <Scene3D
              autoFit={true}
              targetFill={0.88}
              autoCenter={true}
              autoRotate={autoRotate}
              autoRotateSpeed={0.8}
              cameraPosition={showExploded ? [14, 10, 16] : partConfig.cameraPosition}
              fov={38}
              key={selectedPart + (showExploded ? '-exploded' : '-single')}
            >
              {showExploded ? (
                /* Exploded Assembly Rig showcasing all 7 parts spatially separated */
                <group position={[0, 0, 0]}>
                  {/* Motherboard centered at base */}
                  <Part3D
                    type="motherboard"
                    wireframe={wireframe}
                    onHover={(h) => setHoveredInfo(h ? 'MSI B650 Motherboard' : null)}
                  />

                  {/* CPU elevated above socket */}
                  <Part3D
                    type="cpu"
                    position={[-0.8, 1.8, -1.0]}
                    wireframe={wireframe}
                    onHover={(h) => setHoveredInfo(h ? 'Ryzen 7 7800X3D CPU' : null)}
                  />

                  {/* RAM stick elevated above DIMM slot */}
                  <Part3D
                    type="ram"
                    position={[1.8, 2.2, -0.9]}
                    rotation={[0, Math.PI / 2, 0]}
                    wireframe={wireframe}
                    onHover={(h) => setHoveredInfo(h ? 'Corsair DDR5 RAM' : null)}
                  />

                  {/* GPU pulled out from PCIe slot */}
                  <Part3D
                    type="gpu"
                    position={[-0.8, 1.2, 4.2]}
                    wireframe={wireframe}
                    onHover={(h) => setHoveredInfo(h ? 'GeForce RTX 4070 SUPER' : null)}
                  />

                  {/* PSU offset to bottom right */}
                  <Part3D
                    type="psu"
                    position={[5.5, -0.5, 3.2]}
                    wireframe={wireframe}
                    onHover={(h) => setHoveredInfo(h ? 'Corsair RM750e PSU' : null)}
                  />

                  {/* Case Fan elevated at upper left */}
                  <Part3D
                    type="fan"
                    position={[-4.5, 3.2, -1.5]}
                    wireframe={wireframe}
                    onHover={(h) => setHoveredInfo(h ? '120mm PWM Fan' : null)}
                  />

                  {/* 24-Pin Cable looping between PSU and Board */}
                  <Part3D
                    type="cable"
                    position={[4.2, 1.6, -0.8]}
                    scale={0.85}
                    wireframe={wireframe}
                    onHover={(h) => setHoveredInfo(h ? '24-Pin Sleeved Cable' : null)}
                  />
                </group>
              ) : (
                /* Single Part Focus View: auto-scaled and auto-framed to 85% fill */
                <Part3D
                  type={selectedPart}
                  rotation={partConfig.rotation}
                  wireframe={wireframe}
                  fitContainer={true}
                  onHover={(h) => setHoveredInfo(h ? activeMeta.name : null)}
                />
              )}
            </Scene3D>
          </div>
        </main>

        {/* Right Sidebar: Active Component Specification Inspector */}
        <aside className="lg:col-span-3 bg-card/60 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-bold text-accent-warm uppercase tracking-wider font-mono mb-1">
                {activeMeta.category}
              </div>
              <h2 className="text-base font-extrabold text-foreground font-display leading-snug">
                {activeMeta.name}
              </h2>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                {activeMeta.description}
              </p>
            </div>

            {/* Scale Dimensions */}
            <div className="p-3.5 rounded-xl card-elevated border border-border">
              <div className="text-[11px] font-semibold text-muted-foreground mb-2 flex items-center justify-between">
                <span>Form Factor Dimensions</span>
                <span className="text-[9px] font-mono text-primary font-bold">1:1 Metric Scale</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-background-subtle/80 p-2 rounded-lg border border-border-subtle">
                  <span className="block text-[10px] text-muted-foreground font-mono uppercase">Width</span>
                  <span className="font-bold text-foreground font-mono">
                    {activeMeta.dimensionsMm.width} mm
                  </span>
                </div>
                <div className="bg-background-subtle/80 p-2 rounded-lg border border-border-subtle">
                  <span className="block text-[10px] text-muted-foreground font-mono uppercase">Height</span>
                  <span className="font-bold text-foreground font-mono">
                    {activeMeta.dimensionsMm.height} mm
                  </span>
                </div>
                <div className="bg-background-subtle/80 p-2 rounded-lg border border-border-subtle">
                  <span className="block text-[10px] text-muted-foreground font-mono uppercase">Depth</span>
                  <span className="font-bold text-foreground font-mono">
                    {activeMeta.dimensionsMm.depth} mm
                  </span>
                </div>
              </div>
            </div>

            {/* Key Hardware Features */}
            <div>
              <div className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-success" />
                <span>Hardware Specifications</span>
              </div>
              <ul className="space-y-2">
                {activeMeta.keySpecs.map((spec, i) => (
                  <li
                    key={i}
                    className="text-xs text-muted-foreground flex items-start gap-2 bg-background-subtle/60 p-2.5 rounded-lg border border-border-subtle"
                  >
                    <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span className="text-foreground">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-3.5 rounded-xl bg-primary-light border border-primary-border text-xs text-foreground space-y-1">
            <span className="font-bold block text-primary text-[11px] uppercase tracking-wider font-mono">
              Hardware Technician Tip
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Rotate with the mouse to inspect socket pins, connector notches, and heatsink
              fins before placing components into the virtual chassis!
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Hardware3DPreview;
