import * as React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Cpu, ShieldCheck, Sparkles, BookOpen } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/80 bg-card/60 backdrop-blur-xl py-10 text-xs text-muted-foreground transition-colors relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-border/60">
          {/* Brand info */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <Logo size="default" withLink withTagline={false} />
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md mt-1">
              Precision educational simulation platform for computer architecture and hardware
              engineering. Practice standoff grounding, socket keying, PCIe lane distribution,
              and thermal paste mechanics in a risk-free 3D environment.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Three.js WebGL procedural engine active
              </span>
              <span>•</span>
              <span>AMD AM5 / DDR5 Spec</span>
            </div>
          </div>

          {/* Quick learning links */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              Simulation Labs
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
              <li>
                <Link to="/guided" className="hover:text-primary transition-colors flex items-center gap-1.5 pressable-element">
                  <Cpu className="size-3.5 text-primary" /> 3D Guided Assembly
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-primary transition-colors flex items-center gap-1.5 pressable-element">
                  <BookOpen className="size-3.5 text-primary" /> Component Anatomy &amp; Specs
                </Link>
              </li>
              <li>
                <Link to="/challenge" className="hover:text-primary transition-colors flex items-center gap-1.5 pressable-element">
                  <ShieldCheck className="size-3.5 text-amber-500" /> 100-Point Assessment Exam
                </Link>
              </li>
              <li>
                <Link to="/connection" className="hover:text-primary transition-colors flex items-center gap-1.5 pressable-element">
                  <Sparkles className="size-3.5 text-primary" /> Power Rails &amp; Cabling
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational standards */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              Hardware Standards
            </h4>
            <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              <li>AMD AM5 LGA1718 Socket Specs</li>
              <li>DDR5-6000 Dual-Channel Topology</li>
              <li>PCIe 4.0 x16 Bus Architecture</li>
              <li>ATX Modular Power Distribution</li>
              <li>NVMe M.2 2280 Storage Protocol</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-[11px] text-muted-foreground">
          <p>© {new Date().getFullYear()} PC Builder Lab v2.0 • Architectural Educational Simulator</p>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground/80">Desktop-optimized WebGL canvas</span>
            <span className="text-border">•</span>
            <span className="font-mono text-muted-foreground">Zero hardware risk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
