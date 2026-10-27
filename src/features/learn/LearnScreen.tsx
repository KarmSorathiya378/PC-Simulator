import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Cpu,
  HardDrive,
  Layers,
  Wrench,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Search,
} from 'lucide-react';
import { components } from '../../data/components';
import type { ComponentDefinition, Category } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

const categoryLabels: Record<Category | 'all', string> = {
  all: 'All Hardware',
  case: 'Case & Chassis',
  motherboard: 'Motherboard',
  cpu: 'Processors (CPU)',
  cooler: 'Cooling',
  ram: 'Memory (RAM)',
  ssd: 'Storage (M.2 NVMe)',
  gpu: 'Graphics (GPU)',
  psu: 'Power Supply (PSU)',
};

export const LearnScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompId, setSelectedCompId] = useState<string>('motherboard-b650-01');

  const filteredComponents = components.filter((comp) => {
    const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
    const matchesSearch =
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedComponent: ComponentDefinition =
    components.find((c) => c.id === selectedCompId) || components[0];

  return (
    <div className="space-y-6 py-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Learn Mode</span>
      </div>

      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Hardware Catalog &amp; Anatomy
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Explore PC components, socket standards, installation locations, and compatibility dependencies before assembling.
          </p>
        </div>

        <Link to="/guided">
          <Button className="gap-2 shrink-0 font-medium active:scale-95 transition-transform shadow-xs">
            <Wrench className="size-4" />
            <span>Open Guided Assembly</span>
          </Button>
        </Link>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(Object.keys(categoryLabels) as (Category | 'all')[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'bg-secondary/70 text-secondary-foreground hover:bg-secondary'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search specs or parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border/80 bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Component List Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
            Component Roster ({filteredComponents.length})
          </div>

          <div className="space-y-2.5">
            {filteredComponents.map((comp) => {
              const isSelected = comp.id === selectedComponent.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedCompId(comp.id)}
                  className={`group relative flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all active:scale-[0.99] ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20'
                      : 'border-border/80 bg-card hover:border-border hover:shadow-xs'
                  }`}
                >
                  {/* Color Thumbnail Indicator */}
                  <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border/60 shadow-inner font-mono text-xs font-bold text-white uppercase"
                    style={{ backgroundColor: comp.visual.color }}
                  >
                    {comp.category.substring(0, 3)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`text-sm font-semibold truncate transition-colors ${
                          isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
                        }`}
                      >
                        {comp.name}
                      </h3>
                      <Badge variant={isSelected ? 'default' : 'secondary'} className="text-[10px] shrink-0 uppercase tracking-wider">
                        {comp.category}
                      </Badge>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {comp.description}
                    </p>

                    {/* Hardware Spec Badges */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {comp.socket && (
                        <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                          Socket: {comp.socket}
                        </span>
                      )}
                      {comp.ddr && (
                        <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                          {comp.ddr}
                        </span>
                      )}
                      {comp.formFactor && (
                        <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                          {comp.formFactor}
                        </span>
                      )}
                      {comp.wattage && (
                        <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                          {comp.wattage}W
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredComponents.length === 0 && (
              <div className="p-8 text-center rounded-xl border border-dashed border-border bg-muted/20 text-muted-foreground text-sm">
                No components match your search filter.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Component Anatomy & Inspection View */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-border/80 bg-card shadow-xs">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-xs uppercase tracking-wider">
                  Hardware Anatomy // {selectedComponent.category}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="inline-block size-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground font-medium">Spec Sheet Verified</span>
                </div>
              </div>

              <div>
                <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                  {selectedComponent.name}
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {selectedComponent.description}
                </CardDescription>
              </div>
            </CardHeader>

            {/* Visual Hardware Preview Graphic */}
            <div className="px-6 py-4 bg-muted/30 border-y border-border/60">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border/80 shadow-xs">
                <div
                  className="flex items-center justify-center rounded-lg border-2 border-border shadow-inner font-mono text-sm font-bold text-white uppercase transition-all duration-300"
                  style={{
                    backgroundColor: selectedComponent.visual.color,
                    width: Math.min(selectedComponent.visual.width, 180),
                    height: Math.min(selectedComponent.visual.height, 120),
                  }}
                >
                  <div className="text-center p-2">
                    <div className="text-xs tracking-wider opacity-80">{selectedComponent.category}</div>
                    <div className="text-[10px] font-normal opacity-60">
                      {selectedComponent.visual.width}x{selectedComponent.visual.height} mm
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div>
                      <span className="font-semibold text-foreground">Category:</span>{' '}
                      <span className="capitalize">{selectedComponent.category}</span>
                    </div>
                    {selectedComponent.formFactor && (
                      <div>
                        <span className="font-semibold text-foreground">Form Factor:</span>{' '}
                        <span>{selectedComponent.formFactor}</span>
                      </div>
                    )}
                    {selectedComponent.socket && (
                      <div>
                        <span className="font-semibold text-foreground">Socket:</span>{' '}
                        <span>{selectedComponent.socket}</span>
                      </div>
                    )}
                    {selectedComponent.ddr && (
                      <div>
                        <span className="font-semibold text-foreground">Memory Gen:</span>{' '}
                        <span>{selectedComponent.ddr}</span>
                      </div>
                    )}
                    {selectedComponent.interfaceType && (
                      <div>
                        <span className="font-semibold text-foreground">Interface:</span>{' '}
                        <span>{selectedComponent.interfaceType}</span>
                      </div>
                    )}
                    {selectedComponent.wattage && (
                      <div>
                        <span className="font-semibold text-foreground">Rated Power:</span>{' '}
                        <span>{selectedComponent.wattage} Watts</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="space-y-4 pt-4">
              {/* 1. Function & Purpose */}
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-500">
                  <Info className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    What It Does
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {selectedComponent.functionText}
                  </p>
                </div>
              </div>

              {/* 2. Installation Location */}
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Where It Belongs
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {selectedComponent.locationText}
                  </p>
                </div>
              </div>

              {/* 3. Important Compatibility Rule */}
              <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-500">
                  <AlertTriangle className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Important Compatibility Rule
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {selectedComponent.ruleText}
                  </p>
                </div>
              </div>

              {/* 4. Installation Concept & Best Practices */}
              <div className="flex items-start gap-3 rounded-lg border border-purple-500/30 bg-purple-500/5 p-3.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-purple-500/10 text-purple-500">
                  <ShieldAlert className="size-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Installation Concept &amp; Safety Note
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {selectedComponent.conceptText}
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
              <div className="text-xs text-muted-foreground">
                Ready to assemble this part into the virtual chassis?
              </div>
              <Link to="/guided">
                <Button size="sm" className="gap-2 font-medium active:scale-95 transition-transform">
                  <Wrench className="size-3.5" />
                  <span>Mount in Guided Build</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LearnScreen;
