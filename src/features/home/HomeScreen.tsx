import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  BookOpen,
  Trophy,
  Cable,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Box,
  Zap,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Sliders,
  Layers,
  Compass,
  Activity,
} from 'lucide-react';
import { LogoMark } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
  BrandBadge,
  GlowCard,
  GradientText,
  GlassPanel,
  SectionHeading,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { motionVariants } from '@/styles/motion';

interface LabCardProps {
  to: string;
  badge: string;
  badgeVariant?: 'cyan' | 'indigo' | 'amber' | 'emerald';
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
  specs: string[];
  ctaText: string;
  featured?: boolean;
  glowColor?: 'cyan' | 'violet' | 'amber' | 'emerald';
}

const LabCard: React.FC<LabCardProps> = ({
  to,
  badge,
  badgeVariant = 'cyan',
  title,
  category,
  description,
  icon: Icon,
  specs,
  ctaText,
  featured = false,
  glowColor = 'cyan',
}) => {
  return (
    <GlowCard
      glowColor={glowColor}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden p-6 sm:p-7 card-elevated transition-all duration-300',
        featured && 'border-cyan-500/40 ring-1 ring-cyan-500/25 shadow-lg shadow-cyan-500/15'
      )}
    >
      {/* Top Accent Gradient on Featured Card */}
      {featured && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500" />
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'flex size-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 shadow-xs',
              featured
                ? 'bg-primary text-primary-foreground shadow-primary/30'
                : 'bg-secondary text-foreground'
            )}
          >
            <Icon className="size-5.5" />
          </div>
          <BrandBadge variant={badgeVariant}>
            {badge}
          </BrandBadge>
        </div>

        <div>
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
            {category}
          </div>
          <h3 className="text-xl font-bold tracking-tight text-foreground font-display mt-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Feature Specs */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80 font-bold">
            Key Architecture Features
          </div>
          <ul className="space-y-1.5 text-xs text-muted-foreground font-sans">
            {specs.map((spec, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2
                  className={cn(
                    'size-3.5 shrink-0',
                    featured ? 'text-cyan-400' : 'text-primary/70'
                  )}
                />
                <span className="truncate">{spec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-5 mt-4 border-t border-border/50">
        <Link to={to} className="w-full block">
          <Button
            variant={featured ? 'default' : 'outline'}
            className={cn(
              'w-full justify-between pressable-element font-semibold text-xs transition-all shadow-xs group/btn',
              featured
                ? 'bg-primary hover:bg-primary-hover text-white shadow-primary/25'
                : 'hover:border-primary/40 hover:bg-primary/5 hover:text-primary'
            )}
          >
            <span>{ctaText}</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </div>
    </GlowCard>
  );
};

export const HomeScreen: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 py-2 sm:py-6 w-full max-w-full overflow-hidden">
      {/* 1. Grand Hero Section with Ambient Atmospheric Glow */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 sm:p-12 lg:p-16 card-elevated">
        {/* Ambient atmospheric backdrop radial gradient */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[420px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(6,182,212,0.18),transparent_70%)] blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 right-1/4 w-[520px] h-[360px] bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(99,102,241,0.14),transparent_70%)] blur-2xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl text-center space-y-6 z-10">
          {/* Eyebrow Hardware Pill with Custom Logo Mark */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3.5 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md shadow-xs animate-in fade-in duration-300">
            <LogoMark size={18} className="text-cyan-400" />
            <span className="font-mono uppercase tracking-wider text-[11px]">
              VIRTUAL HARDWARE SIMULATION STUDIO // v2.0
            </span>
          </div>

          {/* Bold Editorial Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] text-foreground leading-[1.08]">
            Master Computer Architecture in{' '}
            <GradientText variant="cyan-violet" className="italic">
              True 3D Space.
            </GradientText>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed font-sans">
            Build, inspect, and benchmark standard computer hardware in an interactive,
            physics-aware WebGL simulator. Learn socket mechanics, DDR channels, and thermal
            clearances without physical risk.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/guided">
              <Button
                size="lg"
                className="gap-2.5 shadow-md shadow-primary/30 font-bold text-sm tracking-tight pressable-element bg-primary hover:bg-primary-hover text-white"
              >
                <Wrench className="size-4" />
                <span>Start 3D Guided Build</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/learn">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 font-semibold text-sm tracking-tight pressable-element bg-card/80 hover:bg-secondary/70 border-border"
              >
                <BookOpen className="size-4 text-primary" />
                <span>Hardware Atlas</span>
              </Button>
            </Link>
            <Link to="/challenge">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 font-semibold text-sm tracking-tight pressable-element border border-border/80"
              >
                <Trophy className="size-4 text-amber-500" />
                <span>100-Pt Challenge</span>
              </Button>
            </Link>
          </div>

          {/* Interactive Blueprint Stage Showcase */}
          <div className="pt-6 sm:pt-8">
            <GlassPanel
              variant="dock"
              rounded="2xl"
              className="p-4 sm:p-6 text-left font-mono relative overflow-hidden bg-blueprint-dots border border-border/80 shadow-xs"
            >
              {/* CAD Reticles */}
              <div className="absolute top-2.5 left-2.5 size-3 border-t-2 border-l-2 border-border-strong opacity-80 pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 size-3 border-t-2 border-r-2 border-border-strong opacity-80 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 size-3 border-b-2 border-l-2 border-border-strong opacity-80 pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 size-3 border-b-2 border-r-2 border-border-strong opacity-80 pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Active System Blueprint: AM5 Mid-Tower Chassis
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="text-cyan-400 font-bold">60 FPS WebGL</span>
                  <span>•</span>
                  <span>ACES Filmic Tone Mapping</span>
                  <span>•</span>
                  <Link to="/guided" className="text-primary hover:underline font-bold flex items-center gap-1">
                    <span>Open 3D Canvas</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>

              {/* Hardware Metric Tiles */}
              <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
                <div className="rounded-xl border border-border/60 bg-card/90 p-3 shadow-2xs">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Processor</div>
                  <div className="text-xs font-bold text-foreground truncate mt-0.5 font-display">Ryzen 7 7800X3D</div>
                  <div className="text-[10px] text-primary mt-0.5">AM5 LGA1718 • 120W TDP</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/90 p-3 shadow-2xs">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Memory</div>
                  <div className="text-xs font-bold text-foreground truncate mt-0.5 font-display">32GB DDR5-6000</div>
                  <div className="text-[10px] text-emerald-500 mt-0.5">Dual-Channel DIMM A2/B2</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/90 p-3 shadow-2xs">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Graphics</div>
                  <div className="text-xs font-bold text-foreground truncate mt-0.5 font-display">RTX 4070 SUPER</div>
                  <div className="text-[10px] text-primary mt-0.5">PCIe 4.0 x16 • 220W</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/90 p-3 shadow-2xs">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Power Supply</div>
                  <div className="text-xs font-bold text-foreground truncate mt-0.5 font-display">Corsair RM750e</div>
                  <div className="text-[10px] text-amber-500 mt-0.5">750W 80+ Gold Modular</div>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* 2. Platform Impact Metric Ribbon */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4 select-none">
        <GlowCard glowColor="cyan" className="p-5 card-elevated">
          <div className="flex items-center justify-between">
            <GradientText variant="cyan-violet" className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              8
            </GradientText>
            <Box className="size-5 text-cyan-400" />
          </div>
          <div className="text-xs font-bold text-foreground mt-1 font-mono uppercase tracking-wider">
            Hardware Classes
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
            CPU, GPU, RAM, Motherboard, Cooler, M.2 SSD, PSU, and Case Chassis.
          </p>
        </GlowCard>

        <GlowCard glowColor="violet" className="p-5 card-elevated">
          <div className="flex items-center justify-between">
            <GradientText variant="primary" className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              10
            </GradientText>
            <Compass className="size-5 text-indigo-400" />
          </div>
          <div className="text-xs font-bold text-foreground mt-1 font-mono uppercase tracking-wider">
            Mechanical Mount Points
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
            Keyed AM5 socket, 4x DDR5 channels, PCIe x16 bracket &amp; lower PSU shroud.
          </p>
        </GlowCard>

        <GlowCard glowColor="emerald" className="p-5 card-elevated">
          <div className="flex items-center justify-between">
            <GradientText variant="emerald" className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              100%
            </GradientText>
            <ShieldCheck className="size-5 text-emerald-400" />
          </div>
          <div className="text-xs font-bold text-foreground mt-1 font-mono uppercase tracking-wider">
            Constraint Validation
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
            Prevents pin bending, standoff shorts, and incorrect cable pinout insertion.
          </p>
        </GlowCard>

        <GlowCard glowColor="amber" className="p-5 card-elevated">
          <div className="flex items-center justify-between">
            <GradientText variant="warm" className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              0
            </GradientText>
            <Zap className="size-5 text-amber-400" />
          </div>
          <div className="text-xs font-bold text-foreground mt-1 font-mono uppercase tracking-wider">
            Hardware Risk
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
            Complete undo/redo sandbox history allows students to learn fearlessly.
          </p>
        </GlowCard>
      </section>

      {/* 3. Tasteful Feature Grid / Simulator Workspaces */}
      <section className="space-y-6">
        <SectionHeading
          badge="SPECIALIZED WORKSPACES"
          badgeVariant="secondary"
          title="Engineered Simulation Modules"
          description="Choose an assembly mode based on your experience level and learning goals."
          action={
            <Link to="/results">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs font-semibold pressable-element shadow-2xs"
              >
                <BarChart3 className="size-3.5 text-primary" />
                <span>View Past Scorecards</span>
              </Button>
            </Link>
          }
        />

        {/* 4 Specialized Mode Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <LabCard
            to="/guided"
            badge="Primary"
            badgeVariant="cyan"
            glowColor="cyan"
            featured
            category="Interactive 3D"
            title="3D Guided Lab"
            description="Step-by-step physical assembly inside the interactive Three.js 3D chassis with real-time constraint validation and step hints."
            icon={Wrench}
            specs={[
              '360° OrbitControls viewport',
              'Pulsing 3D target slot markers',
              'Penalty-free step guidance',
              '2D schematic toggle view',
            ]}
            ctaText="Enter 3D Guided Build"
          />

          <LabCard
            to="/learn"
            badge="Reference"
            badgeVariant="indigo"
            glowColor="violet"
            category="Hardware Knowledge"
            title="Component Anatomy"
            description="Inspect 3D procedural models of processors, graphics cards, motherboards, and memory with detailed spec sheets."
            icon={BookOpen}
            specs={[
              '3D model interactive inspection',
              'LGA socket pinout anatomy',
              'TDP & thermal headroom specs',
              'Common builder mistakes',
            ]}
            ctaText="Inspect Components"
          />

          <LabCard
            to="/challenge"
            badge="100 Pts"
            badgeVariant="amber"
            glowColor="amber"
            category="Graded Exam"
            title="100-Point Challenge"
            description="Assemble a computer independently without hints. Track mistakes, answer hardware quiz questions, and earn a rubric grade."
            icon={Trophy}
            specs={[
              'Zero-hint independent sandbox',
              'Mistake deduction audit',
              'Interactive hardware quiz',
              'Detailed final scorecard',
            ]}
            ctaText="Begin Assessment"
          />

          <LabCard
            to="/connection"
            badge="Power Rails"
            badgeVariant="emerald"
            glowColor="emerald"
            category="Electrical Routing"
            title="Cabling & Power"
            description="Route and seat critical modular power cables: 24-pin ATX, 8-pin EPS, PCIe graphics power, and SATA storage lines."
            icon={Cable}
            specs={[
              'Pin-level socket matching',
              'Modular PSU rail simulation',
              'Pre-boot readiness check',
              'Reversible cable routing',
            ]}
            ctaText="Practice Cabling"
          />
        </div>
      </section>

      {/* 4. Engineering Principles & Educational Depth */}
      <section className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-6 sm:p-10 shadow-xs space-y-6 card-elevated">
        <SectionHeading
          badge="ENGINEERING FOUNDATIONS"
          badgeVariant="secondary"
          title="Built for Real-World Hardware Literacy"
          description="PC Builder Lab does not simply test memorization — it teaches the spatial, electrical, and mechanical relationships that make modern high-performance computers function."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
          <GlowCard glowColor="cyan" className="p-5 space-y-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground font-display">Rule-Based Verification</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Algorithmic rule engine enforces socket matching (AM5 vs LGA1700), DDR generations,
              standoff pre-installation, and cooler thermal dependency before allowing placement.
            </p>
          </GlowCard>

          <GlowCard glowColor="violet" className="p-5 space-y-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground font-display">Dual 3D &amp; 2D Viewport</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Seamlessly toggle between a full WebGL 3D chassis with OrbitControls and a crisp 2D
              schematic blueprint with drag-and-drop snapping powered by Konva.
            </p>
          </GlowCard>

          <GlowCard glowColor="emerald" className="p-5 space-y-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <RotateCcw className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground font-display">Non-Destructive Sandbox</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              State restoration, undo/redo history stacks, and automated local persistence ensure
              students can experiment boldly without loss of progress or hardware casualties.
            </p>
          </GlowCard>
        </div>
      </section>

      {/* 5. Pre-Footer Call to Action Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-blue-600 to-indigo-700 text-primary-foreground p-8 sm:p-12 shadow-lg card-elevated">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[11px] font-mono uppercase tracking-wider font-bold backdrop-blur-xs">
              <Sparkles className="size-3" />
              <span>Ready for Assembly?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Build your first virtual desktop now.
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Experience the 3D procedural chassis, test your placement accuracy, and master the
              fundamentals of computer hardware.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to="/guided">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/95 font-bold shadow-md pressable-element gap-2"
              >
                <Wrench className="size-4" />
                <span>Launch Guided Lab</span>
              </Button>
            </Link>
            <Link to="/challenge">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold pressable-element"
              >
                <span>Take Challenge</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;