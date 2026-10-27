import * as React from "react";
import { Header } from "@/components/ui/header";

interface AppShellProps {
  children?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <Header />
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
      <footer className="border-t border-border/60 bg-muted/30 py-6 text-xs text-muted-foreground transition-colors">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">PC Builder Lab</span>
            <span>•</span>
            <span>Virtual Computer Assembly &amp; Hardware Learning Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-muted-foreground/80">
              Desktop-first educational simulator
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
