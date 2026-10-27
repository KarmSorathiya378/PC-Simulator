import * as React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import {
  BookOpen,
  Wrench,
  Trophy,
  Cable,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { AppShell } from "@/components/ui/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LearnScreen } from "./features/learn/LearnScreen";
import { GuidedAssemblyScreen } from "./features/assembly/GuidedAssemblyScreen";
import { ChallengeScreen } from "./features/challenge/ChallengeScreen";
import { ConnectionScreen } from "./features/connection/ConnectionScreen";
import { ResultsScreen } from "./features/results/ResultsScreen";

interface ModeCardProps {
  to: string;
  badge: string;
  badgeVariant?: "default" | "secondary" | "outline";
  title: string;
  description: string;
  icon: React.ElementType;
  highlights: string[];
  ctaText: string;
  primary?: boolean;
}

const ModeCard: React.FC<ModeCardProps> = ({
  to,
  badge,
  badgeVariant = "secondary",
  title,
  description,
  icon: Icon,
  highlights,
  ctaText,
  primary = false,
}) => {
  return (
    <Card
      className={`flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        primary
          ? "border-primary/40 bg-card shadow-sm ring-1 ring-primary/20"
          : "border-border/80 bg-card shadow-xs"
      }`}
    >
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <div
            className={`flex size-11 items-center justify-center rounded-xl ${
              primary
                ? "bg-primary text-primary-foreground shadow-xs shadow-primary/30"
                : "bg-secondary text-foreground"
            }`}
          >
            <Icon className="size-5" />
          </div>
          <Badge variant={badgeVariant} className="text-xs font-medium">
            {badge}
          </Badge>
        </div>
        <div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pb-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Learning Objectives
        </div>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-primary shrink-0" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-2">
        <Link to={to} className="w-full">
          <Button
            variant={primary ? "default" : "outline"}
            className="w-full justify-between group active:scale-[0.98] transition-all"
          >
            <span>{ctaText}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const HomeScreen: React.FC = () => {
  return (
    <div className="space-y-12 py-2 sm:py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-b from-card via-card to-muted/20 p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            <span>Interactive Hardware Learning Experience</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-5xl">
            Master PC Hardware Through Virtual Assembly
          </h1>

          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            Learn component identification, slot dependencies, cable routing, and compatibility
            rules. Assemble a complete desktop in an interactive simulated workspace.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/guided">
              <Button size="lg" className="gap-2 shadow-sm font-semibold active:scale-95 transition-transform">
                <Wrench className="size-4" />
                <span>Start Guided Assembly</span>
              </Button>
            </Link>
            <Link to="/learn">
              <Button size="lg" variant="outline" className="gap-2 font-medium active:scale-95 transition-transform">
                <BookOpen className="size-4" />
                <span>Component Catalog</span>
              </Button>
            </Link>
            <Link to="/challenge">
              <Button size="lg" variant="secondary" className="gap-2 font-medium active:scale-95 transition-transform">
                <Trophy className="size-4" />
                <span>Take Challenge</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Modes Grid */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Learning Modules
            </h2>
            <p className="text-sm text-muted-foreground">
              Choose an assembly mode based on your learning goals.
            </p>
          </div>
          <Link to="/results">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <BarChart3 className="size-3.5" />
              <span>View Past Results &amp; Scorecard</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ModeCard
            to="/learn"
            badge="Fundamentals"
            title="Learn Mode"
            description="Explore individual components, socket types, specifications, and functions before assembling."
            icon={BookOpen}
            highlights={[
              "Component anatomical views",
              "Form factor & socket specs",
              "Common hardware errors",
            ]}
            ctaText="Explore Components"
          />

          <ModeCard
            to="/guided"
            badge="Recommended"
            badgeVariant="default"
            primary
            title="Guided Assembly"
            description="Build a complete PC step-by-step with contextual hints, placement validation, and safety warnings."
            icon={Wrench}
            highlights={[
              "Guided step sequence",
              "Real-time slot feedback",
              "Penalty-free learning",
            ]}
            ctaText="Begin Guided Build"
          />

          <ModeCard
            to="/challenge"
            badge="Assessment"
            title="Challenge Mode"
            description="Assemble a computer independently without hints. Track mistakes and earn a 100-point score."
            icon={Trophy}
            highlights={[
              "Independent assembly",
              "100-point rubric scoring",
              "Mistake audit & quiz",
            ]}
            ctaText="Start Challenge"
          />

          <ModeCard
            to="/connection"
            badge="Cabling"
            title="Connection Mode"
            description="Route and seat critical power cables: 24-pin ATX, 8-pin EPS, PCIe, and front panel headers."
            icon={Cable}
            highlights={[
              "Power rail verification",
              "Header pinout simulation",
              "Pre-boot readiness check",
            ]}
            ctaText="Practice Cabling"
          />
        </div>
      </section>

      {/* Educational Features Banner */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Rule-Based Validation</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Prevents invalid installations like seating an LGA CPU into an AM4 socket or mounting a cooler without thermal compound.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Interactive 2D Canvas</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Smooth, responsive component drag-and-drop powered by Konva canvas and crisp SVG hardware assets.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 rounded-xl border border-border/70 bg-card p-4 shadow-xs">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <RotateCcw className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Non-Destructive Sandbox</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Full undo and reset controls allow students to experiment safely and learn from mistakes without physical consequences.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

interface PlaceholderScreenProps {
  title: string;
  badge: string;
  description: string;
  icon: React.ElementType;
  route: string;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  title,
  badge,
  description,
  icon: Icon,
  route,
}) => {
  return (
    <div className="space-y-6 py-4">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">{title}</span>
      </div>

      <Card className="border-border/80 bg-card shadow-xs">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-6" />
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {badge}
            </Badge>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="mt-1 text-base text-muted-foreground">
              {description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <Cpu className="size-7" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">
                Workspace Canvas Ready
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                The application shell and layout are loaded for route <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{route}</code>. Teammates are integrating simulation and canvas modules here.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              Return to Overview
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/guided">
              <Button size="sm" variant="secondary" className="gap-1.5">
                <Wrench className="size-3.5" />
                <span>Guided Assembly</span>
              </Button>
            </Link>
            <Link to="/learn">
              <Button size="sm" variant="secondary" className="gap-1.5">
                <BookOpen className="size-3.5" />
                <span>Learn Mode</span>
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/learn" element={<LearnScreen />} />
          <Route path="/guided" element={<GuidedAssemblyScreen />} />
          {/* Alias /assembly to /guided for full compatibility */}
          <Route path="/assembly" element={<Navigate to="/guided" replace />} />
          <Route path="/challenge" element={<ChallengeScreen />} />
          <Route path="/connection" element={<ConnectionScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
};

export default App;
