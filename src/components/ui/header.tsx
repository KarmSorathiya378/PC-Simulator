import * as React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { 
  Cpu, 
  BookOpen, 
  Wrench, 
  Trophy, 
  Cable, 
  BarChart3, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Sparkles,
  Box
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrandBadge } from "@/components/ui/brand-badge";
import { Logo } from "@/components/Logo";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/guided", label: "3D Guided Lab", badge: "Interactive", icon: Wrench, description: "Step-by-step 3D chassis assembly" },
  { path: "/learn", label: "Hardware Anatomy", icon: BookOpen, description: "Component specifications & pinouts" },
  { path: "/challenge", label: "Challenge Exam", badge: "100 Pts", icon: Trophy, description: "Independent assembly assessment" },
  { path: "/connection", label: "Cabling & Rails", icon: Cable, description: "Modular power delivery & headers" },
  { path: "/results", label: "Scorecard", icon: BarChart3, description: "Telemetry & competency review" },
];

export const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 glass-surface transition-colors duration-200">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Logo with Hardware Status Pill */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Logo size="default" withLink withTagline={false} />

          <div className="hidden lg:flex items-center">
            <BrandBadge variant="emerald" pulse>
              3D Engine Ready
            </BrandBadge>
          </div>
        </div>

        {/* Desktop Mode Navigation Dock */}
        <nav
          className="hidden md:flex items-center gap-1 p-1 rounded-xl border border-border/60 bg-secondary/40 backdrop-blur-md select-none"
          aria-label="Main Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === "/guided" && location.pathname === "/assembly");

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-tight transition-all duration-200 pressable-element focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "bg-card text-primary shadow-xs border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                )}
              >
                <Icon
                  className={cn(
                    "size-3.5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="hidden xl:inline-flex rounded bg-primary/10 text-primary text-[9px] px-1 font-mono font-bold">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions: Launch CTA & Theme Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/guided" className="hidden sm:inline-flex">
            <Button
              size="sm"
              className="gap-2 font-bold shadow-xs shadow-primary/25 btn-primary pressable-element focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Box className="size-3.5" />
              <span>Launch 3D Lab</span>
            </Button>
          </Link>

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex size-9 items-center justify-center rounded-lg border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors pressable-element focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer select-none"
          >
            {isDark ? (
              <Sun className="size-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="size-4 text-foreground/80 transition-transform duration-200 rotate-0 hover:-rotate-12" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            className="flex size-9 items-center justify-center rounded-lg border border-border/80 bg-card text-muted-foreground hover:text-foreground md:hidden pressable-element cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-card/95 backdrop-blur-xl px-4 pt-2 pb-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-150 space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground px-2 pb-1">
            Navigation Labs
          </div>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path === "/guided" && location.pathname === "/assembly");

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-start gap-3 rounded-lg p-2.5 transition-colors pressable-element",
                    isActive
                      ? "bg-primary/10 border border-primary/25 text-primary"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-md",
                      isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{item.label}</span>
                      {item.badge && (
                        <Badge variant="outline" className="text-[9px] px-1 py-0 font-mono">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>
          <div className="pt-2">
            <Link to="/guided" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full gap-2 font-semibold">
                <Box className="size-4" />
                <span>Launch Interactive 3D Lab</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
