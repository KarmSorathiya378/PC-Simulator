/**
 * PC Builder Lab Brand Tokens & Signature Identity System.
 * Award-grade cyber-architectural tokens designed for hardware engineering software:
 * - Signature Electric Cyan-to-Indigo Laser accent.
 * - Quantum Core Luminescence & Gold Pin-1 alignment accents.
 * - Single-color monochrome and light/dark theme contrast primitives.
 */

import { BRAND_COLORS, BRAND_GRADIENTS } from './brandColors';

export { BRAND_COLORS, BRAND_GRADIENTS };
export type { BrandColorKey } from './brandColors';

export const BRAND_TOKENS = {
  name: 'PC Builder Lab',
  shortName: 'PCBLab',
  version: 'v2.0',
  tagline: 'Interactive 3D Hardware Engineering Simulator',

  // Signature Hero Accent System
  signatureAccent: {
    name: 'Electric Laser Cyan',
    hex: '#00F5FF',
    glow: '0 0 24px rgba(0, 245, 255, 0.38)',
    glowBorder: '1px solid rgba(0, 245, 255, 0.45)',
    gradient: 'linear-gradient(135deg, #00F5FF 0%, #0EA5E9 45%, #6366F1 100%)',
    gradientTailwind: 'bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500',
    textGradientTailwind: 'bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent',
  },

  // Quantum Processing Accent System
  quantumAccent: {
    name: 'Quantum Luminescence',
    hex: '#8B5CF6',
    glow: '0 0 24px rgba(139, 92, 246, 0.38)',
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 55%, #EC4899 100%)',
    gradientTailwind: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
    textGradientTailwind: 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent',
  },

  // Gold Alignment Accent (AM5 / LGA Pin 1 & Standoff Keying)
  goldAccent: {
    name: 'Pin 1 Keying Gold',
    hex: '#F59E0B',
    glow: '0 0 16px rgba(245, 158, 11, 0.35)',
    gradient: 'linear-gradient(135deg, #FEF08A 0%, #F59E0B 50%, #D97706 100%)',
    gradientTailwind: 'bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600',
  },

  // Chassis Surface Substrates
  substrate: {
    darkVoid: '#070A10',
    darkCarbon: '#090D16',
    darkSteel: '#1E293B',
    lightCanvas: '#F8FAFC',
    lightPanel: '#FFFFFF',
    lightBorder: '#E2E8F0',
  },

  // Typography Tokens
  typography: {
    displayFont: "'Space Grotesk', system-ui, sans-serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    monoFont: "'JetBrains Mono', monospace",
  },
} as const;

export type BrandTokens = typeof BRAND_TOKENS;
