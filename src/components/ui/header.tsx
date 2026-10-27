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
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "/learn", label: "Learn", icon: BookOpen, description: "Component anatomy & specs" },
  { path: "/guided", label: "Guided Assembly", icon: Wrench, description: "Step-by-step build guidance" },
  { path: "/challenge", label: "Challenge", icon: Trophy, description: "Score-based assembly test" },
  { path: "/connection", label: "Connection", icon: Cable, description: "Power & cable routing" },
  { path: "/results", label: "Results", icon: BarChart3, description: "Performance breakdown" },
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
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className="group flex items-center gap-2.5 transition-transform duration-150 active:scale-95"
            aria-label="PC Builder Lab Home"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/25 transition-transform group-hover:scale-105">
              <Cpu className="size-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-foreground">
                  PC Builder Lab
                </span>
                <Badge variant="secondary" className="hidden px-1.5 py-0 text-[10px] font-medium tracking-wide sm:inline-flex">
                  Interactive
                </Badge>
              </div>
              <span className="hidden text-[11px] text-muted-foreground sm:inline-block">
                Virtual Hardware Simulator
              </span>
            </div>
          </Link>

          {/* Desktop Mode Navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === "/guided" && location.pathname === "/assembly");
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-secondary text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Theme Toggle & CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="size-4 text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="size-4 text-slate-700 transition-transform duration-200 rotate-0 hover:-rotate-12" />
            )}
          </Button>

          <Link to="/guided" className="hidden sm:inline-flex">
            <Button size="sm" className="gap-1.5 shadow-sm active:scale-95 transition-transform">
              <Sparkles className="size-3.5" />
              <span>Start Assembly</span>
            </Button>
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="size-9 md:hidden text-muted-foreground hover:text-foreground"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 pt-2 pb-4 shadow-lg md:hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <NavLink
              to="/"
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === "/"
                  ? "bg-secondary text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Cpu className="size-4 text-primary" />
              <span>Overview & Home</span>
            </NavLink>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === "/guided" && location.pathname === "/assembly");
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.description}</span>
                </NavLink>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <Link to="/guided" className="w-full block">
              <Button className="w-full gap-2">
                <Sparkles className="size-4" />
                <span>Launch Virtual Assembly</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
