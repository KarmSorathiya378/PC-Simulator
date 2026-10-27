import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Wrench,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Search,
  Box,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { components } from '../../data/components';
import type { ComponentDefinition, Category } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  BrandBadge,
  GlowCard,
  GradientText,
  GlassPanel,
  Chip,
  SectionHeading,
} from '../../components/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import { Scene3D, Part3D } from '../../three';
import type { HardwarePartType } from '../../three/types';
import { cn } from '@/lib/utils';

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

const categoryLabels: Record<Category | 'all', { label: string; icon: string }> = {
  all: { label: 'All Hardware', icon: 'ALL' },
  motherboard: { label: 'Motherboard', icon: 'MBD' },
  cpu: { label: 'Processors', icon: 'CPU' },
  cooler: { label: 'Cooling', icon: 'FAN' },
  ram: { label: 'Memory', icon: 'RAM' },
  ssd: { label: 'M.2 NVMe', icon: 'SSD' },
  gpu: { label: 'Graphics', icon: 'GPU' },
  psu: { label: 'Power Supply', icon: 'PSU' },
  case: { label: 'Chassis', icon: 'CHAS' },
};

export const LearnScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompId, setSelectedCompId] = useState<string>('motherboard-b650-01');
  const [inspect3DCompId, setInspect3DCompId] = useState<string | null>(null);

  const filteredComponents = useMemo(() => {
    return components.filter((comp) => {
      const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        comp.name.toLowerCase().includes(q) ||
        comp.description.toLowerCase().includes(q) ||
        comp.category.toLowerCase().includes(q) ||
        (comp.socket && comp.socket.toLowerCase().includes(q)) ||
        (comp.formFactor && comp.formFactor.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const selectedComponent: ComponentDefinition = useMemo(() => {
    return (
      components.find((c) => c.id === selectedCompId) ||
      filteredComponents[0] ||
      components[0]
    );
  }, [selectedCompId, filteredComponents]);

  const active3DPartType = inspect3DCompId
    ? CATEGORY_TO_3D[components.find((c) => c.id === inspect3DCompId)?.category || '']
    : undefined;

  return (
    <div className="space-y-8 py-2 w-full max-w-full overflow-hidden">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground border-b border-border/60 pb-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <Link to="/" className="hover:text-foreground transition-colors font-medium">
            Platform
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-semibold text-foreground">Hardware Atlas &amp; Anatomy</span>
        </nav>
        <div className="flex items-center gap-2.5 font-mono text-[11px]">
          <BrandBadge variant="emerald" pulse>Spec Sheet Verified</BrandBadge>
          <span className="text-muted-foreground/40">•</span>
          <span className="text-primary font-bold">AMD AM5 / PCIe Gen 5 Standard</span>
        </div>
      </div>

      {/* Screen Hero Header */}
      <GlowCard glowColor="cyan" className="p-6 sm:p-8 card-elevated">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <BrandBadge variant="cyan">
                <BookOpen className="size-3 mr-1 inline" />
                HARDWARE ATLAS // SPECIFICATION LEDGER
              </BrandBadge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-display">
              Hardware Anatomy &amp; <GradientText variant="cyan-violet">Component Science</GradientText>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Analyze physical silicon layouts, socket interconnect pinouts, thermal clearances, and
              motherboard architecture prior to desktop assembly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {CATEGORY_TO_3D[selectedComponent.category] && (
              <Button
                variant="outline"
                onClick={() => setInspect3DCompId(selectedComponent.id)}
                className="gap-2 text-xs font-medium pressable-element shadow-2xs"
              >
                <Box className="size-3.5 text-primary" />
                <span>3D Specimen View</span>
              </Button>
            )}
            <Link to="/guided">
              <Button className="gap-2 font-semibold shadow-xs pressable-element">
                <Wrench className="size-3.5" />
                <span>Enter Guided Assembly</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </GlowCard>

      {/* Filter Dock: Category Selector & Search */}
      <GlassPanel
        variant="dock"
        rounded="xl"
        className="p-3 sm:p-4 border border-border/80 shadow-xs space-y-3"
      >
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(Object.keys(categoryLabels) as (Category | 'all')[]).map((cat) => {
              const isSelected = selectedCategory === cat;
              const count =
                cat === 'all'
                  ? components.length
                  : components.filter((c) => c.category === cat).length;

              return (
                <Chip
                  key={cat}
                  variant={isSelected ? "primary" : "interactive"}
                  active={isSelected}
                  onClick={() => setSelectedCategory(cat)}
                  className="cursor-pointer"
                >
                  <span>{categoryLabels[cat].label}</span>
                  <span
                    className={cn(
                      "text-[10px] font-mono px-1 rounded-sm",
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground font-bold"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {count}
                  </span>
                </Chip>
              );
            })}
          </div>

          {/* Search Input Field */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search specs, chipset, sockets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border/80 bg-background/80 backdrop-blur-xs pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </GlassPanel>

      {/* Main Two-Column Architectural Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Component Specimen Roster */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
              Hardware Roster ({filteredComponents.length})
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">Select to inspect specs</span>
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredComponents.map((comp) => {
              const isSelected = comp.id === selectedComponent.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompId(comp.id)}
                  className={cn(
                    "group relative flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 pressable-element",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30"
                      : "border-border/80 bg-card/90 hover:border-border-strong hover:bg-card hover:-translate-y-0.5 shadow-2xs"
                  )}
                >
                  {/* Distinctive Hardware Chip Badge */}
                  <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border/60 shadow-inner font-mono text-[11px] font-bold text-white uppercase tracking-wider transition-transform group-hover:scale-105"
                    style={{ backgroundColor: comp.visual.color }}
                  >
                    {comp.category.substring(0, 3)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={cn(
                          "text-sm font-bold truncate font-display transition-colors",
                          isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
                        )}
                      >
                        {comp.name}
                      </h3>
                      <BrandBadge
                        variant={isSelected ? 'cyan' : 'slate'}
                        className="text-[10px] shrink-0 font-mono uppercase"
                      >
                        {comp.category}
                      </BrandBadge>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>

                    {/* Architectural Spec Badges */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                      {comp.socket && (
                        <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-foreground/80">
                          Socket: {comp.socket}
                        </span>
                      )}
                      {comp.ddr && (
                        <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-foreground/80">
                          {comp.ddr}
                        </span>
                      )}
                      {comp.formFactor && (
                        <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-foreground/80">
                          {comp.formFactor}
                        </span>
                      )}
                      {comp.wattage && (
                        <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 text-foreground/80">
                          {comp.wattage}W
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredComponents.length === 0 && (
              <div className="p-10 text-center rounded-xl border border-dashed border-border-strong bg-muted/20 text-muted-foreground text-xs space-y-2">
                <SlidersHorizontal className="size-6 mx-auto opacity-50" />
                <p className="font-semibold">No hardware components match "{searchQuery}"</p>
                <p className="text-[11px] opacity-80">Reset filters or refine your search keywords.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Deep Architectural Spec Sheet */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-border/80 bg-card shadow-xs card-elevated overflow-hidden">
            <CardHeader className="space-y-3 pb-4 border-b border-border/60">
              <div className="flex items-center justify-between">
                <BrandBadge variant="cyan">
                  SPEC SHEET // {selectedComponent.category.toUpperCase()}
                </BrandBadge>
                <div className="flex items-center gap-2">
                  <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground font-mono">Precision Verified</span>
                </div>
              </div>

              <div>
                <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
                  {selectedComponent.name}
                </CardTitle>
                <CardDescription className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {selectedComponent.description}
                </CardDescription>
              </div>
            </CardHeader>

            {/* Visual Hardware Specimen Stage */}
            <div className="px-6 py-5 bg-muted/20 border-b border-border/60 bg-blueprint-dots relative">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-5 rounded-xl bg-card/90 backdrop-blur-xs border border-border/80 shadow-2xs">
                {/* Physical Dimension Block Representation */}
                <div
                  className="flex items-center justify-center rounded-xl border-2 border-border shadow-inner font-mono text-sm font-bold text-white uppercase transition-all duration-300 relative overflow-hidden shrink-0"
                  style={{
                    backgroundColor: selectedComponent.visual.color,
                    width: Math.min(selectedComponent.visual.width, 200),
                    height: Math.min(selectedComponent.visual.height, 130),
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  <div className="relative text-center p-2 z-10">
                    <div className="text-xs tracking-wider opacity-90 font-display">{selectedComponent.category}</div>
                    <div className="text-[10px] font-mono opacity-70">
                      {selectedComponent.visual.width} × {selectedComponent.visual.height} mm
                    </div>
                  </div>
                </div>

                {/* Key Spec Parameters */}
                <div className="flex-1 w-full space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div className="p-2 rounded-lg bg-secondary/50 border border-border/40">
                      <span className="block text-[10px] uppercase font-mono text-muted-foreground">Form Factor</span>
                      <strong className="text-foreground">{selectedComponent.formFactor || 'Standard'}</strong>
                    </div>
                    {selectedComponent.socket && (
                      <div className="p-2 rounded-lg bg-secondary/50 border border-border/40">
                        <span className="block text-[10px] uppercase font-mono text-muted-foreground">Socket Standard</span>
                        <strong className="text-foreground">{selectedComponent.socket}</strong>
                      </div>
                    )}
                    {selectedComponent.ddr && (
                      <div className="p-2 rounded-lg bg-secondary/50 border border-border/40">
                        <span className="block text-[10px] uppercase font-mono text-muted-foreground">Memory Architecture</span>
                        <strong className="text-foreground">{selectedComponent.ddr}</strong>
                      </div>
                    )}
                    {selectedComponent.interfaceType && (
                      <div className="p-2 rounded-lg bg-secondary/50 border border-border/40">
                        <span className="block text-[10px] uppercase font-mono text-muted-foreground">Bus Interface</span>
                        <strong className="text-foreground">{selectedComponent.interfaceType}</strong>
                      </div>
                    )}
                    {selectedComponent.wattage && (
                      <div className="p-2 rounded-lg bg-secondary/50 border border-border/40">
                        <span className="block text-[10px] uppercase font-mono text-muted-foreground">Rated Power Draw</span>
                        <strong className="text-foreground">{selectedComponent.wattage} Watts TDP</strong>
                      </div>
                    )}
                    <div className="p-2 rounded-lg bg-secondary/50 border border-border/40">
                      <span className="block text-[10px] uppercase font-mono text-muted-foreground">Chassis Slot</span>
                      <strong className="text-foreground">{selectedComponent.locationText.split(' ')[0]} Area</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Architectural Spec Ledger Quadrants */}
            <CardContent className="space-y-4 pt-5">
              {/* 1. Purpose & Core Function */}
              <div className="flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4 shadow-2xs">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Info className="size-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
                    Architectural Purpose &amp; Role
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedComponent.functionText}
                  </p>
                </div>
              </div>

              {/* 2. Physical Location in Chassis */}
              <div className="flex items-start gap-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 shadow-2xs">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="size-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-mono">
                    Chassis Standoff &amp; Socket Target
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedComponent.locationText}
                  </p>
                </div>
              </div>

              {/* 3. Strict Compatibility Constraint */}
              <div className="flex items-start gap-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 shadow-2xs">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <AlertTriangle className="size-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 font-mono">
                    Interconnect Compatibility Rule
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedComponent.ruleText}
                  </p>
                </div>
              </div>

              {/* 4. Installation Concept & Safety Note */}
              <div className="flex items-start gap-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 shadow-2xs">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <ShieldCheck className="size-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-mono">
                    Handling Protocol &amp; Assembly Concept
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedComponent.conceptText}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4 bg-muted/10">
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" />
                <span>Ready to mount this hardware into the 3D desktop chassis?</span>
              </div>
              <div className="flex items-center gap-2">
                {CATEGORY_TO_3D[selectedComponent.category] && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInspect3DCompId(selectedComponent.id)}
                    className="gap-1.5 text-xs font-medium pressable-element"
                  >
                    <Box className="size-3.5 text-primary" />
                    <span>3D View</span>
                  </Button>
                )}
                <Link to="/guided">
                  <Button size="sm" className="gap-2 font-semibold shadow-xs pressable-element">
                    <Wrench className="size-3.5" />
                    <span>Mount in Guided Build</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* 3D Component Inspection Modal */}
      {inspect3DCompId && active3DPartType && (
        <Dialog open={true} onOpenChange={(open) => !open && setInspect3DCompId(null)}>
          <DialogContent className="max-w-2xl bg-card/95 border-border/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <BrandBadge variant="cyan">
                  {components.find((c) => c.id === inspect3DCompId)?.category}
                </BrandBadge>
                <DialogTitle className="text-lg font-bold font-display text-foreground">
                  {components.find((c) => c.id === inspect3DCompId)?.name}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Rotate with left-click drag to inspect contacts, pin arrays, and heatsink geometry.
              </DialogDescription>
            </DialogHeader>

            <div className="w-full h-80 rounded-xl overflow-hidden bg-secondary/30 border border-border/80 shadow-inner relative bg-blueprint-dots">
              <Scene3D cameraPosition={[4, 3, 5]} autoRotate autoRotateSpeed={0.8}>
                <Part3D type={active3DPartType} animated />
              </Scene3D>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full glass-surface border border-border/80 text-[10px] text-muted-foreground font-mono pointer-events-none shadow-xs">
                Drag: Rotate • Scroll: Zoom • Right Drag: Pan
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 bg-primary/10 p-3.5 rounded-xl border border-primary/30">
              <div className="text-primary font-bold font-mono text-[11px] uppercase tracking-wider">
                Engineering Notes:
              </div>
              <p className="text-foreground leading-relaxed">{components.find((c) => c.id === inspect3DCompId)?.conceptText}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LearnScreen;