import * as React from "react";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";

interface AppShellProps {
  children?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary relative bg-blueprint-dots overflow-x-hidden">
      {/* Ambient Atmospheric Top Glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(14,165,233,0.14),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(14,165,233,0.18),transparent_70%)]"
        aria-hidden="true"
      />

      <Header />
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};
