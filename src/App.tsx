import * as React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { HomeScreen } from "./features/home/HomeScreen";
import { LearnScreen } from "./features/learn/LearnScreen";
import { GuidedAssemblyScreen } from "./features/assembly/GuidedAssemblyScreen";
import { ChallengeScreen } from "./features/challenge/ChallengeScreen";
import { ConnectionScreen } from "./features/connection/ConnectionScreen";
import { ResultsScreen } from "./features/results/ResultsScreen";

/**
 * Unified Global App Shell
 * Provides ambient laboratory lighting, sticky glass navigation,
 * responsive viewports with zero horizontal overflow, and architectural footer.
 */
export const AppShell: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased overflow-x-hidden selection:bg-primary/20 selection:text-primary relative bg-blueprint-dots">
      {/* Ambient Atmospheric Top Glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(37,82,224,0.12),transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(67,107,238,0.18),transparent_70%)]"
        aria-hidden="true"
      />

      {/* Shared Design System Header */}
      <Header />

      {/* Primary Page Canvas */}
      <main className="flex-1 w-full mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 relative z-10 overflow-x-hidden">
        {children}
      </main>

      {/* Shared Design System Footer */}
      <Footer />
    </div>
  );
};

/**
 * Main Application Router & Shell Provider
 */
export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/learn" element={<LearnScreen />} />
          <Route path="/guided" element={<GuidedAssemblyScreen />} />
          {/* Alias /assembly to /guided for full backwards compatibility */}
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
