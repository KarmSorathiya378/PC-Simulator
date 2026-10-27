import * as React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/logo";
import { Cpu, ShieldCheck, Sparkles, BookOpen } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/70 bg-background-subtle/60 backdrop-blur-xs py-10 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-border/60">
          {/* Brand info */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <Logo size="default" withTagline={true} />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mt-1">
              A hands-on, browser-based computer hardware simulator. Learn component anatomy,
              prevent real-world assembly mistakes, and master modern desktop PC construction.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-1">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Sim Engine v2.0 Ready
              </span>
              <span>•</span>
              <span>Socket AM5 &amp; DDR5 Spec</span>
            </div>
          </div>

          {/* Quick learning links */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              Learning Tracks
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/learn" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <BookOpen className="size-3.5" /> Component Anatomy
                </Link>
              </li>
              <li>
                <Link to="/guided" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Cpu className="size-3.5" /> Guided Assembly
                </Link>
              </li>
              <li>
                <Link to="/challenge" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5" /> Hardware Challenge
                </Link>
              </li>
              <li>
                <Link to="/connection" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <Sparkles className="size-3.5" /> Power Routing
                </Link>
              </li>
            </ul>
          </div>

          {/* Educational standards */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
              Architecture
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Designed with strict mechanical compatibility checks, realistic installation dependencies,
              and tactile micro-interactions.
            </p>
            <div className="mt-2 rounded-lg border border-border/80 bg-card p-3 shadow-2xs">
              <span className="text-[11px] font-mono font-medium text-foreground block">
                Standard: AMD B650 / ATX
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">
                Thermal &amp; Power constraints validated
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PC Builder Lab. Open educational hardware simulator.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-foreground transition-colors">Clean Code &amp; Quality Architecture</span>
            <span>•</span>
            <span className="hover:text-foreground transition-colors">Zero-Install Web App</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
