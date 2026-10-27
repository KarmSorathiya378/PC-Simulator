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
  Info,
  Maximize2,
  Cpu,
  Tv,
  CircuitBoard,
  Zap,
  Fan,
  Cable as CableIcon,
  HardDrive,
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

export const Hardware3DPreview: React.FC = () => {
  const [selectedPart, setSelectedPart] = useState<HardwarePartType>('gpu');
  const [showExploded, setShowExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

  const activeMeta =
    HARDWARE_CATALOG.find((p) => p.id === selectedPart) ?? HARDWARE_CATALOG[0];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              PC Hardware 3D Lab
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-medium">
                WebGL 2.0 • Three.js
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive stylized-realistic 3D hardware models with procedural PBR materials
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExploded(!showExploded)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              showExploded
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm shadow-cyan-500/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showExploded ? 'Single Part Mode' : 'Exploded PC Rig'}
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              autoRotate
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Auto-Rotate
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              wireframe
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Wireframe
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        {/* Left Sidebar: Part Navigation List */}
        <aside className="lg:col-span-3 border-r border-slate-800/80 bg-slate-900/40 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-2 mb-2 flex items-center justify-between">
              <span>Hardware Parts</span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
                {HARDWARE_CATALOG.length} models
              </span>
            </div>

            {HARDWARE_CATALOG.map((part) => {
              const Icon = ICONS[part.id];
              const isSelected = selectedPart === part.id && !showExploded;
              return (
                <button
                  key={part.id}
                  onClick={() => {
                    setSelectedPart(part.id);
                    setShowExploded(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center gap-3 ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200 shadow-sm shadow-cyan-500/10'
                      : 'border-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{part.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {part.category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Technical Summary Card */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Info className="w-4 h-4" />
              <span>3D Model Specs</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px]">Renderer</span>
                Three.js PBR
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Shadows</span>
                Contact & Soft
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Shading</span>
                ACESFilmic
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Textures</span>
                Procedural Canvas
              </div>
            </div>
          </div>
        </aside>

        {/* Center: 3D Canvas Viewport */}
        <main className="lg:col-span-6 relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col min-h-[480px]">
          {/* Canvas Navigation Hint */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Click & Drag to Orbit • Scroll to Zoom</span>
          </div>

          {hoveredInfo && (
            <div className="absolute top-4 right-4 z-10 bg-cyan-950/80 backdrop-blur border border-cyan-500/40 text-cyan-200 text-xs px-3 py-1.5 rounded-lg shadow-lg">
              {hoveredInfo}
            </div>
          )}

          {/* The R3F Scene */}
          <div className="flex-1 w-full h-full">
            <Scene3D
              autoRotate={autoRotate}
              autoRotateSpeed={0.8}
              cameraPosition={showExploded ? [14, 10, 16] : [6, 4, 8]}
              fov={38}
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
                /* Single Part Focus View */
                <Part3D
                  type={selectedPart}
                  scale={selectedPart === 'cpu' ? 1.4 : selectedPart === 'ram' ? 1.3 : 1.0}
                  wireframe={wireframe}
                  onHover={(h) => setHoveredInfo(h ? activeMeta.name : null)}
                />
              )}
            </Scene3D>
          </div>
        </main>

        {/* Right Sidebar: Active Component Specification Inspector */}
        <aside className="lg:col-span-3 border-l border-slate-800/80 bg-slate-900/40 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                {activeMeta.category}
              </div>
              <h2 className="text-base font-bold text-white leading-snug">
                {activeMeta.name}
              </h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {activeMeta.description}
              </p>
            </div>

            {/* Scale Dimensions */}
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <div className="text-[11px] font-semibold text-slate-400 mb-2">
                Physical Form Factor Dimensions
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
                  <span className="block text-[10px] text-slate-400">Width</span>
                  <span className="font-semibold text-white">
                    {activeMeta.dimensionsMm.width} mm
                  </span>
                </div>
                <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
                  <span className="block text-[10px] text-slate-400">Height</span>
                  <span className="font-semibold text-white">
                    {activeMeta.dimensionsMm.height} mm
                  </span>
                </div>
                <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
                  <span className="block text-[10px] text-slate-400">Depth</span>
                  <span className="font-semibold text-white">
                    {activeMeta.dimensionsMm.depth} mm
                  </span>
                </div>
              </div>
            </div>

            {/* Key Hardware Features */}
            <div>
              <div className="text-xs font-semibold text-slate-300 mb-2">
                Key Hardware Features
              </div>
              <ul className="space-y-2">
                {activeMeta.keySpecs.map((spec, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-300 flex items-start gap-2 bg-slate-800/30 p-2 rounded-lg border border-slate-800"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-xs">
            <span className="font-semibold block mb-1 text-indigo-300">
              Interactive 3D Guidance
            </span>
            Rotate with the mouse to inspect socket pins, connector notches, and heatsink
            fins before placing components into the virtual case!
          </div>
        </aside>
      </div>
    </div>
  );
};
